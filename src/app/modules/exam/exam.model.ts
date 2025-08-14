// src/modules/exam/exam.model.ts
import { Schema, model } from 'mongoose';
import { Exam, ExamStats, Option, Question, QuestionType } from './exam.interface';

const optionSchema = new Schema<Option>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, default: false },
    explanation: { type: String, trim: true },
    mediaUrl: { type: String, trim: true },
  },
  { _id: true }
);

const questionSchema = new Schema<Question>(
  {
    type: {
      type: String,
      enum: Object.values(QuestionType),
      required: true,
    },

    // Step 01 : Stem
    stemTitle: { type: String, trim: true },
    stemDescription: { type: String, trim: true },

    // Step 02 : Question
    title: { type: String, required: true, trim: true },
    options: { type: [optionSchema], default: [] },
    allowMultiple: { type: Boolean, default: false },

    // Number input config
    numberAnswer: { type: Number },
    numberMin: { type: Number },
    numberMax: { type: Number },

    // Rearranging config
    rearrangeItems: { type: [String], default: [] },
    correctOrder: { type: [Number], default: [] },

    // Scoring/metadata
    points: { type: Number, default: 1 },
    negativePoints: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    explanation: { type: String, trim: true },
  },
  { _id: true, timestamps: true }
);

// Guards to keep consistency by type
questionSchema.pre('validate', function (next) {
  const q = this as any as Question;

  const isMCQ =
    q.type === QuestionType.CHECKBOX ||
    q.type === QuestionType.RADIO ||
    q.type === QuestionType.BOX ||
    q.type === QuestionType.CHART_BOX ||
    q.type === QuestionType.DROPDOWN;

  if (isMCQ) {
    if (!q.options || q.options.length === 0) {
      return next(new Error('Options are required for this question type'));
    }
    // radio/box must have exactly one correct
    const single =
      q.type === QuestionType.RADIO ||
      q.type === QuestionType.BOX ||
      (q.type === QuestionType.DROPDOWN && !q.allowMultiple);

    const correctCount = (q.options || []).filter(o => o.isCorrect).length;
    if (single && correctCount !== 1) {
      return next(new Error('Exactly one correct option is required'));
    }
  }

  if (q.type === QuestionType.NUMBER) {
    if (q.numberAnswer === undefined || q.numberAnswer === null) {
      return next(new Error('numberAnswer is required for number type'));
    }
  }

  if (q.type === QuestionType.REARRANGE) {
    if (!q.rearrangeItems?.length || !q.correctOrder?.length) {
      return next(new Error('rearrangeItems and correctOrder are required'));
    }
    if (q.correctOrder.length !== q.rearrangeItems.length) {
      return next(new Error('correctOrder length must match rearrangeItems'));
    }
  }

  next();
});

const statsSchema = new Schema<ExamStats>(
  {
    questionCount: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    avgHighestScore: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    lastAttemptAt: { type: Date },
  },
  { _id: false }
);

const examSchema = new Schema<Exam>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, unique: true, sparse: true },
    description: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    durationMinutes: { type: Number, min: 0 },
    passMark: { type: Number, min: 0, max: 100, default: 0 },

    questions: { type: [questionSchema], default: [] },
    stats: { type: statsSchema, default: () => ({}) },

    createdBy: { type: String, index: true },
  },
  { timestamps: true }
);

examSchema.index({ name: 'text', code: 'text' });

// Keep stats in sync
examSchema.pre('save', function (next) {
  const e = this as any as Exam;
  (e as any).stats.questionCount = e.questions?.length || 0;
  next();
});

export const ExamModel = model<Exam>('Exam', examSchema);
