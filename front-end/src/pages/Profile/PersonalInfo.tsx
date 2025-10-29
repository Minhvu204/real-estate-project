import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { User, UpdateProfileDto } from '../../types/User';
import { UserService } from '../../services/user.service';
import { PersonalInfoForm } from '../../components/Profile/PersonalInfoForm';
import { toast } from 'react-toastify';

interface ProfileContext {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const PersonalInfo: React.FC = () => {
  const { user, setUser } = useOutletContext<ProfileContext>();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async (data: UpdateProfileDto) => {
    setIsLoading(true);
    try {
      console.log('Sending update data:', data);
      const updatedUser = await UserService.updateProfile(data);
      console.log('Received updated user:', updatedUser);
      setUser(updatedUser); 
      toast.success('Information updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Unable to update information');
    }
    setIsLoading(false);
  };

  return (
    <PersonalInfoForm
      user={user}
      onSubmit={handleUpdateProfile}
      isLoading={isLoading}
    />
  );
};