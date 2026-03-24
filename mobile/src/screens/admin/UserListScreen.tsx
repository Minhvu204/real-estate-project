import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  TextInput,
  RefreshControl,
  FlatList,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAdminUsers, useUpdateUserStatus } from '../../hooks/useAdmin';
import { Image } from 'expo-image';

// --- Khóa / Mở Khóa Toggle Component ---
const StatusToggle = ({ userId, isActive, isPending, onToggle }: { userId: string, isActive: boolean, isPending: boolean, onToggle: (id: string, val: boolean) => void }) => {
  return (
    <View className="items-center justify-center ml-2 pl-3 border-l border-slate-100">
      <Text className={`text-[10px] font-bold mb-1 ${isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isActive ? 'Hoạt động' : 'Đã khóa'}
      </Text>
      {isPending ? (
        <ActivityIndicator size="small" color="#0ea5e9" />
      ) : (
        <Switch
          value={!isActive} // Giá trị switch hiển thị trạng thái "Bị Khóa"
          onValueChange={(locked) => onToggle(userId, !locked)}
          trackColor={{ false: '#e2e8f0', true: '#fb7185' }} // Xám -> Đỏ khi khóa
          thumbColor={!isActive ? '#e11d48' : '#fff'}
        />
      )}
    </View>
  );
};

// --- User Item Component ---
const UserItem = React.memo(({ user, updateStatusMutation }: { user: any; updateStatusMutation: any }) => {
  const isPending = updateStatusMutation.isPending && updateStatusMutation.variables?.id === user.id;

  const handleToggle = (userId: string, targetActiveStatus: boolean) => {
    Alert.alert(
      targetActiveStatus ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
      `Bạn có chắc chắn muốn ${targetActiveStatus ? 'mở khóa' : 'khóa'} tài khoản của ${user.fullName || user.email} không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đồng ý', 
          style: targetActiveStatus ? 'default' : 'destructive',
          onPress: () => updateStatusMutation.mutate({ id: userId, isActive: targetActiveStatus })
        }
      ]
    );
  };

  return (
    <View className="flex-row items-center p-4 mx-4 mb-3 bg-white rounded-2xl shadow-sm border border-slate-100">
      <Image
        source={user.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')}
        className={`w-12 h-12 rounded-full bg-slate-100 ${!user.isActive ? 'opacity-50' : ''}`}
        contentFit="cover"
        transition={200}
      />
      <View className={`flex-1 ml-4 ${!user.isActive ? 'opacity-50' : ''}`}>
        <Text className="text-base font-bold text-slate-800" numberOfLines={1}>
          {user.fullName || 'Chưa cập nhật'}
        </Text>
        <Text className="text-sm text-slate-500 mb-1" numberOfLines={1}>
          {user.email}
        </Text>
        <View className="flex-row items-center">
          <View className={`px-2 py-0.5 rounded-md ${
            user.role === 'admin' ? 'bg-purple-100' : 
            user.role === 'agent' ? 'bg-blue-100' : 
            user.role === 'seller' ? 'bg-green-100' : 'bg-slate-100'
          }`}>
            <Text className={`text-[10px] font-bold uppercase ${
              user.role === 'admin' ? 'text-purple-600' : 
              user.role === 'agent' ? 'text-blue-600' : 
              user.role === 'seller' ? 'text-green-600' : 'text-slate-600'
            }`}>
              {user.role}
            </Text>
          </View>
        </View>
      </View>

      <StatusToggle 
        userId={user.id} 
        isActive={user.isActive} 
        isPending={isPending} 
        onToggle={handleToggle} 
      />
    </View>
  );
});

export default function UserListScreen() {
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useAdminUsers({ role: roleFilter, search: searchTerm });

  const updateStatusMutation = useUpdateUserStatus();

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.data?.results || page.results || []) || [];
  }, [data]);

  const renderHeader = () => (
    <View className="px-4 pt-4 pb-2">
      <Text className="text-2xl font-extrabold text-slate-900 mb-4">Quản lý Tài khoản</Text>
      
      {/* Search Bar */}
      <View className="flex-row items-center bg-slate-100 px-4 py-2 rounded-xl mb-4">
        <Ionicons name="search-outline" size={20} color="#94a3b8" />
        <TextInput
          placeholder="Tìm tên, email..."
          className="flex-1 ml-2 text-slate-800 py-1"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Role Filters */}
      <View className="flex-row mb-4">
        {['all', 'buyer', 'agent', 'seller', 'admin'].map((role) => (
          <Pressable
            key={role}
            onPress={() => setRoleFilter(role === 'all' ? undefined : role)}
            className={`mr-2 px-4 py-2 rounded-full border ${
              (role === 'all' && !roleFilter) || role === roleFilter
                ? 'bg-sky-500 border-sky-500'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text className={`text-xs font-bold capitalize ${
              (role === 'all' && !roleFilter) || role === roleFilter ? 'text-white' : 'text-slate-500'
            }`}>
              {role === 'all' ? 'Tất cả' : role}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="py-6 items-center">
      {isFetchingNextPage ? (
        <ActivityIndicator color="#0ea5e9" />
      ) : hasNextPage ? (
        <Text className="text-slate-400 text-xs">Cuộn để tải thêm</Text>
      ) : users.length > 0 ? (
        <Text className="text-slate-300 text-xs">Đã hết danh sách ({users.length} người dùng)</Text>
      ) : null}
    </View>
  );

  if (isLoading && !isRefetching) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem user={item} updateStatusMutation={updateStatusMutation} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View className="items-center py-20">
            <Ionicons name="people-outline" size={64} color="#e2e8f0" />
            <Text className="mt-4 text-slate-400">Không tìm thấy người dùng nào</Text>
          </View>
        )}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0ea5e9" />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
      />
    </SafeAreaView>
  );
}
