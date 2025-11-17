export type OfferStatus = 
  | "pending" 
  | "forwarded_to_seller" 
  | "seller_reviewing" 
  | "accepted" 
  | "rejected" 
  | "cancelled";

export type Offer = {
  _id: string;
  property_id: string | {
    _id: string;
    title: {
      vi: string;
      en: string;
    };
    address: {
      vi: string;
      en: string;
    };
    price: number;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    images?: string[];
  };
  buyer_id: string | {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  agent_id?: string | {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  seller_id?: string | {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  amount: number;
  currency?: string;
  note?: string;
  status: OfferStatus;
  expires_at?: string; // ISO date string - từ backend
  forwarded_at?: string;
  reviewed_by?: string | {
    _id: string;
    fullName: string;
  };
  reviewed_at?: string;
  rejection_reason?: string;
  attachments?: string[];
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type CreateOfferDto = {
  property_id: string;
  amount: number;
  validityPeriod: string; // ISO date string
  note?: string;
  currency?: string;
  attachments?: string[];
  meta?: Record<string, any>;
}

export type OfferFilters = {
  status?: OfferStatus;
  property_id?: string;
}

