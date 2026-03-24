export type ReviewTargetType = "property" | "agent" | "project";

export type ReviewModerationStatus = "pending" | "approved" | "rejected";

export type AdminReviewUserRef = {
  _id?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
};

/** target_id sau populate — property có title object; agent có fullName */
export type AdminReviewTargetRef = {
  _id?: string;
  title?: { vi?: string; en?: string };
  address?: { vi?: string; en?: string };
  fullName?: string;
  email?: string;
  avatar?: string;
  price?: number;
  images?: string[];
} | string | null;

export type AdminReviewListRow = {
  _id: string;
  user_id?: AdminReviewUserRef | string;
  target_id?: AdminReviewTargetRef;
  target_type: ReviewTargetType;
  rating: number;
  comment?: { vi?: string; en?: string };
  status: ReviewModerationStatus;
  is_hidden: boolean;
  rejection_reason?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminReviewsPageResponse = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: AdminReviewListRow[];
};

export type AdminReviewStatusFilter = "all" | ReviewModerationStatus;

/** Lọc theo thứ được đánh giá — khớp query `target_type` backend */
export type AdminReviewTargetFilter = "all" | ReviewTargetType;

/** Chi tiết: backend gắn thêm `target` (property/agent đầy đủ hơn) */
export type AdminReviewDetail = AdminReviewListRow & {
  target?: unknown;
};
