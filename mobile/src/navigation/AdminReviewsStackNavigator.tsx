import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AdminReviewsStackParamList } from "../types/navigation";
import AdminReviewsScreen from "../screens/admin/AdminReviewsScreen";
import AdminReviewDetailScreen from "../screens/admin/AdminReviewDetailScreen";

const Stack = createNativeStackNavigator<AdminReviewsStackParamList>();

/** U026 — luồng riêng: danh sách + chi tiết trong cùng stack tab */
export default function AdminReviewsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminReviewsList" component={AdminReviewsScreen} />
      <Stack.Screen
        name="AdminReviewDetail"
        component={AdminReviewDetailScreen}
      />
    </Stack.Navigator>
  );
}
