import { api } from "./api";
import type {
  Offer,
  CreateOfferDto,
  OfferFilters,
  OfferListResponse,
} from "../types/offer";

export const offerService = {
  /**
   * Create a new offer for a property
   * POST /api/client/buyer/offers
   */
  createOffer: async (data: CreateOfferDto): Promise<Offer> => {
    try {
      const payload = {
        propertyId: data.propertyId,
        amount: data.amount,
        note: data.note || "",
        currency: data.currency || "VND",
        expiresAt: data.expiresAt,
        attachments: data.attachments || [],
        meta: data.meta || {},
      };

      const response = await api.post("/client/buyer/offers", payload);
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create offer";
      throw new Error(errorMessage);
    }
  },

  /**
   * Get buyer's offers
   * GET /api/client/buyer/offers
   */
  getMyOffers: async (filters?: OfferFilters): Promise<OfferListResponse> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.propertyId) params.append("propertyId", filters.propertyId);
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());

      const response = await api.get(
        `/client/buyer/offers?${params.toString()}`,
      );

      const responseData = response.data.data || response.data;
      return {
        data: Array.isArray(responseData)
          ? responseData
          : responseData.data || [],
        total: responseData.total,
        page: responseData.page,
        limit: responseData.limit,
      };
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch offers";
      throw new Error(errorMessage);
    }
  },

  /**
   * Cancel an offer
   * PATCH /api/client/buyer/offers/{id}/cancel
   */
  cancelOffer: async (offerId: string): Promise<Offer> => {
    try {
      const response = await api.patch(
        `/client/buyer/offers/${offerId}/cancel`,
      );
      return response.data.data || response.data;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel offer";
      throw new Error(errorMessage);
    }
  },
};
