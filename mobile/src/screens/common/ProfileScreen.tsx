import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/auth/authSlice';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../../components/common/CustomButton';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    dispatch(logout());
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-2">Hồ Sơ Cá Nhân</Text>
        <Text className="text-gray-500 mb-8">Đăng nhập tài khoản: {user?.email}</Text>
        <Text className="text-primary font-semibold mb-6">Vai trò: {user?.role || 'Buyer'}</Text>

        <CustomButton title="Đăng Xuất" onPress={handleLogout} outline className="w-full border-red-500" />
      </View>
    </SafeAreaView>
  );
}
