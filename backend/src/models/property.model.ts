import mongoose, { Document, Schema } from "mongoose";
// Import các model để Mongoose đăng ký schema trước khi populate
import "./city.model";
import "./category.model";
import "./propertyType.model";
import "./feature.model";
import "./user.model";

export interface IProperty extends Document {
  title: {
    vi: string;
    en: string;
  };
  description?: {
    vi?: string;
    en?: string;
  };
  price: number;
  address: {
    vi: string;
    en: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  unit: "m2" | "ft2";
  yearBuilt: number;
  floors: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  city_id: mongoose.Types.ObjectId;
  type_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  owner_id: mongoose.Types.ObjectId;
  agent_id?: mongoose.Types.ObjectId;
  assignmentHistory?: Array<{
    agent_id?: mongoose.Types.ObjectId;
    assignedBy?: mongoose.Types.ObjectId;
    action: "assign" | "remove" | "reject" | "cancel" | "request";
    assignedAt: Date;
  }>;
  features?: mongoose.Types.ObjectId[];
  images?: string[];
  status: "available" | "pending" | "approved" | "sold" | "rejected";
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  publishedAt?: Date;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    title: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      vi: { type: String },
      en: { type: String },
    },
    price: { type: Number, required: true },
    address: {
      vi: { type: String, required: true },
      en: { type: String, required: true },
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true },
    unit: { type: String, enum: ["m2", "ft2"], default: "m2" },
    yearBuilt: { type: Number },
    floors: { type: Number, default: 1 },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    city_id: { type: Schema.Types.ObjectId, ref: "City", required: true },
    type_id: {
      type: Schema.Types.ObjectId,
      ref: "PropertyType",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agent_id: { type: Schema.Types.ObjectId, ref: "User" },
    assignmentHistory: [
      {
        agent_id: { type: Schema.Types.ObjectId, ref: "User" },
        assignedBy: { type: Schema.Types.ObjectId, ref: "User" },
        action: {
          type: String,
          enum: ["assign", "remove", "reject", "cancel", "request"],
        },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
    features: [{ type: Schema.Types.ObjectId, ref: "Feature" }],
    images: [String],
    status: {
      type: String,
      enum: ["available", "pending", "approved", "sold", "rejected"],
      default: "available",
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    publishedAt: { type: Date },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProperty>("Property", PropertySchema);
