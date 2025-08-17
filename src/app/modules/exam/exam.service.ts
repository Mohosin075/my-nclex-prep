import { Types } from 'mongoose'
import { ExamModel } from './exam.model'
import { Exam, Question } from './exam.interface'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../../../errors/ApiError'

const createExam = async (payload: Exam) => {
  const exam = await ExamModel.create(payload)
  return exam
}

const getAllExams = async () => {
  const exams = await ExamModel.find().sort({ createdAt: -1 })
  return exams
}

const getExamById = async (examId: string) => {
  if (!Types.ObjectId.isValid(examId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Exam ID')
  }
  const exam = await ExamModel.findById(examId)
  if (!exam) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found')
  }
  return exam
}

const updateExam = async (examId: string, payload: Partial<Exam>) => {
  if (!Types.ObjectId.isValid(examId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Exam ID')
  }
  const updated = await ExamModel.findByIdAndUpdate(examId, payload, {
    new: true,
  })
  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found')
  }
  return updated
}

const deleteExam = async (examId: string) => {
  if (!Types.ObjectId.isValid(examId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Exam ID')
  }
  const deleted = await ExamModel.findByIdAndDelete(examId)
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found')
  }
  return deleted
}

const addQuestionToExam = async (examId: string, question: Question) => {
  if (!Types.ObjectId.isValid(examId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid Exam ID')
  }
  // Ensure stems is an array if present
  if (question.stems && !Array.isArray(question.stems)) {
    question.stems = [question.stems]
  }
  const updatedExam = await ExamModel.findByIdAndUpdate(
    examId,
    { $push: { questions: question } },
    { new: true },
  )
  if (!updatedExam) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exam not found')
  }
  return updatedExam
}

const updateQuestionInExam = async (
  examId: string,
  questionId: string,
  payload: Partial<Question>,
) => {
  if (!Types.ObjectId.isValid(examId) || !Types.ObjectId.isValid(questionId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid IDs provided')
  }

  const exam = await ExamModel.findOneAndUpdate(
    { _id: examId, 'questions._id': questionId },
    { $set: { 'questions.$': { ...payload, _id: questionId } } },
    { new: true },
  )

  if (!exam) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exam or question not found')
  }
  return exam
}

const deleteQuestionFromExam = async (examId: string, questionId: string) => {
  if (!Types.ObjectId.isValid(examId) || !Types.ObjectId.isValid(questionId)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid IDs provided')
  }
  const updated = await ExamModel.findByIdAndUpdate(
    examId,
    { $pull: { questions: { _id: questionId } } },
    { new: true },
  )
  if (!updated) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Exam or question not found')
  }
  return updated
}

export const ExamServices = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  addQuestionToExam,
  updateQuestionInExam,
  deleteQuestionFromExam,
}
