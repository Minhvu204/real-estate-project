import type { Contract } from "../types/Contract";
import { httpAdmin } from "../utils/httpAdmin";

const RESOURCE = "/contracts";

export interface ContractListResponse {
  contracts: Contract[];
  pagination: any; // nên định nghĩa type cụ thể
}

export const getAllContract = async (
  page: number
): Promise<ContractListResponse> => {
  const res = await httpAdmin.get(RESOURCE, {
    params: { page },
  });
  const data = res.data.data.data;
  const pagination = res.data.data.pagination;
  return {
    contracts: data,
    pagination: pagination,
  };
};

export const approveContract = async (id: string): Promise<Contract> => {
  const res = await httpAdmin.patch(`${RESOURCE}/${id}/approve`);
  return res.data;
};

export const rejectContract = async (
  id: string,
  reason: string
): Promise<Contract> => {
  const res = await httpAdmin.patch(`${RESOURCE}/${id}/reject`, {
    reason,
  });
  return res.data;
};
