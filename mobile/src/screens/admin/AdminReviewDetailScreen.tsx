import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RouteProp,
  useNavigation,
  useRoute,
  CompositeNavigationProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  useAdminReviewDetailQuery,
  useAdminReviewMutations,
} from "../../hooks/useAdminReviews";
import type {
  AdminReviewsStackParamList,
  RootStackParamList,
} from "../../types/navigation";
import type { AdminReviewDetail, ReviewModerationStatus } from "../../types/adminReview";

const ACCENT = "#1e3a8a";

type Route = RouteProp<AdminReviewsStackParamList, "AdminReviewDetail">;
type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<AdminReviewsStackParamList, "AdminReviewDetail">,
  NativeStackNavigationProp<RootStackParamList>
>;

function propertyIdFromDetail(d: AdminReviewDetail): string | null {
  if (d.target_type !== "property") return null;
  const t = d.target as { _id?: string } | undefined;
  if (t && typeof t === "object" && t._id) return String(t._id);
  const raw = d.target_id;
  if (raw && typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "_id" in raw && (raw as { _id?: string })._id) {
    return String((raw as { _id: string })._id);
  }
  return null;
}

function agentIdFromDetail(d: AdminReviewDetail): string | null {
  if (d.target_type !== "agent") return null;
  const t = d.target as { _id?: string } | undefined;
  if (t && typeof t === "object" && t._id) return String(t._id);
  const raw = d.target_id;
  if (raw && typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "_id" in raw && (raw as { _id?: string })._id) {
    return String((raw as { _id: string })._id);
  }
  return null;
}

function targetLabelVi(t: string): string {
  switch (t) {
    case "property":
      return "Bất động sản";
    case "agent":
      return "Môi giới";
    case "project":
      return "Dự án";
    default:
      return t;
  }
}

function statusLabelVi(s: ReviewModerationStatus): string {
  switch (s) {
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    default:
      return s;
  }
}

