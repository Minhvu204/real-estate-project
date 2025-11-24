import type { Review } from "../types/Review";
import { httpClient } from "../utils/httpClient";
const RESOURCE = "/buyer/reviews";

export const getAllReviewPropertyById = async (
  id: string
): Promise<Review[]> => {
  const res = await httpClient.get(
    `${RESOURCE}/property/${id}?page=1&limit=10`
  );
  return res.data.data.data;
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
