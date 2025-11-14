import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { OfferForm } from '../components/Offer/OfferForm';
import { OfferList } from '../components/Offer/OfferList';
import { OfferService } from '../services/offerService';
import type { Offer, CreateOfferDto, OfferStatus } from '../types/Offer';
import type { Property } from '../types/Property';
import { getDetailPropertiesById } from '../services/propertyService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const OfferManagement: React.FC = () => {
  const { t } = useTranslation('offerManagement');
  const { id: propertyId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeTab, setActiveTab] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | undefined>();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'list') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [searchParams]);

  useEffect(() => {
    if (propertyId) {
      const loadProperty = async () => {
        try {
          setIsLoadingProperty(true);
          const data = await getDetailPropertiesById(propertyId);
          setProperty(data);
        } catch (error) {
          console.error('Error loading property:', error);
          toast.error(t('error.propertyNotFound'));
        } finally {
          setIsLoadingProperty(false);
        }
      };
      loadProperty();
    }
  }, [propertyId, t]);

  const loadOffers = useCallback(async () => {
    try {
      setIsLoadingOffers(true);
      const data = await OfferService.getMyOffers({
        status: statusFilter,
        property_id: propertyId,
      });
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      toast.error(t('error.loadFailed'));
    } finally {
      setIsLoadingOffers(false);
    }
  }, [statusFilter, propertyId, t]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      setSearchParams({ tab: 'create' });
    } else {
      setSearchParams({ tab: 'list' });
    }
  };

  const handleSubmitOffer = async (data: CreateOfferDto) => {
    try {
      setIsSubmitting(true);
      await OfferService.createOffer(data);
      toast.success(t('success.offerCreated'));
      
      await loadOffers();
      
      setActiveTab(1);
      setSearchParams({ tab: 'list' });
    } catch (error: any) {
      console.error('Error creating offer:', error);
      toast.error(error.message || t('error.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelOffer = async (offerId: string) => {
    try {
      await OfferService.cancelOffer(offerId);
      toast.success(t('list.cancelSuccess'));
      
      await loadOffers();
    } catch (error: any) {
      console.error('Error cancelling offer:', error);
      toast.error(error.message || t('list.cancelError'));
    }
  };

  const handleFilterChange = (status?: OfferStatus) => {
    setStatusFilter(status);
  };

  const pendingCount = offers.filter(offer => offer.status === 'pending').length;

  if (isLoadingProperty && !property && propertyId) {
    return (
      <Container sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (activeTab === 0 && !property && !propertyId) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('error.propertyNotFound')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {t('subtitle')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label={t('tabs.createNew')} />
          <Tab
            label={
              <Badge badgeContent={pendingCount} color="primary">
                {t('tabs.offerHistory')}
              </Badge>
            }
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        {property ? (
          <OfferForm
            property={property}
            onSubmit={handleSubmitOffer}
            isLoading={isSubmitting}
          />
        ) : (
          <Typography color="text.secondary">
            {t('error.propertyNotFound')}
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <OfferList
          offers={offers}
          onCancelOffer={handleCancelOffer}
          isLoading={isLoadingOffers}
          filters={{ status: statusFilter }}
          onFilterChange={handleFilterChange}
        />
      </TabPanel>
    </Container>
  );
};

export default OfferManagement;

