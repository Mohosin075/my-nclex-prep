import express from 'express'
import { UserController } from './user.controller'
import { UserValidations } from './user.validation'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import {
  fileAndBodyProcessorUsingDiskStorage,
} from '../../middleware/processReqBody'

const router = express.Router()


router.get(
  '/profile',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.GUEST,
  ),
  UserController.getProfile
)

router.patch(
  '/profile',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.GUEST,
  ),
  fileAndBodyProcessorUsingDiskStorage(),
  validateRequest(UserValidations.updateUserZodSchema),
  UserController.updateProfile,
)
router.delete(
  '/profile',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.GUEST,
  ),
  UserController.deleteProfile,
)

router.route('/')
.get(auth(USER_ROLES.ADMIN), UserController.getAllUsers)


router.route('/:userId')
.get(auth(USER_ROLES.ADMIN), UserController.getUserById)
.delete(auth(USER_ROLES.ADMIN), UserController.deleteUser)
.patch(auth(USER_ROLES.ADMIN), validateRequest(UserValidations.updateUserStatusZodSchema), UserController.updateUserStatus)

export const UserRoutes = router
