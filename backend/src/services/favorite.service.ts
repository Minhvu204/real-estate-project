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

    const favorite = await Favorite.create({
      user_id: userId,
      property_id: propertyId,
    });

    return favorite;
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
      const err: any = new Error(
        "Bất động sản không có trong danh sách yêu thích"
      );
      err.status = 404;
      throw err;
    }

    return favorite;
  },

  async getFavorites(userId: string, filters: FavoriteFilters) {
    const sort = filters.sort || "-createdAt";
    const query = { user_id: userId };

    const favorites = await Favorite.find(query)
      .populate({
        path: "property_id",
        model: "Property",

        populate: [
          { path: "city_id", select: "name" },
          { path: "district_id", select: "name" },
          { path: "ward_id", select: "name" },
          { path: "type_id", select: "name" },
          { path: "category_id", select: "name" },
          { path: "owner_id", select: "fullName email phone avatar" },
          { path: "agent_id", select: "fullName email phone avatar" },
          { path: "features", select: "name icon" },
        ],
      })
      .sort(sort);

    const total = favorites.length;

    return {
      total,
      data: favorites,
    };
  },

  async isFavorite(userId: string, propertyId: string) {
    if (!mongoose.isValidObjectId(propertyId)) {
      return null;
    }

    const favorite = await Favorite.findOne({
      user_id: userId,
      property_id: propertyId,
    });

    return favorite;
  },

  async getFavoriteCount(propertyId: string) {
    if (!mongoose.isValidObjectId(propertyId)) {
      return 0;
    }

    const count = await Favorite.countDocuments({
      property_id: propertyId,
    });

    return count;
  },
};
