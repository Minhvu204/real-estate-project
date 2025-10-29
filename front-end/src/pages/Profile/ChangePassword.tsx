import React, { useState } from 'react';
import type { ChangePasswordDto } from '../../types/User';
import { UserService } from '../../services/user.service';
import { PasswordForm } from '../../components/Profile/PasswordForm';
import { toast } from 'react-toastify';
import { Box, Typography } from '@mui/material';

export const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (data: ChangePasswordDto) => {
    setIsLoading(true);
    try {
      await UserService.changePassword(data);
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Unable to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Change password
      </Typography>
      <PasswordForm
        onSubmit={handleChangePassword}
        isLoading={isLoading}
      />
    </Box>
  );
};