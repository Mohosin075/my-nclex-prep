import { Model, Types } from 'mongoose';

export interface QuestionsItem {
  questionText: string;
  options: string[];
  array: Record<string, any>;
  stemTitle: string;
  stemDescription?: string;
  stemPicture?: string;
}

export interface ILessonFilterables {
  searchTerm?: string;
  title?: string;
}

export interface ILesson {
  _id: Types.ObjectId;
  title: string;
  category: string;
  lessonType: string;
  questions: QuestionsItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type LessonModel = Model<ILesson, {}, {}>;
