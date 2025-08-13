import { Model, Types } from 'mongoose';

export interface IStudymaterialFilterables {
  searchTerm?: string;
  name?: string;
  category?: string;
  size?: string;
  fileUrl?: string;
}

export interface IStudymaterial {
  _id: Types.ObjectId;
  name: string;
  category: string;
  size: string;
  uploadDate: Date;
  type: string;
  fileUrl: string;
  uploadedBy: Types.ObjectId;
}

export type StudymaterialModel = Model<IStudymaterial, {}, {}>;
