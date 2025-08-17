import { Model, Types } from 'mongoose'

export interface ILessonFilter {
  title?: string
  category?: 'case_study' | 'next_gen'
  lessonType?: 'chart' | 'video' | 'text' | 'simulation'
  searchTerm?: string
}

// Stem model
export interface IStem {
  _id?: string
  stemTitle: string
  stemDescription?: string
  stemPicture?: string
}

// Question model
export interface IQuestion {
  _id?: string
  questionText: string
  options: string[]
  correctAnswer: string
  explanation: string
  stems: string[] // Array of Stem ObjectIds
}

// Lesson model
export interface ILesson {
  _id?: string
  title: string
  category: 'case_study' | 'next_gen'
  lessonType: 'chart' | 'video' | 'text' | 'simulation'
  questions: string[] // Array of Question ObjectIds
  createdAt: Date
  updatedAt: Date
}

export type LessonModel = Model<ILesson, {}, {}>
