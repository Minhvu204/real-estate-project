import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import PlaceIcon from '@mui/icons-material/Place';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HomeIcon from '@mui/icons-material/Home';
import type { CreateOfferDto } from '../../types/Offer';
import type { Property } from '../../types/Property';
import { getLanguage } from '../../utils/storage';

interface OfferFormProps {
  property: Property;
  onSubmit: (data: CreateOfferDto) => Promise<void>;
  isLoading?: boolean;
}

export const OfferForm: React.FC<OfferFormProps> = ({
  property,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation('offerManagement');
  const lang = getLanguage();

  const [formData, setFormData] = useState<CreateOfferDto>({
    property_id: property._id,
    amount: 0,
    validityPeriod: '',
    note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const dateString = defaultDate.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      validityPeriod: dateString,
    }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = formData.amount <= 0
        ? t('form.priceInvalid')
        : t('form.priceRequired');
    }

    if (!formData.validityPeriod) {
      newErrors.validityPeriod = t('form.dateRequired');
    } else {
      const selectedDate = new Date(formData.validityPeriod);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(selectedDate.getTime())) {
        newErrors.validityPeriod = t('form.dateInvalid');
      } else if (selectedDate <= today) {
        newErrors.validityPeriod = t('form.datePast');
      }
    }

    if (formData.note && formData.note.length > 500) {
      newErrors.note = t('form.notesMaxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const validityPeriodISO = new Date(formData.validityPeriod).toISOString();
    
    await onSubmit({
      ...formData,
      validityPeriod: validityPeriodISO,
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = value ? parseInt(value, 10) : 0;
    
    setFormData(prev => ({
      ...prev,
      amount: numValue,
    }));

    if (errors.amount) {
      setErrors(prev => ({
        ...prev,
        amount: '',
      }));
    }
  };


  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {property.images && property.images.length > 0 && (
          <Box
            sx={{
              width: '100%',
              height: 300,
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <img
              src={property.images[0]}
              alt={typeof property.title === 'object' ? property.title[lang] : property.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          mb={2}
          sx={{ 
            color: '#1a1a1a',
            fontSize: '1.25rem',
          }}
        >
          {typeof property.title === 'object' ? property.title[lang] : property.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <PlaceIcon sx={{ color: '#667eea', fontSize: 20 }} />
          <Typography 
            sx={{ 
              color: '#666666',
              fontSize: '0.9rem',
            }}
          >
            {typeof property.address === 'object' ? property.address[lang] : property.address}
          </Typography>
        </Box>
        
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            p: 2.5,
            mb: 2,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AttachMoneyIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t('propertyInfo.listedPrice')}
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {formatCurrency(property.price)} ₫
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {property.bedrooms && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: '#F8BBD0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BedIcon sx={{ color: '#C2185B', fontSize: 20 }} />
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="medium"
                sx={{ 
                  color: '#333333',
                  fontSize: '0.875rem',
                }}
              >
                {property.bedrooms} {lang === 'vi' ? 'Phòng ngủ' : 'Bedrooms'}
              </Typography>
            </Box>
          )}
          {property.area && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: '#C8E6C9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#2E7D32', fontSize: 18, fontWeight: 'bold' }}>[]</Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="medium"
                sx={{ 
                  color: '#333333',
                  fontSize: '0.875rem',
                }}
              >
                {property.area} m²
              </Typography>
            </Box>
          )}
          {property.bathrooms && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: '#B3E5FC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BathtubIcon sx={{ color: '#0277BD', fontSize: 20 }} />
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="medium"
                sx={{ 
                  color: '#333333',
                  fontSize: '0.875rem',
                }}
              >
                {property.bathrooms} {lang === 'vi' ? 'Phòng tắm' : 'Bathrooms'}
              </Typography>
            </Box>
          )}
          {property.floors && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: '#FFE0B2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HomeIcon sx={{ color: '#E65100', fontSize: 20 }} />
              </Box>
              <Typography 
                variant="body2" 
                fontWeight="medium"
                sx={{ 
                  color: '#333333',
                  fontSize: '0.875rem',
                }}
              >
                {property.floors} {lang === 'vi' ? 'Tầng' : 'Floors'}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Alert 
        severity="warning" 
        sx={{ 
          mb: 3,
          backgroundColor: '#FFF4E6',
          border: '1px solid #FFD89B',
          '& .MuiAlert-icon': {
            color: '#FF9800',
          },
        }}
      >
        <Typography variant="body2" fontWeight="bold" mb={1}>
          {lang === 'vi' ? 'Lưu ý quan trọng:' : 'Important note:'}
        </Typography>
        <Typography variant="body2" component="div">
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <li>{t('propertyInfo.tip')}</li>
            <li>{lang === 'vi' ? 'Agent sẽ xem xét và chuyển đến chủ nhà' : 'Agent will review and forward to the owner'}</li>
            <li>{lang === 'vi' ? 'Có thể hủy offer khi đang chờ xử lý' : 'Offer can be canceled while pending'}</li>
          </Box>
        </Typography>
      </Alert>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DescriptionIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography 
            variant="h6" 
            fontWeight="bold"
            sx={{ 
              color: '#1a1a1a',
              fontSize: '1.1rem',
            }}
          >
            {t('form.title')}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                mb={1}
                sx={{ 
                  color: '#1a1a1a',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t('form.proposedPrice')}
              </Typography>
              <TextField
                name="amount"
                placeholder={lang === 'vi' ? 'Nhập giá đề xuất (VNĐ)' : 'Enter proposed price (VND)'}
                value={formData.amount || ''}
                onChange={handleAmountChange}
                error={!!errors.amount}
                helperText={errors.amount}
                required
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#E8F5E9',
                    '& fieldset': {
                      borderColor: '#C8E6C9',
                    },
                    '&:hover fieldset': {
                      borderColor: '#A5D6A7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#66BB6A',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="body2" color="text.secondary">
                        VNĐ
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    color: '#667eea',
                    fontSize: '0.875rem',
                  }}
                >
                  💎 {t('propertyInfo.listedPrice')} {formatCurrency(property.price)} ₫
                </Typography>
              </Box>
            </Box>

            {/* Validity Period */}
            <Box>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                mb={1}
                sx={{ 
                  color: '#1a1a1a',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t('form.validityPeriod')}
              </Typography>
              <TextField
                name="validityPeriod"
                type="date"
                value={formData.validityPeriod}
                onChange={handleChange}
                error={!!errors.validityPeriod}
                helperText={errors.validityPeriod || t('form.validityPeriodHelper')}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: '#999999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#1a1a1a',
                  },
                }}
              />
            </Box>

            {/* Notes */}
            <Box>
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                mb={1}
                sx={{ 
                  color: '#1a1a1a',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {t('form.notes')}
              </Typography>
              <TextField
                name="note"
                placeholder={t('form.notesPlaceholder')}
                value={formData.note}
                onChange={handleChange}
                error={!!errors.note}
                helperText={errors.note || `${formData.note?.length || 0}/500 ${t('form.characters')}`}
                multiline
                rows={4}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <DescriptionIcon sx={{ color: '#999999' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#1a1a1a',
                  },
                }}
              />
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={<SendIcon />}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                color: 'white',
                fontWeight: 600,
                textTransform: 'none',
                py: 1.5,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #e082f0 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                },
              }}
            >
              {isLoading ? t('form.sending') : (lang === 'vi' ? 'Gửi đề xuất ngay ✨✨' : 'Send proposal now ✨✨')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

