// src/models/category.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  category_name: {
    vi: string;
    en: string;
  };
}

const CategorySchema = new Schema<ICategory>(
  {
    category_name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

CategorySchema.index({ "category_name.vi": 1 }, { unique: true, sparse: true });
CategorySchema.index({ "category_name.en": 1 }, { unique: true, sparse: true });

export default mongoose.model<ICategory>("Category", CategorySchema);
