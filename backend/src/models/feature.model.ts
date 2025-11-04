// src/models/feature.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IFeature extends Document {
  feature_name: {
    vi: string;
    en: string;
  };
}

const FeatureSchema = new Schema<IFeature>(
  {
    feature_name: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

FeatureSchema.index({ "feature_name.vi": 1 }, { unique: true, sparse: true });
FeatureSchema.index({ "feature_name.en": 1 }, { unique: true, sparse: true });

export default mongoose.model<IFeature>("Feature", FeatureSchema);
