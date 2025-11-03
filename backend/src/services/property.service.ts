// src/services/property.service.ts
import Property from "../models/property.model";
import City from "../models/city.model";
import Category from "../models/category.model";
import PropertyType from "../models/propertyType.model";
import Feature from "../models/feature.model";
import mongoose from "mongoose";
import { assignmentService } from "./assignment.service";

export const propertyService = {
  async getAllProperties(filters: any) {
    const {
      page = 1,
      limit = 10,
      city,
      type,
      category,
      minPrice,
      maxPrice,
      keyword,
      status,
    } = filters;

    const query: any = { deleted: false };

    if (city) query.city_id = city;
    if (type) query.type_id = type;
    if (category) query.category_id = category;
    if (status) query.status = status;
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
        .populate("owner_id", "fullName email phone avatar")
        .populate("agent_id", "fullName email phone avatar")
        .populate("features", "feature_name")
        .populate('type_id', 'type_name')
        .populate("assignmentHistory.agent_id", "fullName email")
        .populate("assignmentHistory.assignedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

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
      .populate("features", "feature_name")
      .populate('type_id', 'type_name')
      .populate("assignmentHistory.agent_id", "fullName email phone avatar")
      .populate("assignmentHistory.assignedBy", "fullName email")
      .lean();

    if (!property) {
      const err: any = new Error("Property not found");
      err.status = 404;
      throw err;
    }

    return {
      id: property._id,
      title: property.title,
      description: property.description,
      price: property.price,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      unit: property.unit,
      yearBuilt: property.yearBuilt,
      floors: property.floors,
      coordinates: property.coordinates,
      city: property.city_id,
      category: property.category_id,
      type: property.type_id,
      features: property.features,
      images: property.images || [],
      owner: property.owner_id,
      agent: property.agent_id,
      status: property.status,
      assignmentHistory: property.assignmentHistory || [],
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  },

  async getAllCoordinates() {
    const properties = await Property.find(
      { deleted: false },
      {
        _id: 1,
        title: 1,
        coordinates: 1,
        address: 1,
        price: 1,
        listingType: 1,
      }
    );

    return properties;
  },

  async assignAgent(propertyId: string, agentId: string, options?: { actorId?: string }) {
    const property = await Property.findById(propertyId);
    if (!property) {
      const err: any = new Error("Property không tồn tại");
      err.status = 404;
      throw err;
    }

    // Validate agentId is a valid ObjectId
    if (!mongoose.isValidObjectId(agentId)) {
      const err: any = new Error("agent_id không hợp lệ");
      err.status = 400;
      throw err;
    }

    // Push assignment history
    property.assignmentHistory = property.assignmentHistory || [];
    property.assignmentHistory.push({
      agent_id: new mongoose.Types.ObjectId(agentId),
      assignedBy: options?.actorId ? new mongoose.Types.ObjectId(options.actorId) : undefined,
      action: "assign",
      assignedAt: new Date(),
    } as any);

    property.agent_id = new mongoose.Types.ObjectId(agentId);
    await property.save();
    return property;
  },

  async removeAgent(propertyId: string, options?: { actorId?: string }) {
    const property = await Property.findById(propertyId);
    if (!property) {
      const err: any = new Error("Property không tồn tại");
      err.status = 404;
      throw err;
    }

    // If no agent, nothing to remove
    if (!property.agent_id) {
      const err: any = new Error("Property chưa có agent để huỷ");
      err.status = 400;
      throw err;
    }

    // Save old agent into history
    property.assignmentHistory = property.assignmentHistory || [];
    property.assignmentHistory.push({
      agent_id: property.agent_id,
      assignedBy: options?.actorId ? new mongoose.Types.ObjectId(options.actorId) : undefined,
      action: "remove",
      assignedAt: new Date(),
    } as any);

    property.agent_id = undefined;
    await property.save();
    return property;
  },

  async getPropertiesByAgent(agentId: string) {
    const list = await Property.find({ agent_id: agentId, deleted: false })
      .populate("city_id", "city_name")
      .populate("category_id", "category_name")
      .populate("type_id", "type_name")
      .populate("owner_id", "fullName email phone avatar")
      .populate("features", "feature_name")
      .sort({ createdAt: -1 })
      .lean();

    return list;
  },

    async createProperty(data: any, ownerId: string) {
    const {
      city_id,
      category_id,
      type_id,
      features = [],
      agent_id,
      ...rest
    } = data;

    // Validate taxonomy IDs
    const [city, category, type] = await Promise.all([
      City.findById(city_id),
      Category.findById(category_id),
      PropertyType.findById(type_id),
    ]);
    if (!city || !category || !type) {
      throw Object.assign(new Error("Dữ liệu taxonomy không hợp lệ"), { status: 400 });
    }

    // Validate features nếu có
    if (features.length > 0) {
      const count = await Feature.countDocuments({ _id: { $in: features } });
      if (count !== features.length) {
        throw Object.assign(new Error("Một hoặc nhiều feature không hợp lệ"), { status: 400 });
      }
    }

    // Tạo property mới
    const property = await Property.create({
      ...rest,
      city_id,
      category_id,
      type_id,
      features,
      owner_id: new mongoose.Types.ObjectId(ownerId),
      status: "pending", 
      deleted: false,
    });

    // Nếu có agent_id => tạo request gán agent
    if (agent_id) {
      await assignmentService.createRequest((property._id as mongoose.Types.ObjectId).toString(), agent_id, ownerId);
    }

    return property;
  },
};
