import express from 'express';
import { LessonController } from './lesson.controller';
import { LessonValidations } from './lesson.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.ADMIN
  ),
  LessonController.getAllLessons
);

router.get(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),
  LessonController.getSingleLesson
);

router.post(
  '/',
  auth(
    USER_ROLES.ADMIN
  ),

  validateRequest(LessonValidations.create),
  LessonController.createLesson
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),

  validateRequest(LessonValidations.update),
  LessonController.updateLesson
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),
  LessonController.deleteLesson
);

export const LessonRoutes = router;
