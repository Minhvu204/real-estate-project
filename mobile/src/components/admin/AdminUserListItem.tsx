import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import type { AdminUserRow } from "../../types/adminUser";

const ROLE_LABELS: Record<string, string> = {
  buyer: "Người mua",
  seller: "Chủ nhà",
  agent: "Môi giới",
  admin: "Quản trị",
};

type Props = {
  item: AdminUserRow;
  onPress?: (item: AdminUserRow) => void;
};

function AdminUserListItemInner({ item, onPress }: Props) {
  const roleLabel = ROLE_LABELS[item.role] ?? item.role;
  const active = item.isActive !== false;

  const content = (
    <View style={styles.row}>
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : require("../../../assets/default-avatar.png")
        }
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {item.fullName}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {item.email}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.badge, styles.badgeRole]}>
            <Text style={styles.badgeText}>{roleLabel}</Text>
          </View>
          <View
            style={[
              styles.badge,
              active ? styles.badgeActive : styles.badgeInactive,
            ]}
          >
            <Text style={styles.badgeTextMuted}>
              {active ? "Hoạt động" : "Đã khóa"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={() => onPress(item)} style={({ pressed }) => [pressed && styles.pressed]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

export const AdminUserListItem = React.memo(AdminUserListItemInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  pressed: { opacity: 0.85 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
  },
  body: { flex: 1, marginLeft: 12, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  email: { fontSize: 13, color: "#64748b", marginTop: 2 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, gap: 6 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeRole: { backgroundColor: "#dbeafe" },
  badgeActive: { backgroundColor: "#dcfce7" },
  badgeInactive: { backgroundColor: "#fee2e2" },
  badgeText: { fontSize: 11, fontWeight: "600", color: "#1e40af" },
  badgeTextMuted: { fontSize: 11, fontWeight: "600", color: "#334155" },
});
