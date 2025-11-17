import mongoose from "mongoose";
import Offer, { IOffer, OfferStatus, SUPPORTED_OFFER_CURRENCIES } from "../models/offer.model";
import Property from "../models/property.model";
import User from "../models/user.model";
import { notifyNewOffer, notifySellerNewOffer } from "../utils/notificationHelper";

type SupportedCurrency = (typeof SUPPORTED_OFFER_CURRENCIES)[number];

interface CreateOfferInput {
  propertyId: string;
  amount: number;
  note?: string;
  currency?: SupportedCurrency;
  expiresAt?: Date | string;
  attachments?: string[];
  meta?: Record<string, any>;
}

interface OfferListFilters {
  page?: number;
  limit?: number;
  status?: OfferStatus | OfferStatus[];
  propertyId?: string;
}

const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const offerService = {
  async createOffer(buyerId: string, payload: CreateOfferInput) {
    const { propertyId, amount, note, currency = "VND", expiresAt, attachments, meta } = payload;

    if (!mongoose.isValidObjectId(propertyId)) {
      const err: any = new Error("Property không hợp lệ");
      err.status = 400;
      throw err;
    }

    if (!amount || Number(amount) <= 0) {
      const err: any = new Error("Giá trị offer phải lớn hơn 0");
      err.status = 400;
      throw err;
    }

    if (!SUPPORTED_OFFER_CURRENCIES.includes(currency)) {
      const err: any = new Error("Loại tiền tệ không được hỗ trợ");
      err.status = 400;
      throw err;
    }

    const property = await Property.findOne({ _id: propertyId, deleted: false }).lean();
    if (!property) {
      const err: any = new Error("Property không tồn tại");
      err.status = 404;
      throw err;
    }

    if (String(property.owner_id) === buyerId) {
      const err: any = new Error("Không thể tạo offer cho property của chính bạn");
      err.status = 400;
      throw err;
    }

    if (property.status === "rejected" || property.status === "sold") {
      const err: any = new Error("Property không khả dụng để tạo offer");
      err.status = 400;
      throw err;
    }

    if (expiresAt) {
      const expiresDate = new Date(expiresAt);
      if (Number.isNaN(expiresDate.getTime())) {
        const err: any = new Error("Thời hạn offer không hợp lệ");
        err.status = 400;
        throw err;
      }
      if (expiresDate <= new Date()) {
        const err: any = new Error("Thời hạn offer phải ở tương lai");
        err.status = 400;
        throw err;
      }
    }

    const buyer = await User.findById(buyerId).select("fullName").lean();
    if (!buyer) {
      const err: any = new Error("Người mua không tồn tại");
      err.status = 404;
      throw err;
    }

    const sellerId = String(property.owner_id);
    const agentId = property.agent_id ? String(property.agent_id) : undefined;

    const offerData: Partial<IOffer> = {
      property_id: toObjectId(propertyId),
      buyer_id: toObjectId(buyerId),
      seller_id: toObjectId(sellerId),
      agent_id: agentId ? toObjectId(agentId) : undefined,
      amount: Number(amount),
      currency,
      note,
      status: "pending",
      expires_at: expiresAt ? new Date(expiresAt) : undefined,
      attachments: Array.isArray(attachments) ? attachments.filter((item) => typeof item === "string") : undefined,
      meta: meta && typeof meta === "object" && !Array.isArray(meta) ? meta : undefined,
    };

    const offer = await Offer.create(offerData);

    // Notifications (best-effort)
    const propertyTitle =
      typeof property.title === "object" && property.title
        ? property.title.vi || property.title.en || "property"
        : "property";

    const notifyTasks: Promise<any>[] = [];
    if (agentId) {
      notifyTasks.push(notifyNewOffer(agentId, buyer.fullName || "Buyer", propertyTitle, Number(amount), String(offer._id)));
    }
    if (sellerId) {
      notifyTasks.push(
        notifySellerNewOffer(sellerId, buyer.fullName || "Buyer", propertyTitle, Number(amount), String(offer._id))
      );
    }
    if (notifyTasks.length) {
      Promise.allSettled(notifyTasks).catch((err) => {
        console.error("Failed to send offer notifications:", err);
      });
    }

    return offer;
  },

  async getOffersByBuyer(buyerId: string, filters: OfferListFilters = {}) {
    const { page = 1, limit = 10, status, propertyId } = filters;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Math.min(Number(limit) || 10, 50), 1);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {
      buyer_id: toObjectId(buyerId),
    };

    if (status) {
      query.status = Array.isArray(status) ? { $in: status } : status;
    }

    if (propertyId) {
      if (!mongoose.isValidObjectId(propertyId)) {
        const err: any = new Error("property_id không hợp lệ");
        err.status = 400;
        throw err;
      }
      query.property_id = toObjectId(propertyId);
    }

    const [offers, total] = await Promise.all([
      Offer.find(query)
        .populate("property_id", "title price images status owner_id agent_id")
        .populate("agent_id", "fullName email phone avatar")
        .populate("seller_id", "fullName email phone avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Offer.countDocuments(query),
    ]);

    return {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      data: offers,
    };
  },

  async cancelOffer(offerId: string, buyerId: string) {
    if (!mongoose.isValidObjectId(offerId)) {
      const err: any = new Error("Offer không hợp lệ");
      err.status = 400;
      throw err;
    }

    const offer = await Offer.findOne({
      _id: offerId,
      buyer_id: toObjectId(buyerId),
    });

    if (!offer) {
      const err: any = new Error("Offer không tồn tại");
      err.status = 404;
      throw err;
    }

    if (offer.status !== "pending") {
      const err: any = new Error("Chỉ có thể huỷ offer khi đang chờ xử lý");
      err.status = 400;
      throw err;
    }

    offer.status = "cancelled";
    await offer.save();

    return offer;
  },

  async getOfferById(offerId: string, userId: string, userRole: string) {
    if (!mongoose.isValidObjectId(offerId)) {
      const err: any = new Error("Offer không hợp lệ");
      err.status = 400;
      throw err;
    }

    const offer = await Offer.findById(offerId)
      .populate("property_id", "title price images status owner_id agent_id address")
      .populate("buyer_id", "fullName email phone avatar")
      .populate("agent_id", "fullName email phone avatar")
      .populate("seller_id", "fullName email phone avatar")
      .lean();

    if (!offer) {
      const err: any = new Error("Offer không tồn tại");
      err.status = 404;
      throw err;
    }

    // Kiểm tra quyền truy cập
    const sellerId = typeof offer.seller_id === "object" && offer.seller_id !== null 
      ? String(offer.seller_id._id) 
      : String(offer.seller_id);
    const agentId = offer.agent_id 
      ? (typeof offer.agent_id === "object" && offer.agent_id !== null 
          ? String(offer.agent_id._id) 
          : String(offer.agent_id))
      : null;

    if (userRole === "seller") {
      if (sellerId !== userId) {
        const err: any = new Error("Bạn không có quyền xem offer này");
        err.status = 403;
        throw err;
      }
    } else if (userRole === "agent") {
      if (!agentId || agentId !== userId) {
        const err: any = new Error("Bạn không có quyền xem offer này");
        err.status = 403;
        throw err;
      }
    } else {
      const err: any = new Error("Chỉ seller và agent mới có quyền xem offer này");
      err.status = 403;
      throw err;
    }

    return offer;
  },
};

