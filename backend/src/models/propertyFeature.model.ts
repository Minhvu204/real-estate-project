// src/models/propertyFeature.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPropertyFeature extends Document {
  property_id: mongoose.Types.ObjectId;
  feature_id: mongoose.Types.ObjectId;
}

const PropertyFeatureSchema = new Schema<IPropertyFeature>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    feature_id: { type: Schema.Types.ObjectId, ref: "Feature", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPropertyFeature>("PropertyFeature", PropertyFeatureSchema);
