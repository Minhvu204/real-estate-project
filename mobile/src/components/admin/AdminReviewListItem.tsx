import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { AdminReviewListRow, ReviewModerationStatus, ReviewTargetType } from "../../types/adminReview";

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

function targetTitleLine(item: AdminReviewListRow): string {
  const t = item.target_id;
  if (t && typeof t === "object") {
    const title = t.title?.vi?.trim() || t.title?.en?.trim();
    if (title) return title;
    if (t.fullName) return t.fullName;
  }
  return "—";
}

function targetMeta(item: AdminReviewListRow): { label: string; color: string; icon: React.ComponentProps<typeof Ionicons>["name"] } {
  switch (item.target_type) {
    case "property":
      return { label: "Bất động sản", color: "#1d4ed8", icon: "home" };
    case "agent":
      return { label: "Môi giới", color: "#7c3aed", icon: "person" };
    case "project":
      return { label: "Dự án", color: "#c2410c", icon: "business" };
    default:
      return { label: "Khác", color: "#64748b", icon: "help-circle-outline" };
  }
}

function statusStyle(s: ReviewModerationStatus) {
  switch (s) {
    case "pending":
      return { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" };
    case "approved":
      return { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" };
    case "rejected":
      return { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" };
    default:
      return { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" };
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

function formatShortDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function leftStripeColor(t: ReviewTargetType): string {
  switch (t) {
    case "property":
      return "#2563eb";
    case "agent":
      return "#7c3aed";
    case "project":
      return "#ea580c";
    default:
      return "#94a3b8";
  }
}

function Stars({ rating }: { rating: number }) {
  const n = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= n ? "star" : "star-outline"}
          size={15}
          color={i <= n ? "#f59e0b" : "#e2e8f0"}
        />
      ))}
      <Text style={styles.ratingNum}>{n}/5</Text>
    </View>
  );
}

export function AdminReviewListItem({ item, onPress }: AdminReviewListItemProps) {
  const st = statusStyle(item.status);
  const thumbUri = useMemo(() => listThumbUri(item), [item]);
  const meta = targetMeta(item);
  const stripe = leftStripeColor(item.target_type);
  const dateStr = formatShortDate(item.createdAt);

  const comment =
    item.comment?.vi?.trim() ||
    item.comment?.en?.trim() ||
    "Không có nội dung";
  const preview =
    comment.length > 118 ? `${comment.slice(0, 118)}…` : comment;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={[styles.stripe, { backgroundColor: stripe }]} />
      <View style={styles.cardInner}>
        <View style={styles.topBlock}>
          {thumbUri ? (
            <Image
              source={{ uri: thumbUri }}
              style={styles.thumb}
              contentFit="cover"
              transition={180}
            />
          ) : (
            <View style={[styles.thumbPlaceholder, { borderColor: meta.color + "40" }]}>
              <Ionicons name={meta.icon} size={26} color={meta.color} />
            </View>
          )}
          <View style={styles.topBody}>
            <View style={styles.nameRow}>
              <Text style={styles.reviewer} numberOfLines={1}>
                {reviewerName(item)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
            </View>
            <Stars rating={item.rating} />
            <View style={styles.pillRow}>
              <View style={[styles.typePill, { backgroundColor: meta.color + "18" }]}>
                <Ionicons name={meta.icon} size={12} color={meta.color} />
                <Text style={[styles.typePillText, { color: meta.color }]}>
                  {meta.label}
                </Text>
              </View>
              {item.is_hidden ? (
                <View style={styles.hiddenPill}>
                  <Ionicons name="eye-off-outline" size={12} color="#64748b" />
                  <Text style={styles.hiddenPillText}>Đã ẩn</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.targetTitle} numberOfLines={2}>
              {targetTitleLine(item)}
            </Text>
          </View>
        </View>

        <View style={styles.quoteBox}>
          <Text style={styles.preview} numberOfLines={4}>
            {preview}
          </Text>
        </View>

        <View style={styles.footerRow}>
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
          {dateStr ? (
            <Text style={styles.dateText}>{dateStr}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: { elevation: 3 },
    }),
  },
  pressed: { opacity: 0.94, transform: [{ scale: 0.995 }] },
  stripe: { width: 4 },
  cardInner: { flex: 1, padding: 14 },
  topBlock: { flexDirection: "row", gap: 12 },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
  },
  thumbPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  topBody: { flex: 1, minWidth: 0 },
  nameRow: {
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
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 2,
  },
  ratingNum: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typePillText: { fontSize: 11, fontWeight: "800" },
  hiddenPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  hiddenPillText: { fontSize: 11, fontWeight: "700", color: "#475569" },
  targetTitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    fontWeight: "500",
  },
  quoteBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e2e8f0",
  },
  preview: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 21,
  },
  footerRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: "800" },
  dateText: { fontSize: 12, color: "#94a3b8", fontWeight: "500" },
});
