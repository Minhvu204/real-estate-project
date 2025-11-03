// src/models/city.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICity extends Document {
  city_name: {
    vi: string;
    en: string;
  };
}

const CitySchema = new Schema<ICity>(
  {
    city_name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Compound index để đảm bảo unique city_name
CitySchema.index({ "city_name.vi": 1 }, { unique: true, sparse: true });
CitySchema.index({ "city_name.en": 1 }, { unique: true, sparse: true });

export default mongoose.model<ICity>("City", CitySchema);
