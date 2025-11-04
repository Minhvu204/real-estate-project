import mongoose from "mongoose";
import Property from "../../models/property.model";

export type ApproveStatus = "approved" | "rejected";

export const adminPropertyService = {
  async updateStatus(
    propertyId: string,
    status: ApproveStatus,
    adminId: string
  ) {
    if (!mongoose.isValidObjectId(propertyId)) {
      const err: any = new Error("Invalid property id");
      err.status = 400;
      throw err;
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      const err: any = new Error("Property not found");
      err.status = 404;
      throw err;
    }

    property.status = status;
    property.reviewedBy = new mongoose.Types.ObjectId(adminId);
    property.reviewedAt = new Date();

    if (status === "approved") {
      property.publishedAt = new Date();
    }

    await property.save();

    return {
      id: property._id,
      title: property.title,
      status: property.status,
      reviewedBy: property.reviewedBy,
      reviewedAt: property.reviewedAt,
      publishedAt: property.publishedAt,
      owner: property.owner_id,
    };
  },

  async list(query: { page?: number; limit?: number; status?: string }) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;
    const q: any = {};
    if (query.status) q.status = query.status;

    const [items, total] = await Promise.all([
      Property.find(q)
        .populate("owner_id", "fullName email")
        .populate("reviewedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(q),
    ]);

    return {
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data: items,
    };
  },
};
