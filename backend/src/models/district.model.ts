import mongoose, { Document, Schema } from "mongoose";

export interface IDistrict extends Document {
  district_name: {
    vi: string;
    en: string;
  };
  city_id: mongoose.Types.ObjectId;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>(
  {
    district_name: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    city_id: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IDistrict>("District", DistrictSchema);
