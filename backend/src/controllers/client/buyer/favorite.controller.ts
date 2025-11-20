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

    const favorites = await favoriteService.getFavorites(userId!, {
      sort: sort ? String(sort) : undefined,
    });

    const flat = favorites.map((fav: any) => {
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

        city_vi: p.city_id?.city_name?.vi || null,
        city_en: p.city_id?.city_name?.en || null,
        district_vi: p.district_id?.district_name?.vi || null,
        district_en: p.district_id?.district_name?.en || null,
        ward_vi: p.ward_id?.ward_name?.vi || null,
        ward_en: p.ward_id?.ward_name?.en || null,

        type_vi: p.type_id?.type_name?.vi || null,
        type_en: p.type_id?.type_name?.en || null,
        category_vi: p.category_id?.category_name?.vi || null,
        category_en: p.category_id?.category_name?.en || null,

        area: p.area,
        unit: p.unit,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        floors: p.floors,
        yearBuilt: p.yearBuilt,

        lat: p.coordinates?.lat,
        lng: p.coordinates?.lng,

        features_vi:
          p.features?.map((f: any) => f.feature_name?.vi).filter(Boolean) || [],
        features_en:
          p.features?.map((f: any) => f.feature_name?.en).filter(Boolean) || [],
        feature_icons: [],

        owner: p.owner_id
          ? {
              id: p.owner_id._id,
              fullName: p.owner_id.fullName,
              email: p.owner_id.email,
              phone: p.owner_id.phone,
              avatar: p.owner_id.avatar,
            }
          : null,

        agent: p.agent_id
          ? {
              id: p.agent_id._id,
              fullName: p.agent_id.fullName,
              email: p.agent_id.email,
              phone: p.agent_id.phone,
              avatar: p.agent_id.avatar,
            }
          : null,

        status: p.status,
        deleted: p.deleted,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return successResponse(req, res, "Lấy danh sách yêu thích thành công", {
      total: flat.length,
      data: flat,
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
