import { Schema, model } from 'mongoose';
import { IStudymaterial, StudymaterialModel } from './studymaterial.interface'; 

const studymaterialSchema = new Schema<IStudymaterial, StudymaterialModel>({
  name: { type: String },
  category: { type: String },
  size: { type: String },
  uploadDate: { type: Date },
  type: { type: String },
  fileUrl: { type: String },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

export const Studymaterial = model<IStudymaterial, StudymaterialModel>('Studymaterial', studymaterialSchema);
