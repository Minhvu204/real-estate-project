import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { OfferList } from '../../components/Offer/OfferList';
import { OfferService } from '../../services/offerService';
import type { Offer, OfferStatus } from '../../types/Offer';

const OfferHistoryPage: React.FC = () => {
  const { t } = useTranslation('offerManagement');
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | undefined>();

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setIsLoading(true);
        const statusParam = searchParams.get('status') as OfferStatus | null;
        const propertyId = searchParams.get('property_id');
        
        const filters: { status?: OfferStatus; property_id?: string } = {};
        if (statusParam) filters.status = statusParam;
        if (propertyId) filters.property_id = propertyId;
        
        const data = await OfferService.getMyOffers(filters);
        setOffers(data);
        setStatusFilter(filters.status);
      } catch (error) {
        console.error('Error loading offers:', error);
        toast.error(t('error.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    loadOffers();
  }, [searchParams, t]);

  const handleCancelOffer = async (offerId: string) => {
    try {
      await OfferService.cancelOffer(offerId);
      toast.success(t('list.cancelSuccess'));
      
      const statusParam = searchParams.get('status') as OfferStatus | null;
      const propertyId = searchParams.get('property_id');
      
      const filters: { status?: OfferStatus; property_id?: string } = {};
      if (statusParam) filters.status = statusParam;
      if (propertyId) filters.property_id = propertyId;
      
      const updatedOffers = await OfferService.getMyOffers(filters);
      setOffers(updatedOffers);
    } catch (error: any) {
      console.error('Error cancelling offer:', error);
      toast.error(error.message || t('list.cancelError'));
    }
  };

  const handleFilterChange = (status?: OfferStatus) => {
    setStatusFilter(status);
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    setSearchParams(params);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Header with Title and Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{ 
              color: '#1a1a1a',
              letterSpacing: '-0.02em',
            }}
          >
            {t('title')}
          </Typography>
          <Typography 
            variant="body1" 
            mt={1}
            sx={{ 
              color: '#666666',
              fontSize: '0.95rem',
            }}
          >
            {t('subtitle')}
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('list.filter.filterByStatus')}</InputLabel>
          <Select
            value={statusFilter || 'all'}
            label={t('list.filter.filterByStatus')}
            onChange={(e) => handleFilterChange(e.target.value === 'all' ? undefined : (e.target.value as OfferStatus))}
          >
            <MenuItem value="all">{t('list.filter.all')}</MenuItem>
            <MenuItem value="pending">{t('list.status.pending')}</MenuItem>
            <MenuItem value="forwarded_to_seller">{t('list.status.forwarded_to_seller')}</MenuItem>
            <MenuItem value="seller_reviewing">{t('list.status.seller_reviewing')}</MenuItem>
            <MenuItem value="accepted">{t('list.status.accepted')}</MenuItem>
            <MenuItem value="rejected">{t('list.status.rejected')}</MenuItem>
            <MenuItem value="cancelled">{t('list.status.cancelled')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 4 }} />

      <OfferList
        offers={offers}
        onCancelOffer={handleCancelOffer}
        isLoading={isLoading}
        filters={{ status: statusFilter }}
        onFilterChange={undefined}
      />
    </Container>
  );
};

export default OfferHistoryPage;

