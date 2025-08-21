import express from 'express'
import { StudyprogressController } from './studyprogress.controller'
import { StudyprogressValidations } from './studyprogress.validation'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'

const router = express.Router()

// Admin only routes
router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), StudyprogressController.getAllStudyprogresss)
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(StudyprogressValidations.create),
    StudyprogressController.createStudyprogress,
  )
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT),
    // validateRequest(StudyprogressValidations.update),
    StudyprogressController.updateStudyprogress,
  )

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN), StudyprogressController.getSingleStudyprogress)
  .delete(auth(USER_ROLES.ADMIN), StudyprogressController.deleteStudyprogress)

export const StudyprogressRoutes = router
