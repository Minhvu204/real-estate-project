import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BuyerTabParamList } from '../types/navigation';
import HomeScreen from '../screens/buyer/HomeScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationScreen } from '../screens/common/NotificationScreen';
import { useNotifications } from '../hooks/useNotifications';
import BuyerAppointmentsScreen from '../screens/buyer/BuyerAppointmentsScreen';

const Tab = createBottomTabNavigator<BuyerTabParamList>();

// Placeholder for Favorites
const FavoritesScreenPlaceholder = () => <View className="flex-1 justify-center items-center"><Text>Favorites</Text></View>;

export default function BuyerTabNavigator() {
  const { unreadCountQuery } = useNotifications();
  const unreadCount = unreadCountQuery.data || 0;

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#3B82F6' }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }} />
      <Tab.Screen name="Favorites" component={FavoritesScreenPlaceholder} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} /> }} />
      <Tab.Screen name="Appointments" component={BuyerAppointmentsScreen} options={{ tabBarLabel: 'Lịch hẹn', tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} /> }} />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{ 
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: { backgroundColor: '#EF4444', color: 'white', fontSize: 10 }
        }} 
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}
