import { Schema, model } from 'mongoose'
import { ICategory, CategoryModel } from './category.interface'

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: { type: String },
    description: { type: String },
    image: { type: String },
  },
  {
    timestamps: true,
  },
)

export const Category = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
)
