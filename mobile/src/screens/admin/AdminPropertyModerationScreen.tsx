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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
  useAdminPropertiesPage,
  ADMIN_PROPERTIES_PAGE_SIZE,
  useAdminPropertyStatusMutation,
} from "../../hooks/useAdminProperties";
import { AdminPropertyModerationItem } from "../../components/admin/AdminPropertyModerationItem";
import type { AdminPropertyListRow, AdminPropertyStatusFilter } from "../../types/adminProperty";
import type { AdminTabParamList, RootStackParamList } from "../../types/navigation";
import { fetchAdminProperties } from "../../services/adminPropertyService";

const STATUS_OPTIONS: { key: AdminPropertyStatusFilter; label: string }[] = [
  { key: "pending", label: "Chờ duyệt" },
  { key: "all", label: "Tất cả" },
  { key: "approved", label: "Đã duyệt" },
  { key: "rejected", label: "Từ chối" },
];

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<AdminTabParamList, "AdminPropertyModeration">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function AdminPropertyModerationScreen() {
  const navigation = useNavigation<Nav>();
  const [statusFilter, setStatusFilter] =
    useState<AdminPropertyStatusFilter>("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");

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
  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((p) => {
      const title =
        p.title?.vi?.toLowerCase() || p.title?.en?.toLowerCase() || "";
      const address =
        p.address?.vi?.toLowerCase() || p.address?.en?.toLowerCase() || "";
      const owner =
        typeof p.owner_id === "object" && p.owner_id
          ? (p.owner_id.fullName || p.owner_id.email || "").toLowerCase()
          : "";
      return title.includes(q) || address.includes(q) || owner.includes(q);
    });
  }, [rows, keyword]);

  const pagination = data?.pagination;
  const total = pagination?.total;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pendingCountQuery = useQuery({
    queryKey: ["admin", "properties", "count", "pending"],
    queryFn: async () => {
      const res = await fetchAdminProperties({
        status: "pending",
        page: 1,
        limit: 1,
      });
      return res.pagination.total;
    },
    staleTime: 60_000,
  });

  const approvedCountQuery = useQuery({
    queryKey: ["admin", "properties", "count", "approved"],
    queryFn: async () => {
      const res = await fetchAdminProperties({
        status: "approved",
        page: 1,
        limit: 1,
      });
      return res.pagination.total;
    },
    staleTime: 60_000,
  });

  const rejectedCountQuery = useQuery({
    queryKey: ["admin", "properties", "count", "rejected"],
    queryFn: async () => {
      const res = await fetchAdminProperties({
        status: "rejected",
        page: 1,
        limit: 1,
      });
      return res.pagination.total;
    },
    staleTime: 60_000,
  });

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
        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Ionicons name="document-text-outline" size={20} color="#1e3a8a" />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.title}>Properties Moderation</Text>
            <Text style={styles.subtitle}>
              Approve / reject listings before public
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending</Text>
            <Text style={styles.statValue}>
              {typeof pendingCountQuery.data === "number"
                ? pendingCountQuery.data.toLocaleString("en-US")
                : "—"}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Approved</Text>
            <Text style={styles.statValue}>
              {typeof approvedCountQuery.data === "number"
                ? approvedCountQuery.data.toLocaleString("en-US")
                : "—"}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Rejected</Text>
            <Text style={styles.statValue}>
              {typeof rejectedCountQuery.data === "number"
                ? rejectedCountQuery.data.toLocaleString("en-US")
                : "—"}
            </Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Search by title / address..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            autoCapitalize="none"
          />
        </View>
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
              ? "Chỉ tài khoản quản trị mới dùng được màn hình này."
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
            data={filteredRows}
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
                    {keyword.trim()
                      ? "No matches for your search."
                      : statusFilter === "pending"
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 8,
  },
  headerRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextCol: { flex: 1, minWidth: 0 },
  title: { fontSize: 22, fontWeight: "900", color: "#0f172a", letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: "#64748b", marginTop: 4, lineHeight: 18 },
  statsGrid: { marginTop: 14, gap: 10, flexDirection: "row", flexWrap: "wrap" },
  statCard: {
    flex: 1,
    minWidth: 110,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statValue: { fontSize: 20, fontWeight: "900", color: "#0f172a", marginTop: 6 },
  searchBar: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
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
