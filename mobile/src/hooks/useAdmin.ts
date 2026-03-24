import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService, { UserListParams } from '../services/adminService';
import { Alert } from 'react-native';

export const useAdminUsers = (params: UserListParams) => {
  return useInfiniteQuery({
    queryKey: ['adminUsers', params],
    queryFn: ({ pageParam = 1 }) => adminService.getUsers({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { currentPage, totalPages } = lastPage?.meta || lastPage?.data?.meta || {};
      if (currentPage && totalPages && currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.updateUserStatus(id, isActive),
    onSuccess: (data: any) => {
      const userName = data?.data?.fullName || data?.fullName || 'Người dùng';
      Alert.alert('Thành công', `Cập nhật trạng thái cho ${userName} thành công.`);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Không thể cập nhật trạng thái.';
      Alert.alert('Lỗi', message);
    },
  });
};
