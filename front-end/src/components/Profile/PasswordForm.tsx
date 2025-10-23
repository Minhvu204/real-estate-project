import React, { useState } from 'react';
import type { ChangePasswordDto } from '../../types/User';
import { validatePassword } from '../../utils/validation.js';
import { Box, TextField, Button, Typography } from '@mui/material';

interface PasswordFormProps {
  onSubmit: (data: ChangePasswordDto) => Promise<void>;
  isLoading?: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: '',
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
        setErrors(prev => ({ ...prev, confirmPassword: 'Confirmation password does not match' }));
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Current password</Typography>
          <TextField
            fullWidth
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
            placeholder="Enter password"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>New password</Typography>
          <TextField
            fullWidth
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            required
            placeholder="Enter new password"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Confirm password</Typography>
          <TextField
            fullWidth
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            placeholder="Confirm new password"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ 
              textTransform: 'none',
              px: 4,
              bgcolor: '#1f61cc',
              '&:hover': {
                bgcolor: '#4B5563'
              }
            }}
          >
            💾 {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};