// src/models/notification.model.ts
import mongoose, { Document, Schema } from "mongoose";

export type NotificationType = "appointment" | "offer" | "chat" | "property" | "system";

export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  title: { vi: string; en: string };
  message: { vi: string; en: string };
  type?: NotificationType;
  related_id?: mongoose.Types.ObjectId; // ID của entity liên quan (appointment_id, offer_id, property_id, etc.)
  action_url?: string; // URL để navigate khi click notification
  is_read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    message: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ["appointment", "offer", "chat", "property", "system"],
      default: "system",
    },
    related_id: { type: Schema.Types.ObjectId },
    action_url: { type: String },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index để query nhanh
NotificationSchema.index({ user_id: 1, is_read: 1 });
NotificationSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.model<INotification>("Notification", NotificationSchema);