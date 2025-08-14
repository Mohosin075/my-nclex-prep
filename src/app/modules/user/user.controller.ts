import { Request, Response, NextFunction } from 'express'

import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'

import { UserServices } from './user.service'
import pick from '../../../shared/pick'
import { paginationFields } from '../../../interfaces/pagination'
import { JwtPayload } from 'jsonwebtoken'



const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { image, ...userData } = req.body

  image && (userData.profile = image[0])
  const result = await UserServices.updateProfile(req.user!, userData)
  sendResponse<String>(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  })
})


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields)
  const result = await UserServices.getAllUsers(paginationOptions)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params
  const result = await UserServices.deleteUser(userId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  })
})

const deleteProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload
  const result = await UserServices.deleteProfile(user.authId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile deleted successfully',
    data: result,
  })
})

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params
  const result = await UserServices.getUserById(userId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params
  const { status } = req.body
  const result = await UserServices.updateUserStatus(userId, status)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User status updated successfully',
    data: result,
  })
})


const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getProfile(req.user!)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  })
})

export const UserController = {
  updateProfile,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUserStatus,
  getProfile,
  deleteProfile
}
