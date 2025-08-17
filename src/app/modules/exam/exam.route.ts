import { Router } from 'express'
import { ExamControllers } from './exam.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { createExamZ } from './exam.validation'

const router = Router()
// Note: Question endpoints support multiple stems per question via the 'stems' array field.

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  validateRequest(createExamZ),
  ExamControllers.createExam,
)
router.get('/', ExamControllers.getAllExams)
router.get('/:examId', ExamControllers.getExamById)
router.put('/:examId', ExamControllers.updateExam)
router.delete('/:examId', ExamControllers.deleteExam)

// Question routes
router.post('/:examId/questions', ExamControllers.addQuestionToExam)
router.put(
  '/:examId/questions/:questionId',
  ExamControllers.updateQuestionInExam,
)
router.delete(
  '/:examId/questions/:questionId',
  ExamControllers.deleteQuestionFromExam,
)

export const ExamRoutes = router
