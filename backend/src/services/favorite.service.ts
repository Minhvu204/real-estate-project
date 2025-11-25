// src/services/favorite.service.ts
import mongoose from "mongoose";
import Favorite from "../models/favorite.model";
import Property from "../models/property.model";

interface FavoriteFilters {
  sort?: string;
}

export const favoriteService = {
  async addFavorite(userId: string, propertyId: string) {
    if (!mongoose.isValidObjectId(propertyId)) {
      const err: any = new Error("Property ID không hợp lệ");
      err.status = 400;
      throw err;
    }

    const property = await Property.findOne({
      _id: propertyId,
      status: "approved",
      deleted: false,
    });

    if (!property) {
      const err: any = new Error(
        "Bất động sản không tồn tại hoặc chưa được phê duyệt"
      );
      err.status = 404;
      throw err;
    }

    const existing = await Favorite.findOne({
      user_id: userId,
      property_id: propertyId,
    });

    if (existing) {
      const err: any = new Error(
        "Bất động sản đã nằm trong danh sách yêu thích"
      );
      err.status = 400;
      throw err;
    }

    return Favorite.create({
      user_id: userId,
      property_id: propertyId,
    });
  },

  async removeFavorite(userId: string, propertyId: string) {
    if (!mongoose.isValidObjectId(propertyId)) {
      const err: any = new Error("Property ID không hợp lệ");
      err.status = 400;
      throw err;
    }

    const favorite = await Favorite.findOneAndDelete({
      user_id: userId,
      property_id: propertyId,
    });

    if (!favorite) {
      const err: any = new Error("Bất động sản không tồn tại trong yêu thích");
      err.status = 404;
      throw err;
    }

    return favorite;
  },

  async getFavorites(userId: string, filters: FavoriteFilters) {
    const sort = filters.sort || "-createdAt";

    const favorites = await Favorite.find({ user_id: userId })
      .populate({
        path: "property_id",
        model: "Property",
        populate: [
          { path: "city_id", select: "city_name" },
          { path: "district_id", select: "district_name" },
          { path: "ward_id", select: "ward_name" },
          { path: "type_id", select: "type_name" },
          { path: "category_id", select: "category_name" },
          { path: "features", select: "feature_name" },
          {
            path: "owner_id",
            select: "fullName email phone avatar",
          },
          {
            path: "agent_id",
            select: "fullName email phone avatar",
          },
        ],
      })
      .sort(sort);

    return favorites;
  },

  async isFavorite(userId: string, propertyId: string) {
    if (!mongoose.isValidObjectId(propertyId)) return null;

    return Favorite.findOne({
      user_id: userId,
      property_id: propertyId,
    });
  },

  async getFavoriteCount(propertyId: string) {
    if (!mongoose.isValidObjectId(propertyId)) return 0;

    return Favorite.countDocuments({ property_id: propertyId });
  },
};
