import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'
import { IExam, IExamFilter, IQuestion, IStem } from './exam.interface'
import { JwtPayload } from 'jsonwebtoken'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { examSearchableFields } from './exam.constants'
import mongoose, { Types } from 'mongoose'
import { Exam, Question, Stem } from './exam.model'
import { ConfirmStatus } from '../../../enum/exam'
// Create Stem
export const createStem = async (payload: IStem[]) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Stem data')
  }

  const createdStems = await Stem.insertMany(payload)

  if (!createdStems) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Stem')
  }
  const stemIds = createdStems.map(stem => stem._id)
  return stemIds
}

// Create Question
export const createQuestion = async (payload: IQuestion, user: JwtPayload) => {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Question data')
  }

  const status = ConfirmStatus.IN_PROGRESS

  const refId = `${user.authId}_${status}`

  payload.map(p => {
    p.refId = refId
  })

  const question = await Question.insertMany(payload)

  if (!question) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Question')
  }

  const ids = question.map(q => q._id)

  return ids
}

const createExam = async (user: JwtPayload, payload: IExam) => {
  const session = await Exam.startSession()
  session.startTransaction()

  try {
    // in-progress
    const refId = `${user.authId}_${ConfirmStatus.IN_PROGRESS}`

    const questions = await Question.find({ refId }).session(session)

    if (questions.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'No questions available for this exam. Please create questions first before creating the exam.',
      )
    }

    const ids = questions.map(q => q._id.toString())

    const allExams = (await Exam.find({ isPublished: true }).session(session))
      .length

    payload.questions = ids
    payload.name = payload.name || `NCLEX Practice Exam - ${allExams + 1}`

    // Create Exam
    const result = await Exam.create([payload], { session })
    console.log({ result })

    if (!result || result.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Exam, please try again with valid data.',
      )
    }

    const confirm_refId = `${user.authId}_${ConfirmStatus.CONFIRMED}`

    // Update all question statuses after exam creation
    await Question.updateMany(
      { _id: { $in: ids } },
      { $set: { refId: confirm_refId } },
      { session },
    )

    // Publish the exam
    const Published = await Exam.findByIdAndUpdate(
      result[0]._id,
      { $set: { isPublished: true } },
      { new: true, session },
    )

    // Commit transaction
    await session.commitTransaction()
    session.endSession()

    return Published
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
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
