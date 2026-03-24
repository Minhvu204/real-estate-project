import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  useAdminReviewDetailQuery,
  useAdminReviewMutations,
} from "../../hooks/useAdminReviews";
import type { RootStackParamList } from "../../types/navigation";
import type { AdminReviewDetail } from "../../types/adminReview";

type Route = RouteProp<RootStackParamList, "AdminReviewDetail">;
type Nav = NativeStackNavigationProp<RootStackParamList, "AdminReviewDetail">;

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

export default function AdminReviewDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const reviewId = params.reviewId;

  const { data, isLoading, isError, error, refetch } =
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
        <ActivityIndicator size="large" color="#1e3a8a" />
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
      >
        <View style={styles.card}>
          <Text style={styles.label}>Người đánh giá</Text>
          <Text style={styles.value}>{reviewer}</Text>
          <Text style={styles.label}>Điểm</Text>
          <Text style={styles.value}>{data.rating} / 5</Text>
          <Text style={styles.label}>Loại mục tiêu</Text>
          <Text style={styles.value}>{data.target_type}</Text>
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={styles.value}>{data.status}</Text>
          <Text style={styles.label}>Ẩn khỏi công khai</Text>
          <Text style={styles.value}>{data.is_hidden ? "Có" : "Không"}</Text>
          <Text style={styles.label}>Nội dung (VI)</Text>
          <Text style={styles.block}>{commentVi || "—"}</Text>
          <Text style={styles.label}>Nội dung (EN)</Text>
          <Text style={styles.block}>{commentEn || "—"}</Text>
          {data.rejection_reason ? (
            <>
              <Text style={styles.label}>Lý do từ chối</Text>
              <Text style={styles.block}>{data.rejection_reason}</Text>
            </>
          ) : null}
        </View>

        {propertyId ? (
          <Pressable
            style={styles.linkBtn}
            onPress={() =>
              navigation.navigate("PropertyDetails", { propertyId })
            }
          >
            <Ionicons name="home-outline" size={20} color="#1e3a8a" />
            <Text style={styles.linkBtnText}>Mở bất động sản</Text>
          </Pressable>
        ) : null}

        {agentId ? (
          <Pressable
            style={styles.linkBtn}
            onPress={() => navigation.navigate("AgentDetail", { agentId })}
          >
            <Ionicons name="person-outline" size={20} color="#1e3a8a" />
            <Text style={styles.linkBtnText}>Mở hồ sơ môi giới</Text>
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
                <Text style={styles.actionBtnText}>Bỏ ẩn</Text>
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
                <Text style={styles.actionBtnText}>Ẩn đánh giá</Text>
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
              <Text style={styles.actionBtnText}>Xóa vĩnh viễn</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
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
  muted: { marginTop: 8, color: "#64748b" },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  backBtn: { padding: 8 },
  toolbarTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  toolbarSpacer: { width: 40 },
  scroll: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
  },
  value: { fontSize: 16, color: "#0f172a", marginTop: 4, fontWeight: "600" },
  block: {
    fontSize: 15,
    color: "#334155",
    marginTop: 6,
    lineHeight: 22,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: "#e0e7ff",
    borderRadius: 10,
  },
  linkBtnText: { fontSize: 15, fontWeight: "700", color: "#1e3a8a" },
  actions: { marginTop: 20, gap: 12 },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  actionBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  hideBtn: { backgroundColor: "#475569" },
  unhideBtn: { backgroundColor: "#15803d" },
  deleteBtn: { backgroundColor: "#b91c1c" },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
});
