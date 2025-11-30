import type { checkFavoriteType } from "@/types/FavoriteType";
import type { Property } from "@/types/Property";
import { httpClient } from "@/utils/httpClient";
import type { Review } from "../types/Review";
const RESOURCE = "/buyer/reviews";
const BUYER_RESOURCE = "/buyer";

export const getAllFavoriteProperties = async (): Promise<Property[]> => {
  const response = await httpClient.get(`${BUYER_RESOURCE}/favorites`);
  return response.data.data.data;
}

export const checkPropertyFavorite = async (id: string): Promise<checkFavoriteType> => {
  const response = await httpClient.get(`${BUYER_RESOURCE}/favorites/${id}/check`);
  return response.data.data;
}

export const deletePropertyFavorite = async (property_id: string): Promise<void> => {
  const response = await httpClient.delete(`${BUYER_RESOURCE}/favorites/${property_id}`);
  return response.data.data;
}

export const addPropertyFavorite = async (property_id: string): Promise<void> => {
  const response = await httpClient.post(`${BUYER_RESOURCE}/favorites`, { property_id });
  return response.data.data;
}

interface Reviews {
  reviews: Review[];
  canReview: boolean;
  isCommented: boolean;
}

export const getAllReviewPropertyById = async (
  id: string
): Promise<Reviews> => {
  const res = await httpClient.get(
    `${RESOURCE}/property/${id}?page=1&limit=10`
  );
  const data = res.data.data.data;
  const review = res.data.data.canReview;
  const comment = res.data.data.isCommented;
  return {
    reviews: data,
    canReview: review,
    isCommented: comment,
  };
};

export const getAllReviewProperty = async (): Promise<Review[]> => {
  const res = await httpClient.get(
    `${RESOURCE}?target_type=property&page=1&limit=10`
  );
  return res.data.data.data;
};

export const getAllReviewAgent = async (): Promise<Review[]> => {
  const res = await httpClient.get(
    `${RESOURCE}?target_type=agent&page=1&limit=10`
  );
  return res.data.data;
};

export const getAllMyReview = async (): Promise<Review[]> => {
  const res = await httpClient.get(`${RESOURCE}?page=1&limit=10`);
  return res.data.data;
};

export const createPropertyReview = async (
  id: string,
  rating: number,
  comment: string,
  target_type: string
): Promise<Review> => {
  const body = {
    target_id: id,
    target_type,
    rating,
    comment,
  };
  const res = await httpClient.post(RESOURCE, body);
  return res.data.data;
};
export const createAgentReview = async (): Promise<Review> => {
  const res = await httpClient.post(`${RESOURCE}`);
  return res.data.data;
};

export const deleteReview = async (id: string): Promise<Review> => {
  const res = await httpClient.delete(`${RESOURCE}/${id}`);
  return res.data.data;
};

export const editReview = async (
  id: string,
  rating: number,
  comment: string
): Promise<Review> => {
  const res = await httpClient.patch(`${RESOURCE}/${id}`, { rating, comment });
  return res.data.data;
};
