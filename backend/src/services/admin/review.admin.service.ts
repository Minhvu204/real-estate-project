import Review from "../../models/review.model";
import Property from "../../models/property.model";
import User from "../../models/user.model";
import mongoose from "mongoose";

const REVIEWER_ROLES = ["buyer", "seller", "agent", "admin"] as const;

export const adminReviewService = {
  async getReviews(filters: any) {
    const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
    const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 10;

    const query: any = {};

    /** Chỉ lấy review do user có role cụ thể (vd: buyer) */
    if (
      filters.reviewer_role &&
      REVIEWER_ROLES.includes(filters.reviewer_role as (typeof REVIEWER_ROLES)[number])
    ) {
      const userIds = await User.find({
        role: filters.reviewer_role,
      }).distinct("_id");
      query.user_id = { $in: userIds };
    }

    if (filters.target_type) query.target_type = filters.target_type;
    if (filters.target_id && mongoose.isValidObjectId(filters.target_id)) {
      query.target_id = filters.target_id;
    }
    if (filters.user_id && mongoose.isValidObjectId(filters.user_id)) {
      query.user_id = filters.user_id;
    }
    if (filters.status) query.status = filters.status;

    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) query.createdAt.$gte = new Date(filters.from);
      if (filters.to) query.createdAt.$lte = new Date(filters.to);
    }

    const sort = filters.sort || "-createdAt";

    const [total, data] = await Promise.all([
      Review.countDocuments(query),
      Review.find(query)
        .populate("user_id", "fullName email avatar role")
        .populate({
          path: "target_id",
          // `images` cho property; agent/user vẫn có avatar (không có images trên User)
          select: "title address fullName email avatar images",
        })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  },

  async assertReviewerRole(
    reviewId: string,
    restrictReviewerRole?: string
  ): Promise<void> {
    if (
      !restrictReviewerRole ||
      !REVIEWER_ROLES.includes(restrictReviewerRole as (typeof REVIEWER_ROLES)[number])
    ) {
      return;
    }
    const rev = await Review.findById(reviewId).populate("user_id", "role");
    if (!rev) {
      const err: any = new Error("Review không tồn tại");
      err.status = 404;
      throw err;
    }
    const role = (rev.user_id as { role?: string } | null)?.role;
    if (role !== restrictReviewerRole) {
      const err: any = new Error("Review không thuộc phạm vi vai trò này");
      err.status = 403;
      throw err;
    }
  },

  async getReviewDetail(id: string, opts?: { restrictReviewerRole?: string }) {
    if (!mongoose.isValidObjectId(id)) {
      const err: any = new Error("Review ID không hợp lệ");
      err.status = 400;
      throw err;
    }

    const review = await Review.findById(id)
      .populate("user_id", "fullName email avatar role")
      .populate({
        path: "target_id",
        select: "title address fullName email avatar",
      });

    if (!review) {
      const err: any = new Error("Review không tồn tại");
      err.status = 404;
      throw err;
    }

    if (opts?.restrictReviewerRole) {
      const role = (review.user_id as { role?: string } | null)?.role;
      if (role !== opts.restrictReviewerRole) {
        const err: any = new Error("Review không thuộc phạm vi vai trò này");
        err.status = 403;
        throw err;
      }
    }

    let populatedTarget = null;

    if (review.target_type === "property") {
      populatedTarget = await Property.findById(review.target_id)
        .select("title address price images bedrooms bathrooms area city_id district_id ward_id")
        .populate("city_id", "name")
        .populate("district_id", "name")
        .populate("ward_id", "name");
    }

    if (review.target_type === "agent") {
      populatedTarget = await User.findById(review.target_id)
        .select("fullName email avatar phone");
    }

    return {
      ...review.toObject(),
      target: populatedTarget
    };
  },


  async hide(id: string, opts?: { restrictReviewerRole?: string }) {
    if (opts?.restrictReviewerRole) {
      await this.assertReviewerRole(id, opts.restrictReviewerRole);
    }
    return Review.findByIdAndUpdate(id, { is_hidden: true }, { new: true });
  },

  async unhide(id: string, opts?: { restrictReviewerRole?: string }) {
    if (opts?.restrictReviewerRole) {
      await this.assertReviewerRole(id, opts.restrictReviewerRole);
    }
    return Review.findByIdAndUpdate(id, { is_hidden: false }, { new: true });
  },

  async delete(id: string, opts?: { restrictReviewerRole?: string }) {
    if (opts?.restrictReviewerRole) {
      await this.assertReviewerRole(id, opts.restrictReviewerRole);
    }
    return Review.findByIdAndDelete(id);
  },
};
