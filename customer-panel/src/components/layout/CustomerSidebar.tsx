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
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { baseApi } from '../../api/baseApi';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const CustomerSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

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
        <Avatar
          src={user?.avatarUrl || user?.profileImage || undefined}
          sx={{
            width: 52,
            height: 52,
            bgcolor: '#2563EB',
            fontSize: '1.25rem',
            fontWeight: 800,
            border: '2px solid #38BDF8',
          }}
        >
          {!(user?.avatarUrl || user?.profileImage) && (user?.firstName?.[0] || 'C')}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {user?.firstName || 'Customer'} {user?.lastName || ''}
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: '#94A3B8', display: 'block' }}>
            {user?.email || 'customer@comzilo.com'}
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
