import { Alert } from "react-native";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  deleteAdminReview,
  fetchAdminReviewDetail,
  fetchAdminReviews,
  patchAdminReviewHide,
  patchAdminReviewUnhide,
} from "../services/adminReviewService";
import type {
  AdminReviewStatusFilter,
  AdminReviewTargetFilter,
} from "../types/adminReview";

export const ADMIN_REVIEWS_PAGE_SIZE = 10;

function mutationErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string } } })
      .response?.data;
    if (data?.message) return String(data.message);
  }
  if (err instanceof Error) return err.message;
  return "Thao tác thất bại.";
}

export function useAdminReviewsPage(
  statusFilter: AdminReviewStatusFilter,
  targetFilter: AdminReviewTargetFilter,
  page: number
) {
  const statusParam = statusFilter === "all" ? undefined : statusFilter;
  const targetParam = targetFilter === "all" ? undefined : targetFilter;

  return useQuery({
    queryKey: [
      "admin",
      "reviews",
      "page",
      targetParam ?? "all",
      statusParam ?? "all",
      page,
    ],
    queryFn: () =>
      fetchAdminReviews({
        status: statusParam,
        target_type: targetParam,
        page,
        limit: ADMIN_REVIEWS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminReviewDetailQuery(reviewId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "reviews", "detail", reviewId],
    queryFn: () => fetchAdminReviewDetail(reviewId!),
    enabled: !!reviewId,
  });
}

type ReviewMutationOptions = {
  onDeleted?: () => void;
};

export function useAdminReviewMutations(
  reviewId: string | undefined,
  options?: ReviewMutationOptions
) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
  };

  const hideMutation = useMutation({
    mutationFn: () => patchAdminReviewHide(reviewId!),
    onSuccess: invalidate,
    onError: (err) => Alert.alert("Lỗi", mutationErrorMessage(err)),
  });

  const unhideMutation = useMutation({
    mutationFn: () => patchAdminReviewUnhide(reviewId!),
    onSuccess: invalidate,
    onError: (err) => Alert.alert("Lỗi", mutationErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminReview(reviewId!),
    onSuccess: () => {
      invalidate();
      options?.onDeleted?.();
    },
    onError: (err) => Alert.alert("Lỗi", mutationErrorMessage(err)),
  });

  return { hideMutation, unhideMutation, deleteMutation };
}
