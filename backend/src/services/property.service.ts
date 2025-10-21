// src/services/property.service.ts
import Property from "../models/property.model";

export const propertyService = {
  async getAllProperties(filters: any) {
    const {
      page = 1,
      limit = 10,
      city,
      type,
      minPrice,
      maxPrice,
      keyword,
    } = filters;

    const query: any = {};

    if (city) query.city_id = city;
    if (type) query.type_id = type;
    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
      };
    }
    if (keyword) query.title = { $regex: keyword, $options: "i" };

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [propertyList, totalCount] = await Promise.all([
      Property.find(query)
        .populate("city_id", "city_name")
        .populate("category_id", "category_name")
        .populate("type_id", "type_name")
        .populate("owner_id", "fullName email")
        .populate("agent_id", "fullName email")
        .populate("features", "feature_name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),

      Property.countDocuments(query),
    ]);

    return {
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
      },
      data: propertyList,
    };
  },
  getPropertyById: async (id: string) => {
  const property = await Property.findById(id)
    .populate("city_id", "city_name")
    .populate("category_id", "category_name")
    .populate("type_id", "type_name")
    .populate("owner_id", "fullName email phone avatar")
    .populate("agent_id", "fullName email phone avatar")
    .populate("features", "feature_name");

  if (!property) {
    const err: any = new Error("Property not found");
    err.status = 404;
    throw err;
  }

  return property;
},
};
