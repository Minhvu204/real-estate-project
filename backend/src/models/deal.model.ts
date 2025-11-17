// src/models/deal.model.ts
import mongoose, { Document, Schema } from "mongoose";
import "./offer.model";

export type DealStatus =
  | "active"
  | "awaiting_contract"
  | "contract_under_review"
  | "escrow_funded"
  | "completed"
  | "cancelled";

export interface IDeal extends Document {
  property_id: mongoose.Types.ObjectId;
  offer_id: mongoose.Types.ObjectId;
  buyer_id: mongoose.Types.ObjectId;
  seller_id: mongoose.Types.ObjectId;
  agent_id: mongoose.Types.ObjectId;
  status: DealStatus;
  amounts: {
    agreed_price: number;
    currency: string;
    platform_fee?: number;
    agent_fee?: number;
    seller_payout?: number;
  };
  audit: {
    created_from_offer_at?: Date;
    completed_at?: Date;
    cancelled_at?: Date;
    cancellation_reason?: string;
  };
  compliance: {
    kyc_verified_buyer: boolean;
    kyc_verified_seller: boolean;
  };
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    property_id: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    offer_id: { type: Schema.Types.ObjectId, ref: "Offer", required: true },
    buyer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agent_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "awaiting_contract", "contract_under_review", "escrow_funded", "completed", "cancelled"],
      default: "active",
    },
    amounts: {
      agreed_price: { type: Number, required: true },
      currency: { type: String, default: "VND" },
      platform_fee: { type: Number },
      agent_fee: { type: Number },
      seller_payout: { type: Number },
    },
    audit: {
      created_from_offer_at: { type: Date },
      completed_at: { type: Date },
      cancelled_at: { type: Date },
      cancellation_reason: { type: String },
    },
    compliance: {
      kyc_verified_buyer: { type: Boolean, default: false },
      kyc_verified_seller: { type: Boolean, default: false },
    },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

DealSchema.index({ seller_id: 1, agent_id: 1, buyer_id: 1, status: 1 });
DealSchema.index({ property_id: 1 });
DealSchema.index({ "audit.created_from_offer_at": -1 });
DealSchema.index({ "audit.completed_at": -1 });

export default mongoose.model<IDeal>("Deal", DealSchema);
