import mongoose, { Document, Schema } from "mongoose";

export interface IWard extends Document {
  ward_name: {
    vi: string;
    en: string;
  };
  district_id: mongoose.Types.ObjectId;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WardSchema = new Schema<IWard>(
  {
    ward_name: {
      vi: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    district_id: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IWard>("Ward", WardSchema);
