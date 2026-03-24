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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  useAdminReviewsPage,
  ADMIN_REVIEWS_PAGE_SIZE,
} from "../../hooks/useAdminReviews";
import { AdminReviewListItem } from "../../components/admin/AdminReviewListItem";
import type {
  AdminReviewListRow,
  AdminReviewStatusFilter,
  AdminReviewTargetFilter,
} from "../../types/adminReview";
import type { AdminReviewsStackParamList } from "../../types/navigation";

const ACCENT = "#1e3a8a";

const TARGET_OPTIONS: {
  key: AdminReviewTargetFilter;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}[] = [
  { key: "all", label: "Tất cả", icon: "layers-outline" },
  { key: "property", label: "Bất động sản", icon: "home-outline" },
  { key: "agent", label: "Môi giới", icon: "person-outline" },
  { key: "project", label: "Dự án", icon: "business-outline" },
];

const STATUS_OPTIONS: { key: AdminReviewStatusFilter; label: string }[] = [
  { key: "all", label: "Mọi trạng thái" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "approved", label: "Đã duyệt" },
  { key: "rejected", label: "Từ chối" },
];

type Nav = NativeStackNavigationProp<
  AdminReviewsStackParamList,
  "AdminReviewsList"
>;

export default function AdminReviewsScreen() {
  const navigation = useNavigation<Nav>();
  const [targetFilter, setTargetFilter] =
    useState<AdminReviewTargetFilter>("all");
  const [statusFilter, setStatusFilter] =
    useState<AdminReviewStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, targetFilter]);

  const {
    data,
    isLoading,
    isFetching,
    isPlaceholderData,
    refetch,
    error,
  } = useAdminReviewsPage(statusFilter, targetFilter, currentPage);

  const rows = useMemo(() => data?.data ?? [], [data]);
  const pagination = data?.pagination;
  const total = pagination?.total;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const keyExtractor = useCallback(
    (item: AdminReviewListRow) => String(item._id),
    []
  );

  const openDetail = useCallback(
    (item: AdminReviewListRow) => {
      navigation.navigate("AdminReviewDetail", { reviewId: String(item._id) });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: AdminReviewListRow }) => (
      <AdminReviewListItem item={item} onPress={() => openDetail(item)} />
    ),
    [openDetail]
  );

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.muted}>Đang tải đánh giá…</Text>
      </SafeAreaView>
    );
  }

  const errMsg = (error as Error)?.message ?? "";
  const isForbidden =
    (error as { response?: { status?: number } })?.response?.status === 403;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <View style={styles.headerRow}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="shield-checkmark" size={22} color={ACCENT} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.title}>Đánh giá từ người mua</Text>
            <Text style={styles.subtitle}>
              {typeof total === "number"
                ? `${total} đánh giá · ${ADMIN_REVIEWS_PAGE_SIZE} / trang`
                : "Kiểm soát nội dung hiển thị công khai"}
            </Text>
          </View>
        </View>
        <Text style={styles.hintBanner}>
          Ẩn hoặc xóa khi vi phạm. Lọc theo tin đăng / môi giới để xử lý nhanh.
        </Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Đối tượng được đánh giá</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {TARGET_OPTIONS.map((opt) => {
            const active = targetFilter === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setTargetFilter(opt.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={active ? "#fff" : "#475569"}
                />
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Trạng thái duyệt</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {STATUS_OPTIONS.map((opt) => {
            const active = statusFilter === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setStatusFilter(opt.key)}
                style={[styles.chipSm, active && styles.chipActive]}
              >
                <Text
                  style={[styles.chipTextSm, active && styles.chipTextActive]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

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
              ? "Chỉ admin mới xem được danh sách này."
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
                colors={[ACCENT]}
                tintColor={ACCENT}
              />
            }
            ListEmptyComponent={
              !isFetching ? (
                <View style={styles.empty}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons
                      name="chatbubbles-outline"
                      size={40}
                      color="#94a3b8"
                    />
                  </View>
                  <Text style={styles.emptyTitle}>Không có đánh giá</Text>
                  <Text style={styles.emptyText}>
                    Thử đổi bộ lọc đối tượng hoặc trạng thái.
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
                color={canPrev ? ACCENT : "#94a3b8"}
              />
              <Text
                style={[styles.pageBtnText, !canPrev && styles.pageBtnTextDisabled]}
              >
                Trước
              </Text>
            </Pressable>
            <View style={styles.pageInfo}>
              {isFetching ? (
                <ActivityIndicator size="small" color={ACCENT} />
              ) : (
                <Text style={styles.pageInfoText}>
                  {currentPage} / {totalPages}
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
                color={canNext ? ACCENT : "#94a3b8"}
              />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  muted: { marginTop: 8, color: "#64748b", fontSize: 14 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginHorizontal: 0,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerAccent: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    marginBottom: 14,
  },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextCol: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 14, color: "#64748b", marginTop: 4, lineHeight: 20 },
  hintBanner: {
    marginTop: 12,
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterSection: { marginTop: 12, paddingHorizontal: 16 },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  filterScroll: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipSm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: "#334155" },
  chipTextSm: { fontSize: 12, fontWeight: "600", color: "#475569" },
  chipTextActive: { color: "#fff" },
  listFlex: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexGrow: 1 },
  paginationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 18,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e2e8f0",
  },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#e0e7ff",
    gap: 4,
  },
  pageBtnDisabled: { backgroundColor: "#f1f5f9" },
  pageBtnText: { fontSize: 15, fontWeight: "600", color: ACCENT },
  pageBtnTextDisabled: { color: "#94a3b8" },
  pageInfo: { minWidth: 72, alignItems: "center", justifyContent: "center" },
  pageInfoText: { fontSize: 15, fontWeight: "700", color: "#334155" },
  empty: { alignItems: "center", paddingVertical: 56, paddingHorizontal: 24 },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#334155" },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
  errorBox: {
    margin: 20,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fffbeb",
    borderRadius: 16,
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
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: ACCENT,
    borderRadius: 12,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
