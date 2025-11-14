// src/models/appointment.model.ts
import mongoose, { Document, Schema } from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export interface IAppointment extends Document {
  property_id: mongoose.Types.ObjectId;
  buyer_id: mongoose.Types.ObjectId;
  agent_id: mongoose.Types.ObjectId;
  seller_id: mongoose.Types.ObjectId;
  time: Date;
  note?: string;
  location?: string;
  status: AppointmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    buyer_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    agent_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    time: {
      type: Date,
      required: true,
      validate: {
        validator(value: Date) {
          if (!(this as any).isNew && !(this as any).isModified("time")) {
            return true;
          }
          return (
            value instanceof Date &&
            !Number.isNaN(value.valueOf()) &&
            value > new Date()
          );
        },
        message: "Thời gian lịch hẹn phải nằm trong tương lai",
      },
    },
    note: { type: String, trim: true },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

AppointmentSchema.index({ buyer_id: 1, property_id: 1, status: 1 });
AppointmentSchema.index({ agent_id: 1, status: 1, time: 1 });
AppointmentSchema.index({ seller_id: 1, status: 1, time: 1 });

export default mongoose.model<IAppointment>("Appointment", AppointmentSchema);
