import { useMutation, useQuery } from "@tanstack/react-query";
import { offerService } from "../services/offerService";
import type { CreateOfferDto, OfferFilters, Offer } from "../types/offer";

/**
 * Hook for creating an offer
 */
export const useCreateOffer = () => {
  return useMutation({
    mutationFn: (data: CreateOfferDto) => offerService.createOffer(data),
  });
};

/**
 * Hook for getting buyer's offers
 */
export const useGetMyOffers = (filters?: OfferFilters, enabled?: boolean) => {
  return useQuery({
    queryKey: [
      "myOffers",
      filters?.status,
      filters?.propertyId,
      filters?.page,
      filters?.limit,
    ],
    queryFn: () => offerService.getMyOffers(filters),
    enabled: enabled !== false,
  });
};

/**
 * Hook for canceling an offer
 */
export const useCancelOffer = () => {
  return useMutation({
    mutationFn: (offerId: string) => offerService.cancelOffer(offerId),
  });
};

/**
 * Hook for getting a single offer
 */
export const useGetOffer = (offerId: string | undefined, enabled?: boolean) => {
  return useQuery({
    queryKey: ["offer", offerId],
    queryFn: async () => {
      if (!offerId) throw new Error("No offer ID provided");
      // NOTE: Backend doesn't seem to have a GET single offer endpoint
      // This is a placeholder for future use
      return null;
    },
    enabled: enabled !== false && !!offerId,
  });
};
