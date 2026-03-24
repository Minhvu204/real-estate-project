import { api } from "./api";
import type { AdminUsersResponse, AdminUserRole } from "../types/adminUser";

export type AdminUsersParams = {
  role?: AdminUserRole | "";
  page?: number;
  limit?: number;
};

/**
 * GET /api/admin/users — yêu cầu JWT role admin.
 */
export async function fetchAdminUsers(
  params: AdminUsersParams = {}
): Promise<AdminUsersResponse> {
  const { role, page = 1, limit = 15 } = params;
  const response = await api.get<{ success?: boolean; data?: AdminUsersResponse }>(
    "/admin/users",
    {
      params: {
        page,
        limit,
        ...(role ? { role } : {}),
      },
    }
  );

  const payload = response.data?.data;
  if (!payload?.results || !payload?.meta) {
    throw new Error("Dữ liệu người dùng không hợp lệ từ server.");
  }
  return payload;
}
