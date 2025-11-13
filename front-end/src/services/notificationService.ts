import type { NotificationType } from "../types/Notification";
import { httpClient } from "../utils/httpClient";
const RESOURCE = "/notifications";

export const getNotifications = async (
  page: number = 1,
  limit: number = 10
): Promise<{ data: NotificationType[]; pagination: any }> => {
  const res = await httpClient.get(RESOURCE, { params: { page, limit } });
  const noti = Array.isArray(res?.data?.data?.data)
    ? res.data.data?.data
    : Array.isArray(res?.data)
    ? res.data
    : [];
  // Trả pagination nếu có, nếu không thì trả số trang mặc định
  const pagination = res?.data?.pagination ?? { page, limit, totalPages: 1 };
  return {
    data: noti,
    pagination,
  };
};

// Lấy số lượng chưa đọc
export const getUnreadCount = async (): Promise<number> => {
  const res = await httpClient.get(`${RESOURCE}/unread-count`);
  return res?.data?.count ?? 0;
};

// Đánh dấu 1 thông báo đã đọc
export const markAsRead = async (
  id: string
): Promise<NotificationType | null> => {
  try {
    const res = await httpClient.patch(`${RESOURCE}/${id}/read`);
    return res?.data?.data ?? res?.data ?? null;
  } catch (error: any) {
    console.log("Lỗi khi đánh dấu đã đọc:", error);
    throw new Error(
      error?.response?.data?.message || "Đánh dấu đã đọc thất bại"
    );
  }
};

// Đánh dấu tất cả đã đọc
export const markAllAsRead = async (): Promise<boolean> => {
  try {
    const res = await httpClient.patch(`${RESOURCE}/read-all`);
    // Có thể backend trả về status thành công ở data hoặc qua response
    return !!(res?.data?.success ?? true);
  } catch (error: any) {
    console.log("Lỗi khi đánh dấu tất cả đã đọc:", error);
    throw new Error(
      error?.response?.data?.message || "Đánh dấu tất cả thất bại"
    );
  }
};
