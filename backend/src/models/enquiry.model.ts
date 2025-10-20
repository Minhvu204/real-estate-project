// src/models/enquiry.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IEnquiry extends Document {
  property_id: mongoose.Types.ObjectId;
  buyer_id: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    buyer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
