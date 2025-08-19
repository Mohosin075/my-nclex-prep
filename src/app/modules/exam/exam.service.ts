import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IExam, IExamFilter, IQuestion, IStem } from './exam.interface'
import { JwtPayload } from 'jsonwebtoken'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { examSearchableFields } from './exam.constants'
import mongoose, { Types } from 'mongoose'
import { Exam, Question, Stem } from './exam.model'
// Create Stem
export const createStem = async (payload: IStem) => {
  const stem = await Stem.create(payload)
  if (!stem) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Stem')
  }
  return stem
}

// Create Question
export const createQuestion = async (payload: IQuestion) => {
  const stemCount = await Stem.countDocuments({ _id: { $in: payload.stems } })

  if (stemCount !== payload.stems.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'One or more Stem IDs are invalid',
    )
  }

  const question = await Question.create(payload)
  if (!question) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Question')
  }

  return question
}

const createExam = async (user: JwtPayload, payload: IExam): Promise<IExam> => {
  if (payload.questions && payload.questions.length > 0) {
    const questionCount = await Question.countDocuments({
      _id: { $in: payload.questions },
    })

    if (questionCount !== payload.questions.length) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'One or more Question IDs are invalid',
      )
    }
  }

  const result = await Exam.create(payload)

  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to create Exam, please try again with valid data.',
    )
  }

  return result
}

const getAllExams = async (
  user: JwtPayload,
  filterables: IExamFilter,
  pagination: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = filterables

  console.log({ filterData })

  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination)

  const andConditions = []

  // 🔍 Search functionality
  if (searchTerm) {
    andConditions.push({
      $or: examSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })
  }

  // 🔎 Filter functionality
  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([key, value]) => ({
        [key]: value,
      })),
    })
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {}

  const [result, total] = await Promise.all([
    Exam.find(whereConditions)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: 'questions',
        populate: {
          path: 'stems',
          model: 'Stem',
        },
      }),
    Exam.countDocuments(whereConditions),
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

const getSingleExam = async (id: string): Promise<IExam> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Exam ID')
  }

  const result = await Exam.findById(id).populate({
    path: 'questions',
    populate: {
      path: 'stems',
      model: 'Stem',
    },
  })

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested exam not found, please try again with valid id',
    )
  }

  return result
}

const updateStem = async (
  id: string,
  payload: Partial<IStem>,
): Promise<IStem | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Stem ID')
  }

  const result = await Stem.findByIdAndUpdate(
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
      'Requested stem not found, please try again with valid id',
    )
  }

  return result
}

const updateExam = async (
  id: string,
  payload: Partial<IExam>,
): Promise<IExam | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Exam ID')
  }

  const result = await Exam.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $push: { questions: { $each: payload.questions } } },
    { new: true, runValidators: true },
  ).populate({
    path: 'questions',
    populate: { path: 'stems', model: 'Stem' },
  })

  if (!result) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'Requested exam not found, please try again with valid id',
    )
  }

  return result
}

const updateQuestion = async (
  id: string,
  payload: Partial<IQuestion>,
): Promise<IQuestion | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Question ID')
  }

  const result = await Question.findByIdAndUpdate(
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
      'Requested question not found, please try again with valid id',
    )
  }

  return result
}

const deleteExam = async (id: string) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // ✅ Step 1: Aggregate exam with questions + stems
    const examAgg = await Exam.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questions',
        },
      },
      {
        $lookup: {
          from: 'stems',
          localField: 'questions.stems',
          foreignField: '_id',
          as: 'stems',
        },
      },
    ]).session(session)

    if (!examAgg.length) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found')
    }

    const exam = examAgg[0]

    //  Step 2: Collect Question IDs & Stem IDs
    const questionIds = exam.questions.map((q: any) => q._id)
    const stemIds = exam.stems.map((s: any) => s._id)

    //  Step 3: Delete stems
    if (stemIds.length) {
      await Stem.deleteMany({ _id: { $in: stemIds } }, { session })
    }

    //  Step 4: Delete questions
    if (questionIds.length) {
      await Question.deleteMany({ _id: { $in: questionIds } }, { session })
    }
    await Exam.findByIdAndDelete(id, { session })

    await session.commitTransaction()
    session.endSession()

    return exam
  } catch (err) {
    await session.abortTransaction()
    session.endSession()
    throw err
  }
}

export const ExamServices = {
  createExam,
  getAllExams,
  getSingleExam,
  deleteExam,
  updateStem,
  updateQuestion,
  updateExam,
}
