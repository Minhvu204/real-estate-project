// src/controllers/client/buyer/favorite.controller.ts
import { Request, Response } from "express";
import { favoriteService } from "../../../services/favorite.service";
import { successResponse, errorResponse } from "../../../utils/responseHandler";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

export const addFavorite = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { property_id } = req.body;

    if (!property_id) {
      return errorResponse(req, res, "Vui lòng truyền property_id", 400);
    }

    const data = await favoriteService.addFavorite(userId!, property_id);
    return successResponse(req, res, "Thêm yêu thích thành công", data);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { propertyId } = req.params;

    const data = await favoriteService.removeFavorite(userId!, propertyId);
    return successResponse(req, res, "Xoá yêu thích thành công", data);
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};

export const getMyFavorites = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { sort } = req.query;

    const result = await favoriteService.getFavorites(userId!, {
      sort: sort ? String(sort) : undefined,
    });

    const flatData = result.data.map((fav: any) => {
      const p = fav.property_id;

      return {
        favorite_id: fav._id,
        property_id: p._id,

        title: p.title,
        description: p.description,
        price: p.price,
        images: p.images,

        address_vi: p.address?.vi,
        address_en: p.address?.en,

        city: p.city_id?.name || null,
        district: p.district_id?.name || null,
        ward: p.ward_id?.name || null,

        type: p.type_id?.name || null,
        category: p.category_id?.name || null,

        area: p.area,
        unit: p.unit,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        floors: p.floors,
        yearBuilt: p.yearBuilt,

        lat: p.coordinates?.lat,
        lng: p.coordinates?.lng,

        features: p.features?.map((f: any) => f.name) || [],
        feature_icons: p.features?.map((f: any) => f.icon) || [],

        owner_name: p.owner_id?.fullName || null,
        owner_email: p.owner_id?.email || null,
        owner_phone: p.owner_id?.phone || null,
        owner_avatar: p.owner_id?.avatar || null,

        agent_name: p.agent_id?.fullName || null,
        agent_email: p.agent_id?.email || null,
        agent_phone: p.agent_id?.phone || null,
        agent_avatar: p.agent_id?.avatar || null,

        status: p.status,
        deleted: p.deleted,
        createdAt: p.createdAt,
      };
    });

    return successResponse(req, res, "Lấy danh sách yêu thích thành công", {
      total: flatData.length,
      data: flatData,
    });
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};

export const checkFavorite = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { propertyId } = req.params;

    const favorite = await favoriteService.isFavorite(userId!, propertyId);

    return successResponse(req, res, "Trạng thái yêu thích", {
      isFavorite: !!favorite,
      favorite,
    });
  } catch (err: any) {
    return errorResponse(req, res, err.message, err.status || 500);
  }
};
