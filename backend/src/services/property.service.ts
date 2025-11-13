// src/services/property.service.ts
import Property from "../models/property.model";
import City from "../models/city.model";
import Category from "../models/category.model";
import PropertyType from "../models/propertyType.model";
import Feature from "../models/feature.model";
import Ward from "../models/ward.model";
import District from "../models/district.model";
import User from "../models/user.model";
import mongoose from "mongoose";
import { assignmentService } from "./assignment.service";
import { createMultilangText } from "../utils/translateHelper";
import { getFullAddress } from "../utils/addressHelper";
import { notifyAgentRemoved } from "../utils/notificationHelper";

export const propertyService = {
  async getAllProperties(filters: any) {
    const {
      page = 1,
      limit = 10,
      city,
      district,
      ward,
      type,
      category,
      minPrice,
      maxPrice,
      keyword,
      status,
    } = filters;

    const query: any = { deleted: false };

    if (city) query.city_id = city;
    if (district) query.district_id = district;
    if (ward) query.ward_id = ward;
    if (type) query.type_id = type;
    if (category) query.category_id = category;
    if (status) query.status = status;
    if (minPrice != null || maxPrice != null) {
      query.price = {
        ...(minPrice != null ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice != null ? { $lte: Number(maxPrice) } : {}),
      };
    }
    if (keyword) query["title.vi"] = { $regex: keyword, $options: "i" };

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [propertyList, totalCount] = await Promise.all([
      Property.find(query)
        .populate("city_id", "city_name")
        .populate("district_id", "district_name")
        .populate("ward_id", "ward_name")
        .populate("category_id", "category_name")
        .populate("type_id", "type_name")
        .populate("owner_id", "fullName email phone avatar")
        .populate("agent_id", "fullName email phone avatar")
        .populate("features", "feature_name")
        .populate("assignmentHistory.agent_id", "fullName email")
        .populate("assignmentHistory.assignedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Property.countDocuments(query),
    ]);

    // Thêm fullAddress
    const dataWithAddress = propertyList.map((p) => ({
      ...p,
      fullAddress: getFullAddress(p, "vi"),
    }));

    return {
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalItems: totalCount,
      },
      data: dataWithAddress,
    };
  },

  // Lấy property theo owner hoặc agent
  async getPropertiesByOwnerOrAgent(
    user: { id?: string; _id?: string; role?: string },
    queryParams: any
  ) {
    const userId = String(user?.id || user?._id);
    if (!userId) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    const { page = 1, limit = 10, status, keyword } = queryParams || {};
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const baseQuery: any = { deleted: false };
    if (status) baseQuery.status = status;
    if (keyword) baseQuery["title.vi"] = { $regex: keyword, $options: "i" };

    if (user.role === "seller") {
      baseQuery.owner_id = userId;
    } else if (user.role === "agent") {
      baseQuery.agent_id = userId;
    } else {
      const err: any = new Error("Forbidden");
      err.status = 403;
      throw err;
    }

    const [items, total] = await Promise.all([
      Property.find(baseQuery)
        .populate("city_id", "city_name")
        .populate("district_id", "district_name")
        .populate("ward_id", "ward_name")
        .populate("category_id", "category_name")
        .populate("type_id", "type_name")
        .populate("owner_id", "fullName email phone avatar")
        .populate("agent_id", "fullName email phone avatar")
        .populate("features", "feature_name")
        .populate("assignmentHistory.agent_id", "fullName email")
        .populate("assignmentHistory.assignedBy", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Property.countDocuments(baseQuery),
    ]);

    const dataWithAddress = items.map((p) => ({
      ...p,
      fullAddress: getFullAddress(p, "vi"),
    }));

    return {
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
      data: dataWithAddress,
    };
  },

  // Lấy chi tiết property
  async getPropertyById(id: string) {
    const property = await Property.findById(id)
      .populate("city_id", "city_name")
      .populate("district_id", "district_name")
      .populate("ward_id", "ward_name")
      .populate("category_id", "category_name")
      .populate("type_id", "type_name")
      .populate("owner_id", "fullName email phone avatar")
      .populate("agent_id", "fullName email phone avatar")
      .populate("features", "feature_name")
      .populate("assignmentHistory.agent_id", "fullName email phone avatar")
      .populate("assignmentHistory.assignedBy", "fullName email")
      .lean();

    if (!property) {
      const err: any = new Error("Property not found");
      err.status = 404;
      throw err;
    }

    return {
      data: {
        ...property,
        fullAddress: getFullAddress(property, "vi"),
      },
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

    const agentToRemoveId = property.agent_id; // ID của agent SẮP bị gỡ
    const actorId = options?.actorId;

    // Save old agent into history
    property.assignmentHistory = property.assignmentHistory || [];
    property.assignmentHistory.push({
      agent_id: agentToRemoveId,
      assignedBy: actorId ? new mongoose.Types.ObjectId(options.actorId) : undefined,
      action: "remove",
      assignedAt: new Date(),
    } as any);

    property.agent_id = undefined;
    await property.save();

    //GỬI NOTIFICATION CHO AGENT BỊ GỠ
    try {
      if (actorId) {
        const owner = await User.findById(actorId).select("fullName").lean();
        if (owner) {
          await notifyAgentRemoved(
            String(agentToRemoveId),    
            owner.fullName,            
            property.title.vi,
            String(property._id)    
          );
        }
      } else {
        // Ghi log nếu không có actorId, vì không biết ai đã gỡ
        console.warn(`Cannot send notification: actorId is missing for removeAgent on property ${propertyId}`);
      }
    } catch (notifyError) {
      console.error("Failed to send notification in removeAgent:", notifyError);
    }

    return property;
  },

  async getPropertiesByAgent(agentId: string) {
    const list = await Property.find({ agent_id: agentId, deleted: false })
      .populate("city_id", "city_name")
      .populate("district_id", "district_name")
      .populate("ward_id", "ward_name")
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
      district_id,
      ward_id,
      category_id,
      type_id,
      features = [],
      agent_id,
      title,
      description,
      address,
      ...rest
    } = data;

    // Validate taxonomy IDs
    const [city, district, ward, category, type] = await Promise.all([
      City.findById(city_id),
      District.findById(district_id),
      Ward.findById(ward_id),
      Category.findById(category_id),
      PropertyType.findById(type_id),
    ]);
    if (!city || !district || !ward || !category || !type) {
      throw Object.assign(new Error("Dữ liệu taxonomy không hợp lệ"), { status: 400 });
    }

    // Validate features nếu có
    if (features.length > 0) {
      const count = await Feature.countDocuments({ _id: { $in: features } });
      if (count !== features.length) {
        throw Object.assign(new Error("Một hoặc nhiều feature không hợp lệ"), { status: 400 });
      }
    }

    // Convert title, description, address sang đa ngôn ngữ
    const [titleMultilang, descriptionMultilang, addressMultilang] = await Promise.all([
      createMultilangText(title || ""),
      description ? createMultilangText(description) : Promise.resolve({ vi: "", en: "" }),
      createMultilangText(address || ""),
    ]);

    // Tạo property mới
    const property = await Property.create({
      ...rest,
      title: titleMultilang,
      description: descriptionMultilang.vi || descriptionMultilang.en ? descriptionMultilang : undefined,
      address: addressMultilang,
      city_id,
      district_id,
      ward_id,
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

  async updateProperty(id: string, data: any, userId: string) {
    const property = await Property.findById(id);
    if (!property) {
      const err: any = new Error("Property không tồn tại");
      err.status = 404;
      throw err;
    }

    if (property.deleted) {
      const err: any = new Error("Property đã bị xoá");
      err.status = 410;
      throw err;
    }

    const isOwner = property.owner_id?.toString() === userId;
    const isAgent = property.agent_id?.toString() === userId;
    if (!isOwner && !isAgent) {
      const err: any = new Error("Không có quyền cập nhật property này");
      err.status = 403;
      throw err;
    }

    const {
      title,
      description,
      address,
      images,
      ...rest
    } = data || {};

    // Áp dụng cập nhật các trường đơn giản
    Object.assign(property, rest);

    // Xử lý đa ngôn ngữ nếu truyền string
    if (typeof title === "string") {
      property.title = await createMultilangText(title);
    }
    if (typeof description === "string") {
      const desc = await createMultilangText(description);
      // nếu rỗng cả 2 ngôn ngữ thì bỏ qua
      if (desc.vi || desc.en) property.description = desc;
    }
    if (typeof address === "string") {
      property.address = await createMultilangText(address);
    }

    // Ảnh: nếu gửi images (mảng URL) thì ghi đè; nếu không gửi thì giữ nguyên
    if (Array.isArray(images)) {
      property.images = images;
    }

    await property.save();
    return property;
  },

  async deleteProperty(id: string, userId: string) {
    const property = await Property.findById(id);
    if (!property) {
      const err: any = new Error("Property không tồn tại");
      err.status = 404;
      throw err;
    }

    if (property.deleted) return; // idempotent

    const isOwner = property.owner_id?.toString() === userId;
    const isAgent = property.agent_id?.toString() === userId;
    if (!isOwner && !isAgent) {
      const err: any = new Error("Không có quyền xoá property này");
      err.status = 403;
      throw err;
    }

    property.deleted = true;
    await property.save();
  },
};
