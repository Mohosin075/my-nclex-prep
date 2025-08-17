import { Request, Response } from 'express'
import { LessonServices } from './lesson.service'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { StatusCodes } from 'http-status-codes'
import { createStem, createQuestion } from './lesson.service'
import pick from '../../../shared/pick'
import { lessonFilterables } from './lesson.constants'
import { paginationFields } from '../../../interfaces/pagination'
import ApiError from '../../../errors/ApiError'

const createLesson = catchAsync(async (req: Request, res: Response) => {
  const lessonData = req.body

  const result = await LessonServices.createLesson(req.user!, lessonData)

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Lesson created successfully',
    data: result,
  })
})

const updateStem = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const stemData = req.body

  const result = await LessonServices.updateStem(id, stemData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Stem updated successfully',
    data: result,
  })
})

const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const questionData = req.body

  const result = await LessonServices.updateQuestion(id, questionData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Question updated successfully',
    data: result,
  })
})


const updateLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const lessonData = req.body

  const result = await LessonServices.updateLesson(id, lessonData)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson updated successfully',
    data: result,
  })
})

const getSingleLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await LessonServices.getSingleLesson(id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson retrieved successfully',
    data: result,
  })
})

const getAllLessons = catchAsync(async (req: Request, res: Response) => {
  const filterables = pick(req.query, lessonFilterables)
  const pagination = pick(req.query, paginationFields)

  const result = await LessonServices.getAllLessons(
    req.user!,
    filterables,
    pagination,
  )

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lessons retrieved successfully',
    data: result,
  })
})

const createStemController = catchAsync(async (req: Request, res: Response) => {
  const stemData = req.body
  const result = await createStem(stemData)
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Stem created successfully',
    data: result,
  })
})

const createQuestionController = catchAsync(
  async (req: Request, res: Response) => {
    const questionData = req.body
    const result = await createQuestion(questionData)
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Question created successfully',
      data: result,
    })
  },
)

const deleteLesson = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await LessonServices.deleteLesson(id)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Lesson deleted successfully',
    data: result,
  })
})

export const LessonControllers = {
  createLesson,
  updateStem,
  updateQuestion,
  updateLesson,
  getSingleLesson,
  getAllLessons,
  deleteLesson,
  createStem: createStemController,
  createQuestion: createQuestionController,
}
