import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAdminUsers } from "../services/adminUserService";
import type { AdminUserRole } from "../types/adminUser";

export const ADMIN_USERS_PAGE_SIZE = 10;

type RoleFilter = AdminUserRole | "all";

export function useAdminUsersPage(roleFilter: RoleFilter, page: number) {
  const roleParam = roleFilter === "all" ? undefined : roleFilter;

  return useQuery({
    queryKey: ["admin", "users", "page", roleParam ?? "all", page],
    queryFn: () =>
      fetchAdminUsers({
        role: roleParam,
        page,
        limit: ADMIN_USERS_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  });
}
