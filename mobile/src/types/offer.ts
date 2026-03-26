export type OfferStatus =
  | "pending"
  | "forwarded_to_seller"
  | "seller_reviewing"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface Offer {
  _id: string;
  property_id: string;
  buyer_id: string;
  agent_id?: string;
  seller_id?: string;
  amount: number;
  currency: string;
  note?: string;
  status: OfferStatus;
  expires_at?: string;
  forwarded_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  attachments?: string[];
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferDto {
  propertyId: string;
  amount: number;
  note?: string;
  currency?: string;
  expiresAt: string;
  attachments?: string[];
  meta?: Record<string, any>;
}

export interface OfferFilters {
  status?: OfferStatus;
  propertyId?: string;
  page?: number;
  limit?: number;
}

export interface OfferListResponse {
  data: Offer[];
  total?: number;
  page?: number;
  limit?: number;
}
