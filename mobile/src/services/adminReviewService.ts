import { api } from "./api";
import type {
  AdminReviewDetail,
  AdminReviewsPageResponse,
  ReviewModerationStatus,
  ReviewTargetType,
} from "../types/adminReview";

export type AdminReviewsParams = {
  page?: number;
  limit?: number;
  status?: ReviewModerationStatus;
  target_type?: ReviewTargetType;
};

export async function fetchAdminReviews(
  params: AdminReviewsParams = {}
): Promise<AdminReviewsPageResponse> {
  const { page = 1, limit = 10, status, target_type } = params;
  const response = await api.get<{
    success?: boolean;
    data?: AdminReviewsPageResponse;
  }>("/admin/reviews", {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
      ...(target_type ? { target_type } : {}),
    },
  });

  const payload = response.data?.data;
  if (
    !payload?.pagination ||
    typeof payload.pagination.total !== "number" ||
    !Array.isArray(payload.data)
  ) {
    throw new Error("Dữ liệu đánh giá không hợp lệ từ server.");
  }
  return payload;
}

export async function fetchAdminReviewDetail(
  reviewId: string
): Promise<AdminReviewDetail> {
  const response = await api.get<{
    success?: boolean;
    data?: AdminReviewDetail;
  }>(`/admin/reviews/${reviewId}`);
  const payload = response.data?.data;
  if (!payload || !payload._id) {
    throw new Error("Không tải được chi tiết đánh giá.");
  }
  return payload;
}

export async function patchAdminReviewHide(reviewId: string): Promise<void> {
  await api.patch(`/admin/reviews/${reviewId}/hide`);
}

export async function patchAdminReviewUnhide(reviewId: string): Promise<void> {
  await api.patch(`/admin/reviews/${reviewId}/unhide`);
}

export async function deleteAdminReview(reviewId: string): Promise<void> {
  await api.delete(`/admin/reviews/${reviewId}`);
}
