import { api } from './api';

export const assignmentService = {
  // Seller gửi yêu cầu gán agent cho property
  createAssignmentRequest: async (propertyId: string, agentId: string, note?: string) => {
    const response = await api.post(`/client/seller/properties/${propertyId}/assign-agent`, { agent_id: agentId, note });
    return response.data;
  },

  // Seller hủy yêu cầu gán (khi đang ở trạng thái pending)
  cancelAssignmentRequest: async (assignmentId: string) => {
    const response = await api.patch(`/client/seller/assignments/${assignmentId}/cancel`);
    return response.data;
  },

  // Seller lấy danh sách yêu cầu từ các agent gửi đến
  getSellerAssignments: async (params?: { status?: string }) => {
    const response = await api.get('/client/seller/assignments', { params });
    return response.data.data;
  },

  // Seller chấp nhận yêu cầu của agent
  sellerAcceptRequest: async (assignmentId: string) => {
    const response = await api.patch(`/client/seller/assignments/${assignmentId}/accept`);
    return response.data;
  },

  // Seller từ chối yêu cầu của agent
  sellerRejectRequest: async (assignmentId: string, reason?: string) => {
    const response = await api.patch(`/client/seller/assignments/${assignmentId}/reject`, { reason });
    return response.data;
  },

  // Seller gỡ agent khỏi property (sau khi đã gán thành công)
  removeAgentFromProperty: async (propertyId: string) => {
    const response = await api.patch(`/client/seller/properties/${propertyId}/remove-agent`);
    return response.data;
  },

  // Agent lấy danh sách yêu cầu gán từ seller
  getAgentAssignments: async (params?: { status?: string }) => {
    const response = await api.get('/client/agent/assignments', { params });
    return response.data.data;
  },

  // Agent chấp nhận yêu cầu của seller
  agentAcceptRequest: async (assignmentId: string) => {
    const response = await api.patch(`/client/agent/assignments/${assignmentId}/accept`);
    return response.data;
  },

  // Agent từ chối yêu cầu của seller
  agentRejectRequest: async (assignmentId: string, reason?: string) => {
    const response = await api.patch(`/client/agent/assignments/${assignmentId}/reject`, { reason });
    return response.data;
  },

  // Agent chủ động xin quản lý BĐS của seller
  agentRequestManage: async (propertyId: string, note?: string) => {
    const response = await api.post(`/client/agent/properties/${propertyId}/request-manage`, { note });
    return response.data;
  },

  // Agent hủy yêu cầu xin quản lý đã gửi
  agentCancelRequest: async (assignmentId: string) => {
    const response = await api.patch(`/client/agent/assignments/${assignmentId}/cancel`);
    return response.data;
  }
};
