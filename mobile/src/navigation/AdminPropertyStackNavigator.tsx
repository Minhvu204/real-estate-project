import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AdminPropertyStackParamList } from "../types/navigation";
import AdminPropertyModerationScreen from "../screens/admin/AdminPropertyModerationScreen";

const Stack = createNativeStackNavigator<AdminPropertyStackParamList>();

/** U011 — luồng riêng, tách khỏi review buyer */
export default function AdminPropertyStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminPropertyModeration"
        component={AdminPropertyModerationScreen}
      />
    </Stack.Navigator>
  );
}
