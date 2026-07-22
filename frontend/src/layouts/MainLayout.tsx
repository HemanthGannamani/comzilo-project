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
  Select,
  FormControl,
  InputLabel,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LayoutDashboard,
  Building2,
  Store as StoreIcon,
  Users,
  Package,
  FolderTree,
  Tags,
  Warehouse as WarehouseIcon,
  Boxes,
  UsersRound,
  ShoppingCart,
  Receipt,
  CreditCard,
  MonitorCheck,
  BarChart3,
  Bell,
  Settings,
  Webhook,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout, setActiveStore } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import type { StoreContext } from '../types/auth.types';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

export const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user, tenant, stores, activeStoreId } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    dispatch(logout());
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Tenants', path: '/tenants', icon: <Building2 size={20} />, permission: 'tenant.read' },
    { label: 'Stores', path: '/stores', icon: <StoreIcon size={20} />, permission: 'store.read' },
    { label: 'Users & Roles', path: '/users', icon: <Users size={20} />, permission: 'user.read' },
    { label: 'Products', path: '/products', icon: <Package size={20} />, permission: 'product.read' },
    { label: 'Categories', path: '/categories', icon: <FolderTree size={20} />, permission: 'category.read' },
    { label: 'Tags & Brands', path: '/tags', icon: <Tags size={20} />, permission: 'tag.read' },
    { label: 'Warehouses', path: '/warehouses', icon: <WarehouseIcon size={20} />, permission: 'warehouse.read' },
    { label: 'Inventory', path: '/inventory', icon: <Boxes size={20} />, permission: 'inventory.read' },
    { label: 'Customers', path: '/customers', icon: <UsersRound size={20} />, permission: 'customer.read' },
    { label: 'Orders', path: '/orders', icon: <ShoppingCart size={20} />, permission: 'order.read' },
    { label: 'Invoices', path: '/invoices', icon: <Receipt size={20} />, permission: 'invoice.read' },
    { label: 'Payments', path: '/payments', icon: <CreditCard size={20} />, permission: 'payment.read' },
    { label: 'POS Terminal', path: '/pos', icon: <MonitorCheck size={20} />, permission: 'pos.access' },
    { label: 'Reports', path: '/reports', icon: <BarChart3 size={20} />, permission: 'report.read' },
    { label: 'Notifications', path: '/notifications', icon: <Bell size={20} />, permission: 'notification.read' },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} />, permission: 'settings.read' },
    { label: 'Integrations', path: '/integrations', icon: <Webhook size={20} />, permission: 'integration.read' },
  ];

  const hasPermission = (code?: string): boolean => {
    if (!code) return true;
    if (!user) return false;
    if (user.permissions?.includes('*')) return true;
    return user.permissions?.includes(code) ?? true;
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800, width: 36, height: 36 }}>C</Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            Comzilo ERP
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {tenant?.name || 'Enterprise Monolith'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1.5, py: 1 }}>
        {navItems.map((item) => {
          if (!hasPermission(item.permission)) return null;

          const isSelected = location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              selected={isSelected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: mode === 'light' ? 'primary.main' : 'primary.dark',
                  color: '#FFFFFF',
                  '& .MuiListItemIcon-root': { color: '#FFFFFF' },
                  '&:hover': {
                    bgcolor: mode === 'light' ? 'primary.dark' : 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isSelected ? '#FFFFFF' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', fontWeight: isSelected ? 600 : 500 }}>
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          {/* Store Isolation Switcher */}
          {stores.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 160, mr: 'auto' }}>
              <InputLabel id="active-store-label">Active Store</InputLabel>
              <Select
                labelId="active-store-label"
                value={activeStoreId || stores[0]?.id || ''}
                label="Active Store"
                onChange={(e) => dispatch(setActiveStore(Number(e.target.value)))}
              >
                {stores.map((s: StoreContext) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            <Tooltip title="Toggle Theme">
              <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
                {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Account Settings">
              <IconButton onClick={handleUserMenuOpen} size="small" sx={{ ml: 1 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                  {user?.firstName?.[0] || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleUserMenuClose}>
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main', minWidth: 32 }}>
                  <LogOut size={18} />
                </ListItemIcon>
                Logout
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid', borderColor: 'divider' },
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
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