function heroThumbUri(d: AdminReviewDetail): string | null {
  const t = d.target_id;
  if (!t || typeof t !== "object") return null;
  if (d.target_type === "property") {
    const first = Array.isArray(t.images) ? t.images[0] : null;
    return typeof first === "string" && first.length > 0 ? first : null;
  }
  if (d.target_type === "agent" && t.avatar) return String(t.avatar);
  return null;
}

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const x = new Date(iso);
  if (Number.isNaN(x.getTime())) return null;
  return x.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminReviewDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const reviewId = params.reviewId;

  const { data, isLoading, isError, refetch } =
    useAdminReviewDetailQuery(reviewId);

  const { hideMutation, unhideMutation, deleteMutation } = useAdminReviewMutations(
    reviewId,
    { onDeleted: () => navigation.goBack() }
  );

  const busy =
    hideMutation.isPending || unhideMutation.isPending || deleteMutation.isPending;

  const propertyId = useMemo(
    () => (data ? propertyIdFromDetail(data) : null),
    [data]
  );
  const agentId = useMemo(() => (data ? agentIdFromDetail(data) : null), [data]);
  const heroUri = useMemo(() => (data ? heroThumbUri(data) : null), [data]);

  const confirmDelete = () => {
    Alert.alert(
      "Xóa đánh giá",
      "Hành động này không hoàn tác. Tiếp tục?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading || !data) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={ACCENT} />
        <Text style={styles.muted}>Đang tải chi tiết…</Text>
        {isError ? (
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        ) : null}
      </SafeAreaView>
    );
  }

  const reviewer =
    data.user_id && typeof data.user_id === "object"
      ? data.user_id.fullName || data.user_id.email
      : "—";
  const commentVi = data.comment?.vi?.trim() || "";
  const commentEn = data.comment?.en?.trim() || "";
  const created = formatDate(data.createdAt);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.toolbarTitle}>Chi tiết đánh giá</Text>
        <View style={styles.toolbarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          {heroUri ? (
            <Image source={{ uri: heroUri }} style={styles.heroImg} contentFit="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Ionicons name="chatbubble-ellipses" size={40} color="#94a3b8" />
            </View>
          )}
          <View style={styles.heroOverlay}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{targetLabelVi(data.target_type)}</Text>
            </View>
            <Text style={styles.heroRating}>{data.rating} / 5 sao</Text>
            {created ? (
              <Text style={styles.heroDate}>{created}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người đánh giá</Text>
          <Text style={styles.sectionBody}>{reviewer}</Text>
        </View>

        <View style={styles.rowCards}>
          <View style={[styles.miniCard, { borderLeftColor: "#2563eb" }]}>
            <Text style={styles.miniLabel}>Trạng thái</Text>
            <Text style={styles.miniValue}>{statusLabelVi(data.status)}</Text>
          </View>
          <View style={[styles.miniCard, { borderLeftColor: "#64748b" }]}>
            <Text style={styles.miniLabel}>Ẩn công khai</Text>
            <Text style={styles.miniValue}>{data.is_hidden ? "Có" : "Không"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nội dung (Tiếng Việt)</Text>
          <View style={styles.quote}>
            <Text style={styles.quoteText}>{commentVi || "—"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nội dung (English)</Text>
          <View style={styles.quote}>
            <Text style={styles.quoteText}>{commentEn || "—"}</Text>
          </View>
        </View>

        {data.rejection_reason ? (
          <View style={[styles.section, styles.warnBox]}>
            <Text style={styles.sectionTitle}>Lý do từ chối</Text>
            <Text style={styles.sectionBody}>{data.rejection_reason}</Text>
          </View>
        ) : null}

        {propertyId ? (
          <Pressable
            style={styles.linkBtn}
            onPress={() =>
              navigation.navigate("PropertyDetails", { propertyId })
            }
          >
            <View style={styles.linkIconWrap}>
              <Ionicons name="home-outline" size={22} color={ACCENT} />
            </View>
            <View style={styles.linkTextCol}>
              <Text style={styles.linkTitle}>Xem tin đăng</Text>
              <Text style={styles.linkSub}>Mở trang bất động sản</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </Pressable>
        ) : null}

        {agentId ? (
          <Pressable
            style={styles.linkBtn}
            onPress={() => navigation.navigate("AgentDetail", { agentId })}
          >
            <View style={[styles.linkIconWrap, { backgroundColor: "#f3e8ff" }]}>
              <Ionicons name="person-outline" size={22} color="#7c3aed" />
            </View>
            <View style={styles.linkTextCol}>
              <Text style={styles.linkTitle}>Hồ sơ môi giới</Text>
              <Text style={styles.linkSub}>Xem trang đại diện</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </Pressable>
        ) : null}

        <View style={styles.actions}>
          {data.is_hidden ? (
            <Pressable
              style={[styles.actionBtn, styles.unhideBtn]}
              onPress={() => unhideMutation.mutate()}
              disabled={busy}
            >
              {unhideMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="eye-outline" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Hiển thị lại</Text>
                </>
              )}
            </Pressable>
          ) : (
            <Pressable
              style={[styles.actionBtn, styles.hideBtn]}
              onPress={() => hideMutation.mutate()}
              disabled={busy}
            >
              {hideMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="eye-off-outline" size={20} color="#fff" />
                  <Text style={styles.actionBtnText}>Ẩn khỏi công khai</Text>
                </>
              )}
            </Pressable>
          )}
          <Pressable
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={confirmDelete}
            disabled={busy}
          >
            {deleteMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionBtnText}>Xóa vĩnh viễn</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
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
  muted: { marginTop: 8, color: "#64748b" },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: { padding: 8 },
  toolbarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  toolbarSpacer: { width: 40 },
  scroll: { padding: 16, paddingBottom: 40 },
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
      },
      android: { elevation: 4 },
    }),
  },
  heroImg: { width: "100%", height: 160 },
  heroPlaceholder: {
    height: 140,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    padding: 16,
    backgroundColor: "#fff",
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  heroBadgeText: { fontSize: 12, fontWeight: "800", color: ACCENT },
  heroRating: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  heroDate: { marginTop: 4, fontSize: 13, color: "#64748b" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sectionBody: { fontSize: 16, color: "#0f172a", lineHeight: 24, fontWeight: "600" },
  quote: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quoteText: { fontSize: 15, color: "#334155", lineHeight: 23 },
  rowCards: { flexDirection: "row", gap: 10, marginBottom: 12 },
  miniCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 4,
  },
  miniLabel: { fontSize: 11, fontWeight: "700", color: "#64748b" },
  miniValue: { marginTop: 6, fontSize: 15, fontWeight: "800", color: "#0f172a" },
  warnBox: { borderColor: "#fecaca", backgroundColor: "#fef2f2" },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  linkIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  linkTextCol: { flex: 1 },
  linkTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  linkSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  actions: { marginTop: 8, gap: 12 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  actionBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  hideBtn: { backgroundColor: "#475569" },
  unhideBtn: { backgroundColor: "#15803d" },
  deleteBtn: { backgroundColor: "#b91c1c" },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: ACCENT,
    borderRadius: 12,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
