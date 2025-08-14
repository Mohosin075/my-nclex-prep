// src/modules/exam/exam.types.ts
export enum QuestionType {
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  BOX = 'box',
  CHART_BOX = 'chart_box',
  DROPDOWN = 'dropdown',
  NUMBER = 'number',
  REARRANGE = 'rearrange',
} 

export interface Option {
  _id?: string
  label: string
  value: string
  isCorrect?: boolean
  explanation?: string
  mediaUrl?: string
}

export interface Question {
  _id?: string
  type: QuestionType

  // Step 01 : Stem
  stemTitle?: string
  stemDescription?: string

  // Step 02 : Question
  title: string // e.g., “Which apply?”
  options?: Option[] // MCQ-like types
  allowMultiple?: boolean // radio=false, checkbox=true, dropdown configurable

  // Number input
  numberAnswer?: number
  numberMin?: number
  numberMax?: number

  // Rearranging
  rearrangeItems?: string[] // items to sort
  correctOrder?: number[] // array of indices [2,0,1] etc.

  // Scoring/metadata
  points?: number // default 1
  negativePoints?: number // default 0
  tags?: string[]
  explanation?: string // global explanation
}

export interface ExamStats {
  questionCount: number
  attempts: number
  avgHighestScore: number // 0..100
  avgScore: number // 0..100
  lastAttemptAt?: Date
}

export interface Exam {
  _id?: string
  name: string // “Readiness Exam 01”
  code?: string // slug/shortcode
  description?: string
  isPublished: boolean

  durationMinutes?: number // optional timer
  passMark?: number // percentage

  questions: Question[]
  stats: ExamStats

  createdBy?: string // userId
}
