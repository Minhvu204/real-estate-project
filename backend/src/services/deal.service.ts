import mongoose from "mongoose";
import Deal, { DealStatus, IDeal } from "../models/deal.model";

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const dealService = {
  async getDealById(dealId: string) {
    if (!mongoose.Types.ObjectId.isValid(dealId)) {
      return null;
    }

    return Deal.findById(dealId)
      .populate("property_id")
      .populate("buyer_id")
      .populate("seller_id")
      .populate("agent_id")
      .populate("offer_id");
  },

  async getDealForAgent(dealId: string, agentId: string) {
    if (!mongoose.Types.ObjectId.isValid(dealId) || !mongoose.Types.ObjectId.isValid(agentId)) {
      return null;
    }

    return Deal.findOne({
      _id: toObjectId(dealId),
      agent_id: toObjectId(agentId),
    })
      .populate("property_id")
      .populate("buyer_id")
      .populate("seller_id")
      .populate("agent_id")
      .populate("offer_id");
  },

  async getDealForSeller(dealId: string, sellerId: string) {
    if (!mongoose.Types.ObjectId.isValid(dealId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return null;
    }

    return Deal.findOne({
      _id: toObjectId(dealId),
      seller_id: toObjectId(sellerId),
    })
      .populate("property_id")
      .populate("buyer_id")
      .populate("seller_id")
      .populate("agent_id")
      .populate("offer_id");
  },

  isStatusAllowingContractUpload(status: DealStatus) {
    const allowedStatuses: DealStatus[] = ["active", "awaiting_contract", "contract_under_review"];
    return allowedStatuses.includes(status);
  },

  async updateStatus(
    dealId: string,
    status: DealStatus,
    options: Partial<Pick<IDeal, "audit" | "amounts" | "compliance" | "meta">> = {}
  ) {
    return Deal.findByIdAndUpdate(
      dealId,
      {
        status,
        ...options,
      },
      { new: true }
    );
  },
};

