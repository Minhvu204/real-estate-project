import React, { useState, useEffect } from 'react';
import type { User, UpdateProfileDto } from '../../types/User';
import { validatePhone } from '../../utils/validation.js';
import { Box, TextField, Button, Avatar, IconButton, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PersonIcon from '@mui/icons-material/Person';

interface PersonalInfoFormProps {
  user: User;
  onSubmit: (data: UpdateProfileDto) => Promise<void>;
  isLoading?: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<UpdateProfileDto>({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    role: user.role || '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'phone' && value && !validatePhone(value)) {
      setErrors(prev => ({ ...prev, phone: 'Số điện thoại không hợp lệ' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      
      // Cleanup old preview URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new preview URL
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) return;

    const updateData: UpdateProfileDto = { ...formData };
    if (avatar) {
      updateData.avatar = avatar;
    }
    console.log('Submitting data:', updateData);
    await onSubmit(updateData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Personal information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
            <Avatar
              src={previewUrl || user.avatar}
              sx={{ 
                width: 100, 
                height: 100,
                backgroundColor: '#bdbdbd',
                color: '#ffffff',
                '&:hover': { 
                  opacity: 0.8,
                  transition: 'opacity 0.3s'
                }
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
          </label>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  size="small"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              </label>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Upload photo
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Profile pictures help people recognize you more easily
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, maxWidth: 1000 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Full name *</Typography>
          <TextField
            fullWidth
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Email</Typography>
          <TextField
            fullWidth
            name="email"
            value={formData.email}
            disabled
            placeholder="Enter email"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Phone number</Typography>
          <TextField
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            placeholder="Enter phone number"
            size="small"
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Role</Typography>
          <TextField
            fullWidth
            name="role"
            value={formData.role}
            disabled
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