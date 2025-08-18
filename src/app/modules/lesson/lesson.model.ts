import mongoose, { Schema, model } from 'mongoose'
import { ILesson, IQuestion, IStem, LessonModel } from './lesson.interface'

// Stem Schema & Model
const StemSchema = new Schema<IStem>({
  stemTitle: { type: String, required: true },
  stemDescription: { type: String },
  stemPicture: { type: String },
})
export const Stem = model<IStem>('Stem', StemSchema)

// Question Schema & Model
const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  // store as index of options array
  correctAnswer: { type: Number, required: true },
  explanation: { type: String },
  stems: [{ type: Schema.Types.ObjectId, ref: 'Stem' }],
})

// Validate correctAnswer index is within options bounds
QuestionSchema.pre('validate', function (next) {
  const q: any = this
  if (typeof q.correctAnswer !== 'number') {
    return next(new Error('correctAnswer must be a number index'))
  }
  if (!Array.isArray(q.options) || q.options.length === 0) {
    return next(new Error('options must be a non-empty array'))
  }
  if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
    return next(new Error('correctAnswer index out of bounds'))
  }
  next()
})

export const Question = model<IQuestion>('Question', QuestionSchema)

// Lesson Schema & Model
const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['case_study', 'next_gen'],
      required: true,
    },
    lessonType: {
      type: String,
      enum: ['chart', 'video', 'text', 'simulation'],
      required: true,
    },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  },
  { timestamps: true },
)
export const Lesson: LessonModel = model<ILesson, LessonModel>(
  'Lesson',
  LessonSchema,
)
