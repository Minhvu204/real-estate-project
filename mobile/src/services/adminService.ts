import { api } from './api';

export interface UserListParams {
  role?: string;
  page?: number;
  limit?: number;
  search?: string;
}

const adminService = {
  getUsers: async (params: UserListParams) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },
};

export default adminService;
