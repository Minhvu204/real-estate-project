import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { AdminReviewListRow, ReviewModerationStatus } from "../../types/adminReview";

type AdminReviewListItemProps = {
  item: AdminReviewListRow;
  onPress: () => void;
};

function reviewerName(item: AdminReviewListRow): string {
  const u = item.user_id;
  if (u && typeof u === "object" && "fullName" in u) {
    return u.fullName || u.email || "—";
  }
  return "—";
}

function targetSummary(item: AdminReviewListRow): string {
  const t = item.target_id;
  const typeLabel =
    item.target_type === "property"
      ? "BĐS"
      : item.target_type === "agent"
        ? "Môi giới"
        : "Dự án";
  if (t && typeof t === "object") {
    const title = t.title?.vi?.trim() || t.title?.en?.trim();
    if (title) return `${typeLabel}: ${title}`;
    if (t.fullName) return `${typeLabel}: ${t.fullName}`;
  }
  return typeLabel;
}

function statusStyle(s: ReviewModerationStatus) {
  switch (s) {
    case "pending":
      return { bg: "#fef3c7", color: "#b45309", border: "#fcd34d" };
    case "approved":
      return { bg: "#dcfce7", color: "#166534", border: "#86efac" };
    case "rejected":
      return { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" };
    default:
      return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
  }
}

function statusLabel(s: ReviewModerationStatus): string {
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

/** Ảnh BĐS (images[0]) hoặc avatar môi giới — khớp dữ liệu populate từ API */
function listThumbUri(item: AdminReviewListRow): string | null {
  const t = item.target_id;
  if (!t || typeof t !== "object") return null;
  if (item.target_type === "property") {
    const first = Array.isArray(t.images) ? t.images[0] : null;
    return typeof first === "string" && first.length > 0 ? first : null;
  }
  if (item.target_type === "agent" && t.avatar && String(t.avatar).length > 0) {
    return String(t.avatar);
  }
  return null;
}

function Stars({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= n ? "star" : "star-outline"}
          size={14}
          color={i <= n ? "#ca8a04" : "#cbd5e1"}
        />
      ))}
    </View>
  );
}

export function AdminReviewListItem({ item, onPress }: AdminReviewListItemProps) {
  const st = statusStyle(item.status);
  const thumbUri = useMemo(() => listThumbUri(item), [item]);
  const comment =
    item.comment?.vi?.trim() ||
    item.comment?.en?.trim() ||
    "(Không có nội dung)";
  const preview =
    comment.length > 120 ? `${comment.slice(0, 120)}…` : comment;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.mediaRow}>
        {thumbUri ? (
          <Image
            source={{ uri: thumbUri }}
            style={styles.thumb}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons
              name={
                item.target_type === "agent" ? "person-outline" : "home-outline"
              }
              size={28}
              color="#94a3b8"
            />
          </View>
        )}
        <View style={styles.mediaBody}>
          <View style={styles.topRow}>
            <Text style={styles.reviewer} numberOfLines={1}>
              {reviewerName(item)}
            </Text>
            {item.is_hidden ? (
              <View style={styles.hiddenBadge}>
                <Text style={styles.hiddenText}>Đã ẩn</Text>
              </View>
            ) : null}
          </View>
          <Stars rating={item.rating} />
          <Text style={styles.target} numberOfLines={2}>
            {targetSummary(item)}
          </Text>
        </View>
      </View>
      <Text style={styles.preview} numberOfLines={3}>
        {preview}
      </Text>
      <View
        style={[
          styles.statusChip,
          { backgroundColor: st.bg, borderColor: st.border },
        ]}
      >
        <Text style={[styles.statusText, { color: st.color }]}>
          {statusLabel(item.status)}
        </Text>
      </View>
      <Text style={styles.hint}>Chạm để xem chi tiết · quản lý ẩn / xóa</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  pressed: { opacity: 0.92 },
  mediaRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  thumbPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaBody: { flex: 1, minWidth: 0 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  reviewer: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  hiddenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
  },
  hiddenText: { fontSize: 11, fontWeight: "700", color: "#475569" },
  starsRow: { flexDirection: "row", marginTop: 6, gap: 2 },
  target: { fontSize: 13, color: "#475569", marginTop: 6 },
  preview: { fontSize: 14, color: "#334155", marginTop: 6, lineHeight: 20 },
  statusChip: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  hint: { marginTop: 10, fontSize: 11, color: "#94a3b8" },
});
