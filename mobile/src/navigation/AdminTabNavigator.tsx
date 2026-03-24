import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AdminTabParamList } from '../types/navigation';
import UserListScreen from '../screens/admin/UserListScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { NotificationScreen } from '../screens/common/NotificationScreen';
import { useNotifications } from '../hooks/useNotifications';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminTabNavigator() {
  const { unreadCountQuery } = useNotifications();
  const unreadCount = unreadCountQuery.data || 0;

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#0ea5e9' }}>
      <Tab.Screen 
        name="Users" 
        component={UserListScreen} 
        options={{ 
          tabBarLabel: 'Quản lý',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{ 
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#EF4444', color: 'white', fontSize: 10 }
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> 
        }} 
      />
    </Tab.Navigator>
  );
}
