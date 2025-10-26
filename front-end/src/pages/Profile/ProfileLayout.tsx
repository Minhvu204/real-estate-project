import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { UserService } from '../../services/user.service';
import type { User } from '../../types/User';

export const ProfileLayout: React.FC = () => {
  const [value, setValue] = React.useState(
    window.location.pathname.includes('change-password') ? 1 : 0
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await UserService.getProfile();
      setUser(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!user) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ProfileSidebar user={user} />

      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Account Management
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab 
                label="Update information" 
                component={NavLink}
                to="/profile/info"
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              />
              <Tab 
                label="Account settings" 
                component={NavLink}
                to="/profile/change-password"
                sx={{ textTransform: 'none', fontSize: '1rem' }}
              />
            </Tabs>
          </Box>

          <Outlet context={{ user, setUser }} />
        </Container>
      </Box>
    </Box>
  );
};