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
import { geocodeAddress } from "../utils/geocodingHelper";
import { SearchCriteria } from "../types/searchCriteria";

export const propertyService = {
  async getAllProperties(filters: any) {
    const { city, district, ward, type, category, minPrice, maxPrice, keyword } = filters;

    const query: any = {
      deleted: false,
      status: { $in: ["approved", "available"] },
    };

    if (city) query.city_id = city;
    if (district) query.district_id = district;
    if (ward) query.ward_id = ward;
    if (type) query.type_id = type;
    if (category) query.category_id = category;
    if (minPrice != null || maxPrice != null) {
      query.price = {
        ...(minPrice != null ? { $gte: Number(minPrice) } : {}),
        ...(maxPrice != null ? { $lte: Number(maxPrice) } : {}),
      };
    }
    if (keyword) query["title.vi"] = { $regex: keyword, $options: "i" };

    const propertyList = await Property.find(query)
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
      .lean();

    const dataWithAddress = propertyList.map((p) => ({
      ...p,
      fullAddress: getFullAddress(p, "vi"),
    }));

    return { data: dataWithAddress };
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

  async getPropertiesByUser(userId: string, filters: any = {}) {
    const { status, keyword } = filters;

    // Lấy properties mà user là owner HOẶC agent
    const query: any = {
      $or: [
        { owner_id: userId },
        { agent_id: userId }
      ],
      deleted: false,
    };

    if (status) query.status = status;
    if (keyword) {
      query.$or = [
        { "title.vi": { $regex: keyword, $options: "i" } },
        { "title.en": { $regex: keyword, $options: "i" } },
        { "address.vi": { $regex: keyword, $options: "i" } },
        { "address.en": { $regex: keyword, $options: "i" } },
      ];
    }

    const list = await Property.find(query)
      .populate("city_id", "city_name")
      .populate("district_id", "district_name")
      .populate("ward_id", "ward_name")
      .populate("category_id", "category_name")
      .populate("type_id", "type_name")
      .populate("owner_id", "fullName email phone avatar")
      .populate("agent_id", "fullName email phone avatar")
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
      coordinates,
      ...rest
    } = data;

    const [city, district, ward, category, type] = await Promise.all([
      City.findById(city_id).lean(),
      District.findById(district_id).lean(),
      Ward.findById(ward_id).lean(),
      Category.findById(category_id).lean(),
      PropertyType.findById(type_id).lean(),
    ]);
    if (!city || !district || !ward || !category || !type) {
      throw Object.assign(new Error("Dữ liệu taxonomy không hợp lệ"), { status: 400 });
    }

    if (features.length > 0) {
      const count = await Feature.countDocuments({ _id: { $in: features } });
      if (count !== features.length) {
        throw Object.assign(new Error("Một hoặc nhiều feature không hợp lệ"), { status: 400 });
      }
    }

    const [titleMultilang, descriptionMultilang, addressMultilang] = await Promise.all([
      createMultilangText(title || ""),
      description ? createMultilangText(description) : Promise.resolve({ vi: "", en: "" }),
      createMultilangText(address || ""),
    ]);



    let finalCoordinates: { type: 'Point', coordinates: number[] } | undefined = undefined;

    //Nếu FE có gửi tọa độ xuống
    if (coordinates) {
      let lat: number | undefined;
      let lng: number | undefined;

      if (typeof coordinates === 'object' && !Array.isArray(coordinates)) {
        lat = Number(coordinates.lat || coordinates.latitude);
        lng = Number(coordinates.lng || coordinates.longitude);
      } else if (Array.isArray(coordinates) && coordinates.length === 2) {
        // Format: [lng, lat] (Chuẩn GeoJSON)
        lng = Number(coordinates[0]);
        lat = Number(coordinates[1]);
      }

      if (!isNaN(lat!) && !isNaN(lng!)) {
        console.log(`[Property] Sử dụng tọa độ từ FE: [${lng}, ${lat}]`);
        finalCoordinates = {
          type: 'Point',
          coordinates: [lng!, lat!] // MongoDB bắt buộc thứ tự: [Longitude, Latitude]
        };
      }
    }

    // còn không gửi thì tự geocoding
    if (!finalCoordinates) {
      try {
        const fullAddressString = `${address}, ${ward.ward_name.vi}, ${district.district_name.vi}, ${city.city_name.vi}`;
        console.log(`[Geocoding] Đang tìm tọa độ từ địa chỉ: ${fullAddressString}`);

        const location = await geocodeAddress(fullAddressString); // (trả về { lat, lng })

        if (location) {
          finalCoordinates = {
            type: 'Point',
            coordinates: [location.lng, location.lat] // [lng, lat]
          };
        } else {
          console.warn(`Không tìm thấy tọa độ cho: ${fullAddressString}. Tọa độ sẽ là null.`);
        }
      } catch (geoError) {
        console.warn(`Geocoding failed for address: ${address}`, geoError);
      }
    }

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
      coordinates: finalCoordinates,
    });

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
      city_id,
      district_id,
      ward_id,
      coordinates,
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

    // Xử lý city_id, district_id, ward_id
    if (city_id) {
      property.city_id = new mongoose.Types.ObjectId(city_id);
    }
    if (district_id) {
      property.district_id = new mongoose.Types.ObjectId(district_id);
    }
    if (ward_id) {
      property.ward_id = new mongoose.Types.ObjectId(ward_id);
    }

    // Xử lý coordinates
    if (coordinates) {
      // Nếu coordinates được gửi dưới dạng { lat, lng } hoặc coordinates[lat], coordinates[lng]
      if (coordinates.lat !== undefined && coordinates.lng !== undefined) {
        property.coordinates = {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat] // [lng, lat] format
        };
      } else if (Array.isArray(coordinates.coordinates)) {
        property.coordinates = coordinates;
      }
    }

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

    if (property.deleted) return; 

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

  // Tìm kiếm properties dựa trên tiêu chí AI
  async findPropertiesByAiCriteria(
    criteria: SearchCriteria,
    centerPoint: { lat: number; lng: number } | null
  ) {
    const query: any = {
      status: { $in: ["approved", "available"] },
    };

    const radiusInKm = 10; // Mặc định tìm trong bán kính 10km

    // xử lí vị trí(Nếu có)
    if (centerPoint) {
      query.coordinates = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [centerPoint.lng, centerPoint.lat],
          },
          // $maxDistance tính bằng mét
          $maxDistance: radiusInKm * 1000,
        },
      };
    }

    // xử lí giá
    if (criteria.min_price || criteria.max_price) {
      query.price = {};
      if (criteria.min_price) {
        query.price.$gte = criteria.min_price;
      }
      if (criteria.max_price) {
        query.price.$lte = criteria.max_price;
      }
    }

    // xử lí loại bđs
    if (criteria.category) {
      // Tìm ID của category từ tên
      const categoryDoc = await Category.findOne({
        $or: [
          { "category_name.vi": new RegExp(criteria.category, "i") },
          { "category_name.en": new RegExp(criteria.category, "i") },
        ],
      }).lean();

      if (categoryDoc) {
        query.category_id = categoryDoc._id;
      }
    }

    // xử lí tiện ích (features)
    if (criteria.features && criteria.features.length > 0) {
      const featureDocs = await Feature.find({
        $or: [
          { "feature_name.vi": { $in: criteria.features.map(f => new RegExp(f, "i")) } },
          { "feature_name.en": { $in: criteria.features.map(f => new RegExp(f, "i")) } },
        ],
      }).select("_id");

      if (featureDocs.length > 0) {
        // $all = property phải có TẤT CẢ các tiện ích này
        query.features = { $all: featureDocs.map(f => f._id) };
      }
    }

    const properties = await Property.find(query)
      .populate("category_id", "category_name")
      .populate("features", "feature_name")
      .limit(10) // Trả về 10 kết quả hàng đầu
      .lean();

    return properties;
  },
};
