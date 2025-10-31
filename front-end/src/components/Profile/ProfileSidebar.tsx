import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface ProfileSidebarProps {
  user: {
    fullName: string;
    avatar?: string;
  };
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user }) => {
  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: 'rgb(234, 249, 249)',
        minHeight: '100vh',
        borderRight: '1px solid rgb(224, 224, 224)',
        py: 3,
        px: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, px: 1 }}>
        <Avatar
          src={user.avatar}
          sx={{
            width: 48,
            height: 48,
            backgroundColor: '#1967d2',
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          {user.fullName.charAt(0)}
        </Avatar>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {user.fullName}
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        <ListItem
          component={NavLink}
          to="/"
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mb: 0.5,
            color: '#5f6368',
            textDecoration: 'none',
            '&:hover': { backgroundColor: '#e8eaed' },
            '&.active': { 
              backgroundColor: '#e8f0fe', 
              color: '#1967d2',
              '& .MuiListItemIcon-root': { color: '#1967d2' }
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem
          component={NavLink}
          to="/inbox"
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mb: 0.5,
            color: '#5f6368',
            textDecoration: 'none',
            '&:hover': { backgroundColor: '#e8eaed' },
            '&.active': { 
              backgroundColor: '#e8f0fe', 
              color: '#1967d2',
              '& .MuiListItemIcon-root': { color: '#1967d2' }
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <MailIcon />
          </ListItemIcon>
          <ListItemText primary="New post" />
        </ListItem>

        <ListItem
          component={NavLink}
          to="/manage-posts"
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mb: 0.5,
            color: '#5f6368',
            textDecoration: 'none',
            '&:hover': { backgroundColor: '#e8eaed' },
            '&.active': { 
              backgroundColor: '#e8f0fe', 
              color: '#1967d2',
              '& .MuiListItemIcon-root': { color: '#1967d2' }
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText primary="Manage listings" />
        </ListItem>

        <ListItem
          component={NavLink}
          to="/notifications"
          sx={{
            py: 1.5,
            px: 2,
            borderRadius: 1,
            mb: 0.5,
            color: '#5f6368',
            textDecoration: 'none',
            '&:hover': { backgroundColor: '#e8eaed' },
            '&.active': { 
              backgroundColor: '#e8f0fe', 
              color: '#1967d2',
              '& .MuiListItemIcon-root': { color: '#1967d2' }
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notification" />
        </ListItem>
      </List>

      <Box sx={{ mt: 4, px: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Account balance
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ad account
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            0
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Promotional Account
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
