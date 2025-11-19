import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { AgentOfferList } from '../../components/Offer/AgentOfferList';
import { OfferService } from '../../services/offerService';
import type { Offer, OfferStatus } from '../../types/Offer';
import AuthContext from '../../context/AuthContext';

const AgentOfferManagementPage: React.FC = () => {
  const { t } = useTranslation('offerManagement');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | undefined>();

  useEffect(() => {
    if (!state.loading && (!state.user || state.user.role?.toLowerCase() !== 'agent')) {
      toast.error(t('error.noPermission'));
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }
  }, [state.loading, state.user, navigate]);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setIsLoading(true);
        const statusParam = searchParams.get('status') as OfferStatus | null;
        const propertyIdParam = searchParams.get('property_id');
        
        const filters: { status?: OfferStatus; property_id?: string } = {};
        if (statusParam) filters.status = statusParam;
        if (propertyIdParam) filters.property_id = propertyIdParam;
        
        const data = await OfferService.getAgentOffers(filters);
        setOffers(Array.isArray(data) ? data : []);
        setStatusFilter(filters.status);
      } catch (error: any) {
        console.error('Load offers error:', error);
        toast.error(error?.message || t('error.loadFailed'));
        setOffers([]); 
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!state.loading) {
      loadOffers();
    }
  }, [searchParams, state.loading]);

  const handleForwardOffer = async (offerId: string) => {
    try {
      await OfferService.forwardOffer(offerId);
      toast.success(t('agentList.forwardSuccess'));
      
      const statusParam = searchParams.get('status') as OfferStatus | null;
      const propertyIdParam = searchParams.get('property_id');
      const filters: { status?: OfferStatus; property_id?: string } = {};
      if (statusParam) filters.status = statusParam;
      if (propertyIdParam) filters.property_id = propertyIdParam;
      
      const updatedOffers = await OfferService.getAgentOffers(filters);
      setOffers(Array.isArray(updatedOffers) ? updatedOffers : []);
    } catch (error: any) {
      console.error('Forward offer error:', error);
      toast.error(error?.message || t('agentList.forwardError'));
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

  const handleViewDetail = (offerId: string) => {
    navigate(`/agent/offers/${offerId}`);
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{ 
              color: '#1976D2',
              letterSpacing: '-0.02em',
            }}
          >
            {t('agentList.title')}
          </Typography>
          <Typography 
            variant="body1" 
            mt={1}
            sx={{ 
              color: '#424242',
              fontSize: '0.95rem',
            }}
          >
            {t('agentList.subtitle')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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

      <AgentOfferList
        offers={offers}
        onForwardOffer={handleForwardOffer}
        isLoading={isLoading}
        onViewDetail={handleViewDetail}
      />
    </Container>
  );
};

export default AgentOfferManagementPage;

