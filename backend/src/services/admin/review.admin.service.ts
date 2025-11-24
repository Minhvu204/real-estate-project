import Review from "../../models/review.model";
import mongoose from "mongoose";

export const adminReviewService = {
  async getReviews(filters: any) {
    const page = Number(filters.page) > 0 ? Number(filters.page) : 1;
    const limit = Number(filters.limit) > 0 ? Number(filters.limit) : 10;

    const query: any = {};

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
        .populate("user_id", "fullName email avatar")
        .populate({
          path: "target_id",
          select: "title address fullName email avatar",
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

  async getReviewDetail(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      const err: any = new Error("Review ID không hợp lệ");
      err.status = 400;
      throw err;
    }

    const review = await Review.findById(id)
      .populate("user_id", "fullName email avatar")
      .populate({
        path: "target_id",
        select: "title address fullName email avatar",
      });

    if (!review) {
      const err: any = new Error("Review không tồn tại");
      err.status = 404;
      throw err;
    }

    return review;
  },


  async hide(id: string) {
    return Review.findByIdAndUpdate(id, { is_hidden: true }, { new: true });
  },

  async unhide(id: string) {
    return Review.findByIdAndUpdate(id, { is_hidden: false }, { new: true });
  },

  async delete(id: string) {
    return Review.findByIdAndDelete(id);
  },
};
