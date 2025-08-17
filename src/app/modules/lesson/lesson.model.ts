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
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  stems: [{ type: Schema.Types.ObjectId, ref: 'Stem' }],
})
export const Question = model<IQuestion>('Question', QuestionSchema)

// Lesson Schema & Model
const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['case_study', 'next_gen'], required: true },
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
