import type { Payment } from "../types/Payment";
import { httpAdmin } from "../utils/httpAdmin";

const RESOURCE = "/payments";
export interface PaymentListResponse {
  payments: Payment[];
  pagination: any;
}
export const getAllPayment = async (
  page: number
): Promise<PaymentListResponse> => {
  const res = await httpAdmin.get(RESOURCE, { params: { page } });
  const data = res.data.data.data;
  const pagination = res.data.data.pagination;
  return {
    payments: data,
    pagination: pagination,
  };
};

export const getPaymentDetail = async (id: string): Promise<Payment> => {
  const res = await httpAdmin.get(`${RESOURCE}/${id}`);
  return res.data.data;
};
