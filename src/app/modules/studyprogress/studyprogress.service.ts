import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IStudyprogress } from './studyprogress.interface'
import { Studyprogress } from './studyprogress.model'
import { JwtPayload } from 'jsonwebtoken'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { studyprogressSearchableFields } from './studyprogress.constants'
import { Types } from 'mongoose'

const createStudyprogress = async (
  user: JwtPayload,
  payload: IStudyprogress,
): Promise<IStudyprogress> => {
  try {
    const result = await Studyprogress.create(payload)
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Studyprogress, please try again with valid data.',
      )
    }

    return result
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError(StatusCodes.CONFLICT, 'Duplicate entry found')
    }
    throw error
  }
}

const getAllStudyprogresss = async (
  user: JwtPayload,
  filterables: any,
  pagination: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = filterables
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination)

  const andConditions = []

  // Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: studyprogressSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  // Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    })
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {}

  const [result, total] = await Promise.all([
    Studyprogress.find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate('studentId')
      .populate('examId')
      .populate('bookmarks'),
    Studyprogress.countDocuments(whereConditions),
  ])

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  }
}

const getSingleStudyprogress = async (id: string): Promise<IStudyprogress> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Studyprogress ID')
  }

  const result = await Studyprogress.findById(id)
    .populate('studentId')
    .populate('examId')
    .populate('bookmarks')
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested studyprogress not found, please try again with valid id',
    )
  }

  return result
}

const updateStudyprogress = async (
  user: JwtPayload | undefined,
  payload: Partial<IStudyprogress>,
): Promise<IStudyprogress | null> => {
  const isStudyProgressExist = await Studyprogress.findOne({
    studentId: user?.authId,
  });

  console.log(isStudyProgressExist)

  if (isStudyProgressExist) {
    const result = await Studyprogress.findByIdAndUpdate(
      { studentId: user?.authId },
      { $set: payload },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate('studentId')
      .populate('examId')
      .populate('bookmarks')

    return result
  }

  const created = await Studyprogress.create(payload)

  if (!created) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested studyprogress not found, please try again with valid id',
    )
  }

  return created
}

const deleteStudyprogress = async (id: string): Promise<IStudyprogress> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Studyprogress ID')
  }

  const result = await Studyprogress.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting studyprogress, please try again with valid id.',
    )
  }

  return result
}

export const StudyprogressServices = {
  createStudyprogress,
  getAllStudyprogresss,
  getSingleStudyprogress,
  updateStudyprogress,
  deleteStudyprogress,
}
