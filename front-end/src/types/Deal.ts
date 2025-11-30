import type { Offer } from "./Offer";

export type Deal = {
  _id: string;
  property_id: {
    _id: string;
    title: {
      vi: string;
      en: string;
    };
    description: {
      vi: string;
      en: string;
    };
    price: number;
    address: {
      vi: string;
      en: string;
    };
    bedrooms: number;
    bathrooms: number;
    area?: number;
    unit?: string;
    yearBuilt?: number;
    floors?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
    city_id?: {
      _id: string;
      city_name: {
        vi: string;
        en: string;
      };
    };
    type_id?: {
      _id: string;
      type_name: {
        vi: string;
        en: string;
      };
    };
    category_id?: {
      _id: string;
      category_name: {
        vi: string;
        en: string;
      };
    };
    owner_id?: {
      _id: string;
      fullName: string;
      email: string;
      phone?: string;
      avatar?: string;
    };
    agent_id?: {
      _id: string;
      fullName: string;
      email: string;
      phone?: string;
      avatar?: string;
    };
    features?: {
      _id: string;
      feature_name: {
        vi: string;
        en: string;
      };
    }[];
    images: string[];
    status: string;
    hiddenNote: string;
    deleted: boolean;
    assignmentHistory: any[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    reviewedAt?: string;
    reviewedBy?: string;
  };
  agent_id?: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  buyer_id: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  seller_id: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  amounts: {
    agreed_price: number;
    currency: string;
    platform_fee: number;
    agent_fee: number;
    seller_payout: number;
  };
  audit: {
    created_from_offer_at: Date;
  };
  offer_id: Offer;
  status: string;
  createdAt: string;
  updatedAt: string;
};
