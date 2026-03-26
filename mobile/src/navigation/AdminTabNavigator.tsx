import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AdminTabParamList } from "../types/navigation";
import AdminUsersScreen from "../screens/admin/AdminUsersScreen";
import AdminPropertyStackNavigator from "./AdminPropertyStackNavigator";
import AdminReviewsStackNavigator from "./AdminReviewsStackNavigator";
import ProfileScreen from "../screens/common/ProfileScreen";
import { NotificationScreen } from "../screens/common/NotificationScreen";
import { useNotifications } from "../hooks/useNotifications";

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminTabNavigator() {
  const { unreadCountQuery } = useNotifications();
  const unreadCount = unreadCountQuery.data || 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1e3a8a",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tab.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{
          tabBarLabel: "User",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminListingModeration"
        component={AdminPropertyStackNavigator}
        options={{
          tabBarLabel: "Properties",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AdminBuyerReviews"
        component={AdminReviewsStackNavigator}
        options={{
          tabBarLabel: "Review buyer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#EF4444",
            color: "white",
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
