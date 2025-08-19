import express from 'express'
import { ExamControllers } from './exam.controller'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'
import validateRequest from '../../middleware/validateRequest'
import fileUploadHandler from '../../middleware/fileUploadHandler'
import { S3Helper } from '../../../helpers/image/s3helper'
import ApiError from '../../../errors/ApiError'
import { StatusCodes } from 'http-status-codes'
import { ExamSchema, QuestionSchema, StemSchema } from './exam.validation'

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

// --------------------
// Stems routes
// --------------------
router.route('/stems').post(
  auth(USER_ROLES.ADMIN),

  validateRequest(StemSchema),

  (req, res, next) => {
    const payload = req.body

    req.body = payload.stems

    next()
  },

  ExamControllers.createStem,
)


// --------------------
// Questions routes
// --------------------
router.route('/questions').post(
  auth(USER_ROLES.ADMIN),
  validateRequest(QuestionSchema),

  (req, res, next) => {
    const payload = req.body

    req.body = payload.questions
    next()
  },

  ExamControllers.createQuestion,
)


// --------------------
// Exams routes
// --------------------
router
  .route('/')
  .get(auth(USER_ROLES.ADMIN), ExamControllers.getAllExams)
  .post(auth(USER_ROLES.ADMIN),
  validateRequest(ExamSchema),

  ExamControllers.createExam)

router
  .route('/:id')
  .get(auth(USER_ROLES.ADMIN), ExamControllers.getSingleExam)
  .delete(auth(USER_ROLES.ADMIN), ExamControllers.deleteExam)

export const ExamRoutes = router

// import express from 'express'
// import { ExamControllers } from './exam.controller'
// import auth from '../../middleware/auth'
// import { USER_ROLES } from '../../../enum/user'
// import validateRequest from '../../middleware/validateRequest'
// import {
//   QuestionCreateSchema,
//   QuestionUpdateSchema,
//   StemCreateSchema,
//   StemUpdateSchema,
// } from './exam.validation'
// import fileUploadHandler from '../../middleware/fileUploadHandler'
// import { S3Helper } from '../../../helpers/image/s3helper'
// import ApiError from '../../../errors/ApiError'
// import { StatusCodes } from 'http-status-codes'
// import { Stem } from './exam.model'

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

//   ExamControllers.createStem,
// )

// router.post(
//   '/questions',
//   auth(USER_ROLES.ADMIN),
//   validateRequest(QuestionCreateSchema),
//   ExamControllers.createQuestion,
// )

// router.get('/', auth(USER_ROLES.ADMIN), ExamControllers.getAllExams)

// router.get('/:id', auth(USER_ROLES.ADMIN), ExamControllers.getSingleExam)

// router.patch('/:id', auth(USER_ROLES.ADMIN), ExamControllers.updateExam)

// router.post(
//   '/',
//   auth(USER_ROLES.ADMIN),
//   /* validateRequest(ExamCreateSchema), */ ExamControllers.createExam,
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

//   ExamControllers.updateStem,
// )

// router.patch(
//   '/questions/:id',
//   auth(USER_ROLES.ADMIN),
//   validateRequest(QuestionUpdateSchema),
//   ExamControllers.updateQuestion,
// )

// router.delete('/:id', auth(USER_ROLES.ADMIN), ExamControllers.deleteExam)

// export const ExamRoutes = router
