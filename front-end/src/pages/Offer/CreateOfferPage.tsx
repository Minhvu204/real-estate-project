import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { OfferForm } from '../../components/Offer/OfferForm';
import { OfferService } from '../../services/offerService';
import type { CreateOfferDto } from '../../types/Offer';
import type { Property } from '../../types/Property';
import { getDetailPropertiesById } from '../../services/propertyService';

const CreateOfferPage: React.FC = () => {
  const { t } = useTranslation('offerManagement');
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (propertyId) {
      const loadProperty = async () => {
        try {
          setIsLoading(true);
          const data = await getDetailPropertiesById(propertyId);
          setProperty(data);
        } catch (error) {
          console.error('Error loading property:', error);
          toast.error(t('error.propertyNotFound'));
        } finally {
          setIsLoading(false);
        }
      };
      loadProperty();
    }
  }, [propertyId, t]);

  const handleSubmitOffer = async (data: CreateOfferDto) => {
    try {
      setIsSubmitting(true);
      await OfferService.createOffer(data);
      toast.success(t('success.offerCreated'));
      
      navigate('/buyer/offer');
    } catch (error: any) {
      console.error('Error creating offer:', error);
      toast.error(error.message || t('error.createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!property) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {t('createTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('error.propertyNotFound')}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        mb={1}
        sx={{ 
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
        }}
      >
        {t('createTitle')}
      </Typography>
      <Typography 
        variant="body1" 
        mb={4}
        sx={{ 
          color: '#666666',
          fontSize: '0.95rem',
        }}
      >
        {t('subtitle')}
      </Typography>

      <OfferForm
        property={property}
        onSubmit={handleSubmitOffer}
        isLoading={isSubmitting}
      />
    </Container>
  );
};

export default CreateOfferPage;

