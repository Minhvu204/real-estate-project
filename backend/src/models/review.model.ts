import mongoose, { Schema, Document } from "mongoose";
import "./user.model";
import "./property.model";

export interface IReview extends Document {
  user_id: mongoose.Types.ObjectId;
  target_id: mongoose.Types.ObjectId;
  target_type: "property" | "agent" | "project";
  rating: number;
  comment: string;

  status: "pending" | "approved" | "rejected";
  is_hidden: boolean;
  rejection_reason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target_id: { type: Schema.Types.ObjectId, required: true },
    target_type: {
      type: String,
      enum: ["property", "agent", "project"],
      required: true,
    },

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    is_hidden: { type: Boolean, default: false },
    rejection_reason: { type: String, trim: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ target_id: 1 });
ReviewSchema.index({ target_type: 1 });
ReviewSchema.index({ user_id: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>("Review", ReviewSchema);
