import { Model, Types } from 'mongoose'

export interface SessionsItem {
  startTime: Date
  endTime?: Date
  durationMinutes: number
  topics: string[]
  string: string
  array: Types.ObjectId
  Question: string
}

export interface WeakTopicsItem {
  topic: string
  accuracy: number
  totalAttempts: number
}

export interface IStudyprogress {
  _id: Types.ObjectId
  studentId: Types.ObjectId
  examId: Types.ObjectId
  sessions: SessionsItem[]
  totalStudyTime: number
  lastStudied: Date
  bookmarks: Types.ObjectId[]
  weakTopics: WeakTopicsItem[]
  status: 'active' | 'completed' | 'paused'
}

export type StudyprogressModel = Model<IStudyprogress, {}, {}>
