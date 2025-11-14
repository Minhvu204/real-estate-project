import type { OfferStatus } from '../types/Offer';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const getStatusColor = (status: OfferStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'forwarded_to_seller':
      return 'info';
    case 'seller_reviewing':
      return 'info';
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'error';
    case 'cancelled':
      return 'default';
    default:
      return 'default';
  }
};

