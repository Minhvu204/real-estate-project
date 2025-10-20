// src/models/agreement.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAgreement extends Document {
  deal_id: mongoose.Types.ObjectId;
  details: string;
}

const AgreementSchema = new Schema<IAgreement>(
  {
    deal_id: { type: Schema.Types.ObjectId, ref: "Deal", required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAgreement>("Agreement", AgreementSchema);
