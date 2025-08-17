import express from 'express'
import { LessonControllers } from './lesson.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import {
  QuestionCreateSchema,
  QuestionUpdateSchema,
  StemCreateSchema,
  StemUpdateSchema,
} from './lesson.validation'
import fileUploadHandler from '../../middleware/fileUploadHandler'
import { S3Helper } from '../../../helpers/image/s3helper'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'

const router = express.Router()

// --------------------
// Helper middleware for S3 uploads
// --------------------
const handleStemImageUpload = async (req: any, res: any, next: any) => {
  const payload = req.body
  try {
    const imageFiles = (req.files as any)?.image as Express.Multer.File[]
    if (imageFiles?.length) {
      const uploadedImageUrl = await S3Helper.uploadToS3(imageFiles[0], 'image')
      if (!uploadedImageUrl) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Failed to upload image',
        )
      }
      req.body = { stemPicture: uploadedImageUrl, ...payload }
    }
    next()
  } catch (error) {
    console.error({ error })
    res.status(400).json({ message: 'Failed to upload image' })
  }
}

// for delete stems
// route ---> /deleteStem/questions/:id/stems/:stemId

// for delete questions
// route ---> /deleteQuestion/lessons/:id/questions/:id

// --------------------
// Stems routes
// --------------------
router
  .route('/stems')
  .post(
    auth(USER_ROLES.ADMIN),
    fileUploadHandler(),
    handleStemImageUpload,
    validateRequest(StemCreateSchema),
    LessonControllers.createStem,
  )

router
  .route('/stems/:id')
  .patch(
    auth(USER_ROLES.ADMIN),
    fileUploadHandler(),
    handleStemImageUpload,
    validateRequest(StemUpdateSchema),
    LessonControllers.updateStem,
  )

// --------------------
// Questions routes
// --------------------
router
  .route('/questions')
  .post(
    auth(USER_ROLES.ADMIN),
    validateRequest(QuestionCreateSchema),
    LessonControllers.createQuestion,
  )

router
  .route('/questions/:id')
  .patch(
    auth(USER_ROLES.ADMIN),
    validateRequest(QuestionUpdateSchema),
    LessonControllers.updateQuestion,
  )

// --------------------
// Lessons routes
// --------------------
router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), LessonControllers.getAllLessons)
  .post(auth(USER_ROLES.ADMIN), LessonControllers.createLesson)

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN), LessonControllers.getSingleLesson)
  .patch(auth(USER_ROLES.ADMIN), LessonControllers.updateLesson)
  .delete(auth(USER_ROLES.ADMIN), LessonControllers.deleteLesson)

export const LessonRoutes = router

// import express from 'express'
// import { LessonControllers } from './lesson.controller'
// import auth from '../../middleware/auth'
// import { USER_ROLES } from '../../../enum/user'
// import validateRequest from '../../middleware/validateRequest'
// import {
//   QuestionCreateSchema,
//   QuestionUpdateSchema,
//   StemCreateSchema,
//   StemUpdateSchema,
// } from './lesson.validation'
// import fileUploadHandler from '../../middleware/fileUploadHandler'
// import { S3Helper } from '../../../helpers/image/s3helper'
// import ApiError from '../../../errors/ApiError'
// import { StatusCodes } from 'http-status-codes'
// import { Stem } from './lesson.model'

// const router = express.Router()

// // Stem and Question creation routes
// router.post(
//   '/stems',
//   auth(USER_ROLES.ADMIN),

//   fileUploadHandler(),

//   async (req, res, next) => {
//     const payload = req.body
//     try {
//       const imageFiles = (req.files as any)?.image as Express.Multer.File[]

//       if (imageFiles) {
//         // Take the first image only
//         const imageFile = imageFiles[0]

//         // Upload single image to S3
//         const uploadedImageUrl = await S3Helper.uploadToS3(imageFile, 'image')

//         if (!uploadedImageUrl) {
//           throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Failed to upload image',
//           )
//         }

//         // Merge into req.body for Zod validation
//         req.body = {
//           stemPicture: uploadedImageUrl,
//           ...payload,
//         }
//       }
//       next()
//     } catch (error) {
//       console.error({ error })
//       res.status(400).json({ message: 'Failed to upload image' })
//     }
//   },

//   validateRequest(StemCreateSchema),

//   LessonControllers.createStem,
// )

// router.post(
//   '/questions',
//   auth(USER_ROLES.ADMIN),
//   validateRequest(QuestionCreateSchema),
//   LessonControllers.createQuestion,
// )

// router.get('/', auth(USER_ROLES.ADMIN), LessonControllers.getAllLessons)

// router.get('/:id', auth(USER_ROLES.ADMIN), LessonControllers.getSingleLesson)

// router.patch('/:id', auth(USER_ROLES.ADMIN), LessonControllers.updateLesson)

// router.post(
//   '/',
//   auth(USER_ROLES.ADMIN),
//   /* validateRequest(LessonCreateSchema), */ LessonControllers.createLesson,
// )

// router.patch(
//   '/stems/:id',
//   auth(USER_ROLES.ADMIN),

//   fileUploadHandler(),

//   async (req, res, next) => {
//     const payload = req.body
//     try {
//       const imageFiles = (req.files as any)?.image as Express.Multer.File[]

//       if (imageFiles) {
//         // Take the first image only
//         const imageFile = imageFiles[0]

//         // Upload single image to S3
//         const uploadedImageUrl = await S3Helper.uploadToS3(imageFile, 'image')

//         if (!uploadedImageUrl) {
//           throw new ApiError(
//             StatusCodes.INTERNAL_SERVER_ERROR,
//             'Failed to upload image',
//           )
//         }

//         // Merge into req.body for Zod validation
//         req.body = {
//           stemPicture: uploadedImageUrl,
//           ...payload,
//         }
//       }
//       next()
//     } catch (error) {
//       console.error({ error })
//       res.status(400).json({ message: 'Failed to upload image' })
//     }
//   },

//   validateRequest(StemUpdateSchema),

//   LessonControllers.updateStem,
// )

// router.patch(
//   '/questions/:id',
//   auth(USER_ROLES.ADMIN),
//   validateRequest(QuestionUpdateSchema),
//   LessonControllers.updateQuestion,
// )

// router.delete('/:id', auth(USER_ROLES.ADMIN), LessonControllers.deleteLesson)

// export const LessonRoutes = router
