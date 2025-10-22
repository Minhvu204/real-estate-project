import React, { useEffect, useState } from 'react';
import type { User, UpdateProfileDto } from '../../types/User';
import { UserService } from '../../services/user.service';
import { PersonalInfoForm } from '../../components/Profile/PersonalInfoForm';
import { toast } from 'react-toastify';
import { Box, CircularProgress } from '@mui/material';

export const PersonalInfo: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await UserService.getProfile();
      setUser(data);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Unable to load user information');
    }
  };

  const handleUpdateProfile = async (data: UpdateProfileDto) => {
    setIsLoading(true);
    try {
      const updatedUser = await UserService.updateProfile(data);
      setUser(updatedUser);
      toast.success('Information updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Unable to update information');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PersonalInfoForm
      user={user}
      onSubmit={handleUpdateProfile}
      isLoading={isLoading}
    />
  );
};