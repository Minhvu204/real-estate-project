import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { RootStackParamList } from '../types/navigation';

import AuthNavigator from './AuthNavigator';
import BuyerTabNavigator from './BuyerTabNavigator';
import SellerAgentTabNavigator from './SellerAgentTabNavigator';
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen';
import EditPropertyScreen from '../screens/seller/EditPropertyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const getRoleNavigator = () => {
    if (user?.role === 'seller' || user?.role === 'agent') {
      return <Stack.Screen name="SellerAgentMain" component={SellerAgentTabNavigator} />;
    }
    // Default to buyer
    return <Stack.Screen name="BuyerMain" component={BuyerTabNavigator} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            {getRoleNavigator()}
            <Stack.Screen
              name="PropertyDetails"
              component={PropertyDetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="EditProperty"
              component={EditPropertyScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
