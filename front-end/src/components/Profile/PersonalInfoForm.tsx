import React, { useState } from 'react';
import type { User, UpdateProfileDto } from '../../types/User';
import { validatePhone } from '../../untils/validation.ts';
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
    address: user.address || '',
    province: user.province || '',
    district: user.district || '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
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
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) return;

    const updateData: UpdateProfileDto = { ...formData };
    if (avatar) {
      updateData.avatar = avatar;
    }
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
              src={user.avatar || undefined}
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
          <Typography>Province</Typography>
          <TextField
            fullWidth
            name="province"
            value={formData.province}
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            size="small"
          >
            <option value="">Select Province</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </TextField>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Ward/Commune</Typography>
          <TextField
            fullWidth
            name="district"
            value={formData.district}
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            size="small"
          >
            <option value="">Select Ward/Commune</option>
            <option value="Phường Ngũ Hành Sơn">Phường Ngũ Hành Sơn</option>
            <option value="Phường Hoà Khánh">Phường Hoà Khánh</option>
            <option value="Phường An Khê">Phường An Khê</option>
          </TextField>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: 2 }}>
          <Typography>Address</Typography>
          <TextField
            fullWidth
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="House number, street name"
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
              px: 4
            }}
          >
            💾 {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};