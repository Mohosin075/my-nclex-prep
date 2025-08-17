import { Stem, Question } from './lesson.model'
// Create Stem
export const createStem = async (payload: {
  stemTitle: string
  stemDescription?: string
  stemPicture?: string
}) => {
  const stem = await Stem.create(payload)
  if (!stem) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Stem')
  }
  return stem
}

// Create Question
export const createQuestion = async (payload: {
  questionText: string
  options: string[]
  correctAnswer: string
  explanation: string
  stems: string[]
}) => {
  const question = await Question.create(payload)
  if (!question) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Question')
  }
  return question
}
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { ILesson } from './lesson.interface'
import { Lesson } from './lesson.model'
import { JwtPayload } from 'jsonwebtoken'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { lessonSearchableFields } from './lesson.constants'
import { Types } from 'mongoose'

const createLesson = async (
  user: JwtPayload,
  payload: ILesson,
): Promise<ILesson> => {
  try {
    const result = await Lesson.create(payload)
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Lesson, please try again with valid data.',
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

const getAllLessons = async (
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
      $or: lessonSearchableFields.map(field => ({
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
    Lesson.find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder }),
    Lesson.countDocuments(whereConditions),
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

const getSingleLesson = async (id: string): Promise<ILesson> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Lesson ID')
  }

  const result = await Lesson.findById(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested lesson not found, please try again with valid id',
    )
  }

  return result
}

const updateLesson = async (
  id: string,
  payload: Partial<ILesson>,
): Promise<ILesson | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Lesson ID')
  }

  const result = await Lesson.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: payload },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested lesson not found, please try again with valid id',
    )
  }

  return result
}

const deleteLesson = async (id: string): Promise<ILesson> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Lesson ID')
  }

  const result = await Lesson.findByIdAndDelete(id)
  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Something went wrong while deleting lesson, please try again with valid id.',
    )
  }

  return result
}

export const LessonServices = {
  createLesson,
  getAllLessons,
  getSingleLesson,
  updateLesson,
  deleteLesson,
}
