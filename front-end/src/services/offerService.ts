import type { Offer, CreateOfferDto, OfferFilters } from '../types/Offer';
import api from '../api/api';
import offersDataJson from '../data/offers.json';

let mockOffersStore: Offer[] = [...(offersDataJson.offers as unknown as Offer[])];

export const OfferService = {
  createOffer: async (data: CreateOfferDto): Promise<Offer> => {
    try {
      const apiPayload = {
        propertyId: data.property_id,
        amount: data.amount,
        note: data.note || '',
        currency: data.currency || 'VND',
        expiresAt: data.validityPeriod,
        attachments: data.attachments || [],
        meta: data.meta || {},
      };
      
      const response = await api.post('/api/client/buyer/offers', apiPayload);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create offer';
      throw new Error(errorMessage);
    }
  },

  getMyOffers: async (filters?: OfferFilters): Promise<Offer[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.property_id) params.append('propertyId', filters.property_id);
      
      const response = await api.get(`/api/client/buyer/offers?${params.toString()}`);
      
      const responseData = response.data.data || response.data;
      const offers = responseData.data || responseData;
      
      if (!Array.isArray(offers)) {
        return [];
      }
      
      return offers;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch offers');
    }
  },

  cancelOffer: async (offerId: string): Promise<Offer> => {
    try {
      const response = await api.patch(`/api/client/buyer/offers/${offerId}/cancel`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to cancel offer');
    }
  },

  getOfferById: async (offerId: string, role: 'seller' | 'agent'): Promise<Offer> => {
    try {
      if (role === 'seller' || role === 'agent') {
        const offer = mockOffersStore.find(o => o._id === offerId);
        if (offer) {
          return offer;
        }
      }
      
      const endpoint = role === 'seller' 
        ? `/api/client/seller/offers/${offerId}`
        : `/api/client/agent/offers/${offerId}`;
      const response = await api.get(endpoint);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch offer details');
    }
  },

  getSellerOffers: async (filters?: OfferFilters): Promise<Offer[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredOffers = [...mockOffersStore];
      
      if (filters?.status) {
        filteredOffers = filteredOffers.filter(offer => offer.status === filters.status);
      }
      
      if (filters?.property_id) {
        filteredOffers = filteredOffers.filter(offer => {
          const property = typeof offer.property_id === 'object' ? offer.property_id : null;
          return property && property._id === filters.property_id;
        });
      }
      
      filteredOffers.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      return filteredOffers;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch seller offers');
    }
  },

  acceptOffer: async (offerId: string): Promise<Offer> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offerIndex = mockOffersStore.findIndex(o => o._id === offerId);
      if (offerIndex === -1) {
        throw new Error('Offer not found');
      }
      
      const offer = mockOffersStore[offerIndex];
      
      if (offer.status !== 'forwarded_to_seller' && offer.status !== 'seller_reviewing') {
        throw new Error('Only offers with status "forwarded_to_seller" or "seller_reviewing" can be accepted');
      }
      
      const updatedOffer: Offer = {
        ...offer,
        status: 'accepted',
        reviewed_by: {
          _id: '2',
          fullName: 'Seller 1',
        },
        reviewed_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockOffersStore[offerIndex] = updatedOffer;
      
      return updatedOffer;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to accept offer');
    }
  },

  rejectOffer: async (offerId: string, reason?: string): Promise<Offer> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offerIndex = mockOffersStore.findIndex(o => o._id === offerId);
      if (offerIndex === -1) {
        throw new Error('Offer not found');
      }
      
      const offer = mockOffersStore[offerIndex];
      
      if (offer.status !== 'forwarded_to_seller' && offer.status !== 'seller_reviewing') {
        throw new Error('Only offers with status "forwarded_to_seller" or "seller_reviewing" can be rejected');
      }
      
      const updatedOffer: Offer = {
        ...offer,
        status: 'rejected',
        reviewed_by: {
          _id: '2',
          fullName: 'Seller 1',
        },
        reviewed_at: new Date().toISOString(),
        rejection_reason: reason,
        updatedAt: new Date().toISOString(),
      };
      
      mockOffersStore[offerIndex] = updatedOffer;
      
      return updatedOffer;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to reject offer');
    }
  },

  getAgentOffers: async (filters?: OfferFilters): Promise<Offer[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredOffers = mockOffersStore.filter(offer => {
        const agent = typeof offer.agent_id === 'object' ? offer.agent_id : null;
        return agent !== null;
      });
      
      if (filters?.status) {
        filteredOffers = filteredOffers.filter(offer => offer.status === filters.status);
      }
      
      if (filters?.property_id) {
        filteredOffers = filteredOffers.filter(offer => {
          const property = typeof offer.property_id === 'object' ? offer.property_id : null;
          return property && property._id === filters.property_id;
        });
      }
      
      filteredOffers.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      return filteredOffers;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch agent offers');
    }
  },

  forwardOffer: async (offerId: string): Promise<Offer> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offerIndex = mockOffersStore.findIndex(o => o._id === offerId);
      if (offerIndex === -1) {
        throw new Error('Offer not found');
      }
      
      const offer = mockOffersStore[offerIndex];
      
      if (offer.status !== 'pending') {
        throw new Error('Only offers with status "pending" can be forwarded');
      }
      
      const updatedOffer: Offer = {
        ...offer,
        status: 'forwarded_to_seller',
        forwarded_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockOffersStore[offerIndex] = updatedOffer;
      
      return updatedOffer;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to forward offer');
    }
  },
};

