import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchAdminUsers } from "../services/adminUserService";
import type { AdminUserRole } from "../types/adminUser";

const PAGE_SIZE = 15;

type RoleFilter = AdminUserRole | "all";

export function useAdminUsers(roleFilter: RoleFilter) {
  const roleParam = roleFilter === "all" ? undefined : roleFilter;

  return useInfiniteQuery({
    queryKey: ["admin", "users", roleParam ?? "all"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchAdminUsers({
        role: roleParam,
        page: pageParam as number,
        limit: PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
}
