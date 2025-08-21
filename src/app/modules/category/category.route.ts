import express from 'express'
import { CategoryController } from './category.controller'
import { CategoryValidations } from './category.validation'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'

const router = express.Router()

router.get('/', CategoryController.getAllCategorys)

router.get('/:id', CategoryController.getSingleCategory)

router.post(
  '/',
  auth(USER_ROLES.ADMIN),

  validateRequest(CategoryValidations.create),
  CategoryController.createCategory,
)

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),

  validateRequest(CategoryValidations.update),
  CategoryController.updateCategory,
)

router.delete('/:id', auth(USER_ROLES.ADMIN), CategoryController.deleteCategory)

export const CategoryRoutes = router
