import React, { useState } from 'react';
import type { ChangePasswordDto } from '../../types/User';
import { Box, TextField, Button, Typography } from '@mui/material';
import { getLanguage, type Lang } from '../../utils/storage';

interface PasswordFormProps {
  onSubmit: (data: ChangePasswordDto) => Promise<void>;
  isLoading?: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const [currentLang, setCurrentLang] = useState<Lang>(getLanguage());
  const t = (vi: string, en: string) => (currentLang === 'vi' ? vi : en);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentLang(getLanguage()), 100);
    return () => clearInterval(interval);
  }, []);
  const [formData, setFormData] = useState<ChangePasswordDto>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'newPassword') {
      setErrors(prev => ({ ...prev, newPassword: '' }));
    }
    
    if (name === 'confirmPassword') {
      if (value !== formData.newPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: t('Mật khẩu xác nhận không khớp', 'Confirmation password does not match') }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) return;
    await onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'grid', gap: 2.5, maxWidth: 1000 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, alignItems: { md: 'center' }, gap: 2 }}>
          <Typography>{t('Mật khẩu hiện tại', 'Current password')}</Typography>
          <TextField
            fullWidth
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            placeholder={t('Nhập mật khẩu', 'Enter password')}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, alignItems: { md: 'center' }, gap: 2 }}>
          <Typography>{t('Mật khẩu mới', 'New password')}</Typography>
          <TextField
            fullWidth
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            required
            placeholder={t('Nhập mật khẩu mới', 'Enter new password')}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '200px 1fr' }, alignItems: { md: 'center' }, gap: 2 }}>
          <Typography>{t('Xác nhận mật khẩu', 'Confirm password')}</Typography>
          <TextField
            fullWidth
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            placeholder={t('Xác nhận mật khẩu mới', 'Confirm new password')}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: { xs: 'stretch', md: 'flex-end' }, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ 
              textTransform: 'none',
              px: { xs: 2.5, md: 4 },
              bgcolor: '#1f61cc',
              '&:hover': {
                bgcolor: '#4B5563'
              }
            }}
          >
            💾 {isLoading ? t('Đang lưu...', 'Saving...') : t('Lưu thay đổi', 'Save changes')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};