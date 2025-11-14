import type { Offer, CreateOfferDto, OfferFilters } from '../types/Offer';
import api from '../api/api';
import { mockOffers } from '../mockData/offers';

const USE_MOCK_DATA = true;

export const OfferService = {
  createOffer: async (data: CreateOfferDto): Promise<Offer> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOffer: Offer = {
        _id: `offer_${Date.now()}`,
        property_id: data.property_id,
        buyer_id: 'buyer_1',
        amount: data.amount,
        note: data.note,
        status: 'pending',
        validityPeriod: data.validityPeriod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      mockOffers.push(newOffer);
      return newOffer;
    }

    try {
      const response = await api.post('/api/client/buyer/offers', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to create offer');
    }
  },

  getMyOffers: async (filters?: OfferFilters): Promise<Offer[]> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredOffers = [...mockOffers];
      
      if (filters?.status) {
        filteredOffers = filteredOffers.filter(offer => offer.status === filters.status);
      }
      
      if (filters?.property_id) {
        filteredOffers = filteredOffers.filter(offer => {
          const propId = typeof offer.property_id === 'string' 
            ? offer.property_id 
            : offer.property_id._id;
          return propId === filters.property_id;
        });
      }
      
      return filteredOffers;
    }

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.property_id) params.append('property_id', filters.property_id);
      
      const response = await api.get(`/api/client/buyer/offers?${params.toString()}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch offers');
    }
  },


  cancelOffer: async (offerId: string): Promise<Offer> => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offerIndex = mockOffers.findIndex(offer => offer._id === offerId);
      if (offerIndex === -1) {
        throw new Error('Offer not found');
      }
      
      if (mockOffers[offerIndex].status !== 'pending') {
        throw new Error('Only pending offers can be cancelled');
      }
      
      mockOffers[offerIndex] = {
        ...mockOffers[offerIndex],
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      
      return mockOffers[offerIndex];
    }

    try {
      const response = await api.patch(`/api/client/buyer/offers/${offerId}/cancel`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to cancel offer');
    }
  },
};

