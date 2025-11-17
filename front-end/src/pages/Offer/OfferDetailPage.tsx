import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Avatar,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import NoteIcon from '@mui/icons-material/Note';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { OfferService } from '../../services/offerService';
import type { Offer } from '../../types/Offer';
import AuthContext from '../../context/AuthContext';

const OfferDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const { t, i18n } = useTranslation('offerManagement');
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffer = async () => {
      if (!id) {
        toast.error(t('detail.errors.noId'));
        navigate(-1);
        return;
      }

      const userRole = state.user?.role?.toLowerCase();
      if (userRole !== 'seller' && userRole !== 'agent') {
        toast.error(t('detail.errors.noPermission'));
        navigate(-1);
        return;
      }

      try {
        setLoading(true);
        const data = await OfferService.getOfferById(id, userRole as 'seller' | 'agent');
        setOffer(data);
      } catch (error: any) {
        toast.error(error?.message || t('detail.errors.loadFailed'));
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (!state.loading) {
      loadOffer();
    }
  }, [id, state.user, state.loading, navigate]);

  const formatCurrency = (amount: number, currency: string = 'VND') => {
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return t('detail.deadline.noDeadline');
    const date = new Date(dateString);
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const datePart = date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timePart = date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return { date: datePart, time: timePart };
  };


  const getStatusLabel = (status: string): string => {
    const statusKey = `detail.status.${status}`;
    try {
      const translated = t(statusKey as any);
      return translated || status;
    } catch {
      return status;
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!offer) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>{t('detail.errors.notFound')}</Typography>
      </Container>
    );
  }

  const buyer = typeof offer.buyer_id === 'object' ? offer.buyer_id : null;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        {t('detail.back')}
      </Button>

      <Paper elevation={3} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="white">
            {t('detail.title')}
          </Typography>
          <Chip
            label={getStatusLabel(offer.status)}
            sx={{
              bgcolor: 'warning.main',
              color: 'white',
              fontWeight: 'bold',
            }}
            size="medium"
          />
        </Box>

        <Box sx={{ p: 4 }}>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              {t('detail.buyerInfo.title')}
            </Typography>
          </Box>
          {buyer ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'background.paper',
              }}
            >
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                {buyer.fullName?.charAt(0) || 'B'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {buyer.fullName || t('detail.buyerInfo.noName')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'vi' ? 'Email' : 'Email'}: {buyer.email || t('detail.buyerInfo.noEmail')}
                </Typography>
                {buyer.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {t('detail.buyerInfo.phone')}: {buyer.phone}
                  </Typography>
                )}
              </Box>
            </Paper>
          ) : (
            <Typography color="text.secondary">{t('detail.buyerInfo.noBuyerInfo')}</Typography>
          )}
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              {t('detail.amount.title')}
            </Typography>
          </Box>
          <Paper
            sx={{
              bgcolor: '#FFF9E6',
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#B8860B',
                fontWeight: 'bold',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              {formatCurrency(offer.amount, offer.currency || 'VND')}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              {t('detail.deadline.title')}
            </Typography>
          </Box>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            {offer.expires_at ? (
              <>
                <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                  {formatDateForDisplay(offer.expires_at).date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {i18n.language === 'vi' 
                    ? `Hạn chót lúc ${formatDateForDisplay(offer.expires_at).time}`
                    : `Deadline at ${formatDateForDisplay(offer.expires_at).time}`
                  }
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                {t('detail.deadline.noDeadline')}
              </Typography>
            )}
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <NoteIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              {t('detail.note.title')}
            </Typography>
          </Box>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              bgcolor: 'grey.50',
              minHeight: '100px',
              borderRadius: 2,
            }}
          >
            <Typography variant="body1" whiteSpace="pre-wrap">
              {offer.note || t('detail.note.noNote')}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {t('detail.additional.createdAt')}: {formatDate(offer.createdAt)}
          </Typography>
          {offer.updatedAt && offer.updatedAt !== offer.createdAt && (
            <Typography variant="body2" color="text.secondary">
              {t('detail.additional.updatedAt')}: {formatDate(offer.updatedAt)}
            </Typography>
          )}
        </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OfferDetailPage;

