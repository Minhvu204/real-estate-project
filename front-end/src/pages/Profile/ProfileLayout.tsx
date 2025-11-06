import React, { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Box, Container, Tabs, Tab, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { UserService } from '../../services/user.service';
import type { User } from '../../types/User';
import { getLanguage, type Lang } from '../../utils/storage';

export const ProfileLayout: React.FC = () => {
  const [value, setValue] = React.useState(
    window.location.pathname.includes('change-password') ? 1 : 0
  );
  const [user, setUser] = useState<User | null>(null);
  const [currentLang, setCurrentLang] = useState<Lang>(getLanguage());

  const t = (vi: string, en: string) => (currentLang === 'vi' ? vi : en);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentLang(getLanguage()), 100);
    return () => clearInterval(interval);
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
    return <Box>{t('Đang tải...', 'Loading...')}</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
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
      <Box sx={{ flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
        <ProfileSidebar user={user} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {t('Quản lý tài khoản', 'Account Management')}
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
              <Tab 
                label={t('Cập nhật thông tin', 'Update information')} 
                component={NavLink}
                to="/profile/info"
                sx={{ textTransform: 'none', fontSize: { xs: '0.95rem', md: '1rem' } }}
              />
              <Tab 
                label={t('Thiết lập tài khoản', 'Account settings')} 
                component={NavLink}
                to="/profile/change-password"
                sx={{ textTransform: 'none', fontSize: { xs: '0.95rem', md: '1rem' } }}
              />
            </Tabs>
          </Box>

          <Outlet context={{ user, setUser }} />
        </Container>
      </Box>
    </Box>
  );
};