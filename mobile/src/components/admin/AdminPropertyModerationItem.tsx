import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AdminPropertyListRow, PropertyModerationStatus } from "../../types/adminProperty";

type AdminPropertyModerationItemProps = {
  item: AdminPropertyListRow;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onOpenDetail: () => void;
};

function statusLabel(s: PropertyModerationStatus | undefined): string {
  switch (s) {
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    case "available":
      return "Chờ duyệt";
    case "sold":
      return "Đã bán";
    case "rented":
      return "Cho thuê";
    default:
      return "—";
  }
}

function statusChipStyle(s: PropertyModerationStatus | undefined) {
  switch (s) {
    case "pending":
    case "available":
      return { bg: "#fef3c7", color: "#b45309", border: "#fcd34d" };
    case "approved":
      return { bg: "#dcfce7", color: "#166534", border: "#86efac" };
    case "rejected":
      return { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" };
    default:
      return { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
  }
}

export function AdminPropertyModerationItem({
  item,
  busy,
  onApprove,
  onReject,
  onOpenDetail,
}: AdminPropertyModerationItemProps) {
  const id = String(item._id);
  const title =
    item.title?.vi?.trim() ||
    item.title?.en?.trim() ||
    "Không có tiêu đề";
  const address =
    item.address?.vi?.trim() || item.address?.en?.trim() || "";
  const owner = item.owner_id;
  const ownerName =
    owner && typeof owner === "object" && "fullName" in owner
      ? owner.fullName || owner.email || "—"
      : "—";
  const chip = statusChipStyle(item.status);
  const thumb = item.images?.[0];
  const isPending = item.status === "pending";
  const priceText = useMemo(() => {
    if (item.price == null || Number.isNaN(Number(item.price))) {
      return "—";
    }
    return `${Number(item.price).toLocaleString("vi-VN")} ₫`;
  }, [item.price]);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onOpenDetail}
        style={({ pressed }) => [
          styles.rowTop,
          pressed && styles.cardPressed,
        ]}
      >
        {thumb ? (
          <Image source={{ uri: thumb }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="image-outline" size={28} color="#94a3b8" />
          </View>
        )}
        <View style={styles.main}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {address ? (
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
          ) : null}
          <Text style={styles.meta}>
            Chủ bài: {ownerName} · {priceText}
          </Text>
          <View
            style={[
              styles.statusChip,
              { backgroundColor: chip.bg, borderColor: chip.border },
            ]}
          >
            <Text style={[styles.statusText, { color: chip.color }]}>
              {statusLabel(item.status)}
            </Text>
          </View>
        </View>
      </Pressable>
      {isPending ? (
        <View style={styles.actions}>
          <Pressable
            onPress={onApprove}
            disabled={busy}
            style={[styles.btn, styles.btnApprove, busy && styles.btnDisabled]}
          >
            {busy ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.btnApproveText}>Phê duyệt</Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={onReject}
            disabled={busy}
            style={[styles.btn, styles.btnReject, busy && styles.btnDisabled]}
          >
            <Ionicons name="close-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnRejectText}>Từ chối</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.hint}>Chạm phần trên để xem chi tiết · …{id.slice(-6)}</Text>
      )}
    </View>
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
  cardPressed: { opacity: 0.92 },
  rowTop: { flexDirection: "row", gap: 12, borderRadius: 8 },
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
  main: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 22,
  },
  address: { fontSize: 13, color: "#64748b", marginTop: 4 },
  meta: { fontSize: 13, color: "#475569", marginTop: 6 },
  statusChip: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e2e8f0",
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnDisabled: { opacity: 0.55 },
  btnApprove: { backgroundColor: "#15803d" },
  btnApproveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  btnReject: { backgroundColor: "#b91c1c" },
  btnRejectText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
});
