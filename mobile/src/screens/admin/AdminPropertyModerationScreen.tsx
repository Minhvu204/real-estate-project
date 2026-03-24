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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  useAdminPropertiesPage,
  ADMIN_PROPERTIES_PAGE_SIZE,
  useAdminPropertyStatusMutation,
} from "../../hooks/useAdminProperties";
import { AdminPropertyModerationItem } from "../../components/admin/AdminPropertyModerationItem";
import type { AdminPropertyListRow, AdminPropertyStatusFilter } from "../../types/adminProperty";
import type {
  AdminPropertyStackParamList,
  RootStackParamList,
} from "../../types/navigation";

const STATUS_OPTIONS: { key: AdminPropertyStatusFilter; label: string }[] = [
  { key: "pending", label: "Chờ duyệt" },
  { key: "all", label: "Tất cả" },
  { key: "approved", label: "Đã duyệt" },
  { key: "rejected", label: "Từ chối" },
];

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<
    AdminPropertyStackParamList,
    "AdminPropertyModeration"
  >,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * U011 — Kiểm duyệt bài đăng (tách khỏi quản lý review buyer).
 * Nằm trong stack tab “Bài đăng”.
 */
export default function AdminPropertyModerationScreen() {
  const navigation = useNavigation<Nav>();
  const [statusFilter, setStatusFilter] =
    useState<AdminPropertyStatusFilter>("pending");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
    refetch,
    error,
  } = useAdminPropertiesPage(statusFilter, currentPage);

  const statusMutation = useAdminPropertyStatusMutation();
  const busyId =
    statusMutation.isPending && statusMutation.variables
      ? statusMutation.variables.propertyId
      : null;

  const rows = useMemo(() => data?.data ?? [], [data]);
  const pagination = data?.pagination;
  const total = pagination?.total;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const keyExtractor = useCallback(
    (item: AdminPropertyListRow) => String(item._id),
    []
  );

  const openDetail = useCallback(
    (item: AdminPropertyListRow) => {
      navigation.navigate("PropertyDetails", {
        propertyId: String(item._id),
      });
    },
    [navigation]
  );

  const confirmReject = useCallback(
    (item: AdminPropertyListRow) => {
      const id = String(item._id);
      Alert.alert(
        "Từ chối bài đăng",
        "Người đăng sẽ nhận thông báo. Tiếp tục?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Từ chối",
            style: "destructive",
            onPress: () =>
              statusMutation.mutate({ propertyId: id, status: "rejected" }),
          },
        ]
      );
    },
    [statusMutation]
  );

  const renderItem = useCallback(
    ({ item }: { item: AdminPropertyListRow }) => (
      <AdminPropertyModerationItem
        item={item}
        busy={busyId === String(item._id)}
        onApprove={() =>
          statusMutation.mutate({
            propertyId: String(item._id),
            status: "approved",
          })
        }
        onReject={() => confirmReject(item)}
        onOpenDetail={() => openDetail(item)}
      />
    ),
    [busyId, statusMutation, confirmReject, openDetail]
  );

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.muted}>Đang tải danh sách bài đăng…</Text>
      </SafeAreaView>
    );
  }

  const errMsg = (error as Error)?.message ?? "";
  const isForbidden =
    (error as { response?: { status?: number } })?.response?.status === 403;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Kiểm duyệt bài đăng</Text>
        <Text style={styles.subtitle}>
          {typeof total === "number"
            ? `Tổng ${total} bài · ${ADMIN_PROPERTIES_PAGE_SIZE} mỗi trang`
            : "U011 — Phê duyệt / từ chối trước khi công khai"}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {STATUS_OPTIONS.map((opt) => {
          const active = statusFilter === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setStatusFilter(opt.key)}
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
              ? "Chỉ admin mới dùng được màn hình này."
              : errMsg ||
                "Kiểm tra kết nối và EXPO_PUBLIC_API_URL trong mobile/.env."}
          </Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            style={styles.listFlex}
            data={rows}
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
                  <Ionicons name="folder-open-outline" size={48} color="#94a3b8" />
                  <Text style={styles.emptyText}>
                    {statusFilter === "pending"
                      ? "Không có bài nào chờ duyệt."
                      : "Không có bài đăng phù hợp bộ lọc."}
                  </Text>
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
              <Text
                style={[styles.pageBtnText, !canPrev && styles.pageBtnTextDisabled]}
              >
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
              <Text
                style={[styles.pageBtnText, !canNext && styles.pageBtnTextDisabled]}
              >
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
  pageBtnDisabled: { backgroundColor: "#f1f5f9" },
  pageBtnText: { fontSize: 15, fontWeight: "600", color: "#1e3a8a" },
  pageBtnTextDisabled: { color: "#94a3b8" },
  pageInfo: { minWidth: 120, alignItems: "center", justifyContent: "center" },
  pageInfoText: { fontSize: 15, fontWeight: "600", color: "#334155" },
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
