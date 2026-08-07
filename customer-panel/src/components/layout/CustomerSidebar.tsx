import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Chip,
} from '@mui/material';
import {
  LayoutDashboard,
  User,
  Package,
  FileText,
  MapPin,
  Heart,
  Bell,
  Download,
  KeyRound,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { baseApi } from '../../api/baseApi';
import { UserAvatar } from '../common/UserAvatar';
import { useCustomTheme } from '../../context/ThemeContext';
import { useGetCustomerProfileQuery } from '../../api/customerPortalApi';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const CustomerSidebar: React.FC = () => {
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { data: profileData } = useGetCustomerProfileQuery();

  const rawAvatar = profileData?.data?.avatarUrl || profileData?.data?.profileImage || user?.avatarUrl || user?.profileImage;
  const avatarImage = rawAvatar && rawAvatar !== 'null' && rawAvatar !== 'undefined' ? rawAvatar : undefined;
  const firstName = profileData?.data?.firstName || user?.firstName || 'Abhay';
  const lastName = profileData?.data?.lastName || user?.lastName || 'Ram';
  const email = profileData?.data?.email || user?.email || 'maddipativikas130@gmail.com';

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const navItems: SidebarItem[] = [
    { label: 'Dashboard', path: '/account', icon: <LayoutDashboard size={20} /> },
    { label: 'My Profile', path: '/account/profile', icon: <User size={20} /> },
    { label: 'My Orders', path: '/account/orders', icon: <Package size={20} /> },
    { label: 'Saved Addresses', path: '/account/addresses', icon: <MapPin size={20} /> },
    { label: 'Wishlist', path: '/account/wishlist', icon: <Heart size={20} />, badge: wishlistItems.length },
    { label: 'Support Center', path: '/account/support', icon: <HelpCircle size={20} /> },
    { label: 'Notifications', path: '/account/notifications', icon: <Bell size={20} /> },
    { label: 'Download Invoices', path: '/account/invoices', icon: <Download size={20} /> },
    { label: 'Change Password', path: '/account/change-password', icon: <KeyRound size={20} /> },
    { label: 'Privacy & Security', path: '/account/privacy', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <Paper sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
      {/* Customer Brief Header */}
      <Box sx={{ p: 3, bgcolor: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 2 }}>
        <UserAvatar
          src={avatarImage}
          firstName={firstName}
          lastName={lastName}
          size={52}
          border="2px solid #38BDF8"
        />
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: '#94A3B8', display: 'block' }}>
            {email}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation List */}
      <List sx={{ p: 1.5 }}>
        {navItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isSelected ? '#2563EB' : '#475569',
                bgcolor: isSelected ? '#EFF6FF' : 'transparent',
                '&:hover': {
                  bgcolor: isSelected ? '#DBEAFE' : '#F8FAFC',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isSelected ? '#2563EB' : '#64748B' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 800 : 600 }}>
                    {item.label}
                  </Typography>
                }
              />
              {item.badge !== undefined && Number(item.badge) > 0 && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="error"
                  sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800 }}
                />
              )}
            </ListItemButton>
          );
        })}

        <Divider sx={{ my: 1 }} />

        <ListItemButton
          onClick={toggleTheme}
          sx={{
            borderRadius: 2,
            mb: 0.5,
            color: mode === 'dark' ? '#F59E0B' : '#475569',
            '&:hover': { bgcolor: mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#F1F5F9' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: mode === 'dark' ? '#F59E0B' : '#64748B' }}>
            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            }
          />
          <Chip
            label={mode.toUpperCase()}
            size="small"
            color={mode === 'dark' ? 'warning' : 'default'}
            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
          />
        </ListItemButton>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: '#DC2626',
            '&:hover': { bgcolor: '#FEF2F2' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#DC2626' }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 700 }}>Logout</Typography>} />
        </ListItemButton>
      </List>
    </Paper>
  );
};
