import type { Deal } from "../types/Deal";
import { httpAdmin } from "../utils/httpAdmin";

const RESOURCE = "/deals";

export interface DealListResponse {
  deals: Deal[];
  pagination: any;
}

export const getAllDeal = async (page: number): Promise<DealListResponse> => {
  const res = await httpAdmin.get(RESOURCE, {
    params: { page },
  });
  const data = res.data.data.data;
  const pagination = res.data.data.pagination;
  return {
    deals: data,
    pagination: pagination,
  };
};

export const approveOrRejectDeal = async (
  id: string,
  status: string
): Promise<Deal> => {
  const res = await httpAdmin.patch(`${RESOURCE}/${id}/status`, {
    status,
  });
  return res.data;
};
