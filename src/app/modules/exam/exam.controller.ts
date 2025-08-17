import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ExamServices } from './exam.service'
import { createExamZ, questionZ } from './exam.validation'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'

const createExam = catchAsync(async (req: Request, res: Response) => {
  // const validated = createExamZ.parse(req.body);
  const result = await ExamServices.createExam(req.body)
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Exam created successfully',
    data: result,
  })
})

const getAllExams = catchAsync(async (req: Request, res: Response) => {
  const result = await ExamServices.getAllExams()
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Exams fetched successfully',
    data: result,
  })
})

const getExamById = catchAsync(async (req: Request, res: Response) => {
  const { examId } = req.params
  const result = await ExamServices.getExamById(examId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Exam fetched successfully',
    data: result,
  })
})

const updateExam = catchAsync(async (req: Request, res: Response) => {
  const { examId } = req.params
  const result = await ExamServices.updateExam(examId, req.body)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Exam updated successfully',
    data: result,
  })
})

const deleteExam = catchAsync(async (req: Request, res: Response) => {
  const { examId } = req.params
  const result = await ExamServices.deleteExam(examId)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Exam deleted successfully',
    data: result,
  })
})

const addQuestionToExam = catchAsync(async (req: Request, res: Response) => {
  const { examId } = req.params
  // Normalize stems to array if present
  if (req.body.stems && !Array.isArray(req.body.stems)) {
    req.body.stems = [req.body.stems]
  }
  const validated = questionZ.parse(req.body)
  const result = await ExamServices.addQuestionToExam(examId, validated)
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Question added successfully',
    data: result,
  })
})

const updateQuestionInExam = catchAsync(async (req: Request, res: Response) => {
  const { examId, questionId } = req.params
  // Normalize stems to array if present
  if (req.body.stems && !Array.isArray(req.body.stems)) {
    req.body.stems = [req.body.stems]
  }
  const result = await ExamServices.updateQuestionInExam(
    examId,
    questionId,
    req.body,
  )
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Question updated successfully',
    data: result,
  })
})

const deleteQuestionFromExam = catchAsync(
  async (req: Request, res: Response) => {
    const { examId, questionId } = req.params
    const result = await ExamServices.deleteQuestionFromExam(examId, questionId)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Question deleted successfully',
      data: result,
    })
  },
)

export const ExamControllers = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  addQuestionToExam,
  updateQuestionInExam,
  deleteQuestionFromExam,
}
