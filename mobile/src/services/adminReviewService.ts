import { api } from "./api";
import type {
  AdminReviewDetail,
  AdminReviewsPageResponse,
  ReviewModerationStatus,
  ReviewTargetType,
} from "../types/adminReview";

/** U026 — chỉ quản lý review do user có role `buyer` gửi (khớp query backend) */
export const ADMIN_REVIEW_REVIEWER_ROLE = "buyer" as const;

export type AdminReviewsParams = {
  page?: number;
  limit?: number;
  status?: ReviewModerationStatus;
  target_type?: ReviewTargetType;
};

const buyerScopeParams = {
  reviewer_role: ADMIN_REVIEW_REVIEWER_ROLE,
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
      ...buyerScopeParams,
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
  }>(`/admin/reviews/${reviewId}`, { params: buyerScopeParams });
  const payload = response.data?.data;
  if (!payload || !payload._id) {
    throw new Error("Không tải được chi tiết đánh giá.");
  }
  return payload;
}

export async function patchAdminReviewHide(reviewId: string): Promise<void> {
  await api.patch(`/admin/reviews/${reviewId}/hide`, {}, { params: buyerScopeParams });
}

export async function patchAdminReviewUnhide(reviewId: string): Promise<void> {
  await api.patch(`/admin/reviews/${reviewId}/unhide`, {}, { params: buyerScopeParams });
}

export async function deleteAdminReview(reviewId: string): Promise<void> {
  await api.delete(`/admin/reviews/${reviewId}`, { params: buyerScopeParams });
}
