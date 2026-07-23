import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LayoutDashboard,
  Building2,
  Store,
  CreditCard,
  Users,
  ShieldCheck,
  BarChart3,
  Flag,
  Settings,
  Webhook,
  Activity,
  HeartPulse,
  LogOut,
  ShieldAlert,
  Bell,
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { baseApi } from '../../api/baseApi';

const DRAWER_WIDTH = 270;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const AdminLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Tenant Management', path: '/tenants', icon: <Building2 size={20} /> },
    { label: 'Seller Applications', path: '/seller-applications', icon: <Building2 size={20} /> },
    { label: 'Sellers', path: '/sellers', icon: <Users size={20} /> },
    { label: 'Store Management', path: '/stores', icon: <Store size={20} /> },
    { label: 'Subscription Plans', path: '/subscriptions', icon: <CreditCard size={20} /> },
    { label: 'Platform Users', path: '/users', icon: <Users size={20} /> },
    { label: 'Roles & Permissions', path: '/roles', icon: <ShieldCheck size={20} /> },
    { label: 'Platform Reports', path: '/reports', icon: <BarChart3 size={20} /> },
    { label: 'Feature Flags', path: '/feature-flags', icon: <Flag size={20} /> },
    { label: 'System Settings', path: '/settings', icon: <Settings size={20} /> },
    { label: 'Integrations & Webhooks', path: '/integrations', icon: <Webhook size={20} /> },
    { label: 'Audit & Activity Logs', path: '/logs', icon: <Activity size={20} /> },
    { label: 'System Health Status', path: '/health', icon: <HeartPulse size={20} /> },
    { label: 'Notification Center', path: '/notifications', icon: <Bell size={20} /> },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0F172A', color: '#F8FAFC' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#DC2626', fontWeight: 800, width: 38, height: 38 }}>SA</Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#FFFFFF' }}>
            Comzilo Admin
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            Super Admin Control Center
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#1E293B' }} />

      <List sx={{ flexGrow: 1, px: 1.5, py: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isSelected = location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isSelected ? '#FFFFFF' : '#94A3B8',
                bgcolor: isSelected ? '#2563EB' : 'transparent',
                '&:hover': {
                  bgcolor: isSelected ? '#1D4ED8' : 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isSelected ? '#FFFFFF' : '#64748B' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: isSelected ? 700 : 500 }}>
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: '#FFFFFF',
          color: '#0F172A',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: '#E2E8F0',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShieldAlert size={20} color="#DC2626" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Super Admin SaaS Portal
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Tooltip title="Super Admin Account">
              <IconButton onClick={handleUserMenuOpen} size="small">
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#DC2626', fontWeight: 700 }}>
                  {user?.firstName?.[0] || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleUserMenuClose}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {user?.firstName || 'Super'} {user?.lastName || 'Admin'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'admin@comzilo.com'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main', minWidth: 32 }}>
                  <LogOut size={18} />
                </ListItemIcon>
                Logout Session
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #1E293B' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          backgroundColor: '#F8FAFC',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
