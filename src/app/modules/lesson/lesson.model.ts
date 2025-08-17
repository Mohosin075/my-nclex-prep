import { Schema, model } from 'mongoose';
import { ILesson, LessonModel } from './lesson.interface';

const questionsItemSchema = new Schema({
  questionText: { type: String },
  options: { type: [String] },
  string: { type: String },
  array: { type: Schema.Types.Mixed },
  stemTitle: { type: String },
  stemDescription: { type: String },
  stemPicture: { type: String },
}, { _id: false });

const lessonSchema = new Schema<ILesson, LessonModel>({
  title: { type: String }, 
  category: { type: String },
  lessonType: { type: String },
  questions: [questionsItemSchema],
  createdAt: { type: Date },
  updatedAt: { type: Date },
}, {
  timestamps: true
});

export const Lesson = model<ILesson, LessonModel>('Lesson', lessonSchema);
