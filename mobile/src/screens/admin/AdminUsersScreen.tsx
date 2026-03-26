import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAdminUsersPage, useUpdateUserStatus, ADMIN_USERS_PAGE_SIZE } from "../../hooks/useAdminUsers";
import { AdminUserListItem } from "../../components/admin/AdminUserListItem";
import type { AdminUserRow } from "../../types/adminUser";

const ROLE_OPTIONS = [
  { key: "all" as const, label: "Tất cả" },
  { key: "buyer" as const, label: "Người mua" },
  { key: "seller" as const, label: "Chủ nhà" },
  { key: "agent" as const, label: "Môi giới" },
  { key: "admin" as const, label: "Quản trị" },
];

export default function AdminUsersScreen() {
  const [roleFilter, setRoleFilter] = useState<
    "all" | "buyer" | "seller" | "agent" | "admin"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
    refetch,
    error,
  } = useAdminUsersPage(roleFilter, currentPage);

  const updateStatusMutation = useUpdateUserStatus();

  const users = useMemo(() => data?.results ?? [], [data]);
  const meta = data?.meta;
  const total = meta?.totalUsers;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handleToggleStatus = useCallback(
    (id: string, isActive: boolean) => {
      updateStatusMutation.mutate({ id, isActive });
    },
    [updateStatusMutation]
  );

  const renderItem = useCallback(
    ({ item }: { item: AdminUserRow }) => {
      const isPending =
        updateStatusMutation.isPending &&
        (updateStatusMutation.variables as { id: string })?.id === item.id;

      return (
        <AdminUserListItem
          item={item}
          onToggleStatus={handleToggleStatus}
          isPending={isPending}
        />
      );
    },
    [handleToggleStatus, updateStatusMutation.isPending, updateStatusMutation.variables]
  );

  const keyExtractor = useCallback((item: AdminUserRow) => String(item.id), []);

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.muted}>Đang tải danh sách người dùng…</Text>
      </SafeAreaView>
    );
  }

  const errMsg = (error as Error)?.message ?? "";
  const isForbidden =
    (error as { response?: { status?: number } })?.response?.status === 403;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Người dùng hệ thống</Text>
        <Text style={styles.subtitle}>
          {typeof total === "number"
            ? `Tổng ${total} tài khoản · ${ADMIN_USERS_PAGE_SIZE} mỗi trang`
            : "Lọc theo vai trò để xem chi tiết"}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {ROLE_OPTIONS.map((opt) => {
          const active = roleFilter === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setRoleFilter(opt.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={40} color="#b45309" />
          <Text style={styles.errorTitle}>
            {isForbidden
              ? "Không có quyền truy cập"
              : "Không tải được dữ liệu"}
          </Text>
          <Text style={styles.errorText}>
            {isForbidden
              ? "Chỉ tài khoản quản trị (admin) mới xem được danh sách này."
              : errMsg ||
                "Kiểm tra kết nối mạng và EXPO_PUBLIC_API_URL trong mobile/.env."}
          </Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            style={styles.listFlex}
            data={users}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isFetching && !isLoading && !isPlaceholderData}
                onRefresh={refetch}
                colors={["#1e3a8a"]}
              />
            }
            ListEmptyComponent={
              !isFetching ? (
                <View style={styles.empty}>
                  <Ionicons name="people-outline" size={48} color="#94a3b8" />
                  <Text style={styles.emptyText}>Không có người dùng phù hợp.</Text>
                </View>
              ) : null
            }
          />
          <View style={styles.paginationBar}>
            <Pressable
              onPress={() => canPrev && setCurrentPage((p) => p - 1)}
              style={[styles.pageBtn, !canPrev && styles.pageBtnDisabled]}
              disabled={!canPrev || isFetching}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={canPrev ? "#1e3a8a" : "#94a3b8"}
              />
              <Text style={[styles.pageBtnText, !canPrev && styles.pageBtnTextDisabled]}>
                Trước
              </Text>
            </Pressable>
            <View style={styles.pageInfo}>
              {isFetching ? (
                <ActivityIndicator size="small" color="#1e3a8a" />
              ) : (
                <Text style={styles.pageInfoText}>
                  Trang {currentPage} / {totalPages}
                </Text>
              )}
            </View>
            <Pressable
              onPress={() => canNext && setCurrentPage((p) => p + 1)}
              style={[styles.pageBtn, !canNext && styles.pageBtnDisabled]}
              disabled={!canNext || isFetching}
            >
              <Text style={[styles.pageBtnText, !canNext && styles.pageBtnTextDisabled]}>
                Sau
              </Text>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={canNext ? "#1e3a8a" : "#94a3b8"}
              />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  muted: { marginTop: 8, color: "#64748b", fontSize: 14 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", color: "#0f172a" },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 4 },
  filterBar: { maxHeight: 48, marginBottom: 8 },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  chipActive: { backgroundColor: "#1e3a8a" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  chipTextActive: { color: "#fff" },
  listFlex: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingBottom: 8, flexGrow: 1 },
  paginationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e2e8f0",
  },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e0e7ff",
    gap: 4,
  },
  pageBtnDisabled: {
    backgroundColor: "#f1f5f9",
  },
  pageBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  pageBtnTextDisabled: {
    color: "#94a3b8",
  },
  pageInfo: {
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  pageInfoText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  empty: { alignItems: "center", paddingVertical: 48 },
  emptyText: { marginTop: 8, color: "#64748b", fontSize: 15 },
  errorBox: {
    margin: 20,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fffbeb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#92400e",
  },
  errorText: {
    marginTop: 8,
    textAlign: "center",
    color: "#78350f",
    fontSize: 14,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
