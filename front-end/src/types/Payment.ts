import type { Deal } from "./Deal";

export type Payment = {
  _id: string;
  deal_id: Deal;
  amount: number;
  payment_date: Date;
  method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};
