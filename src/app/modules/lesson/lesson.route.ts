import express from 'express'
import { LessonControllers } from './lesson.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import { QuestionCreateSchema, StemCreateSchema } from './lesson.validation'
import fileUploadHandler from '../../middleware/fileUploadHandler'
import { S3Helper } from '../../../helpers/image/s3helper'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

// Stem and Question creation routes
router.post(
  '/stems',
  auth(USER_ROLES.ADMIN),

  fileUploadHandler(),

  async (req, res, next) => {
    const payload = req.body
    try {
      const imageFiles = (req.files as any)?.image as Express.Multer.File[]

      if (imageFiles) {
        // Take the first image only
        const imageFile = imageFiles[0]

        // Upload single image to S3
        const uploadedImageUrl = await S3Helper.uploadToS3(imageFile, 'image')

        if (!uploadedImageUrl) {
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Failed to upload image',
          )
        }

        // Merge into req.body for Zod validation
        req.body = {
          stemPicture: uploadedImageUrl,
          ...payload,
        }
      }
      next()
    } catch (error) {
      console.error({ error })
      res.status(400).json({ message: 'Failed to upload image' })
    }
  },

  validateRequest(StemCreateSchema),

  LessonControllers.createStem,
)

router.post(
  '/questions',
  auth(USER_ROLES.ADMIN),
  validateRequest(QuestionCreateSchema),
  LessonControllers.createQuestion,
)

router.get('/', auth(USER_ROLES.ADMIN), LessonControllers.getAllLessons)

router.get('/:id', auth(USER_ROLES.ADMIN), LessonControllers.getSingleLesson)

router.post(
  '/',
  auth(USER_ROLES.ADMIN),
  /* validateRequest(LessonCreateSchema), */ LessonControllers.createLesson,
)

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  /* validateRequest(), */ LessonControllers.updateLesson,
)

router.delete('/:id', auth(USER_ROLES.ADMIN), LessonControllers.deleteLesson)

export const LessonRoutes = router
