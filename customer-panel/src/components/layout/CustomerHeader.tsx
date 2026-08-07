import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Badge,
  Container,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
} from '@mui/material';
import { ShoppingBag, Search, Heart, ShoppingCart, User, LogOut, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { useCustomTheme } from '../../context/ThemeContext';
import { UserAvatar } from '../common/UserAvatar';
import { useGetCustomerProfileQuery } from '../../api/customerPortalApi';

export const CustomerHeader: React.FC = () => {
  const { mode, toggleTheme } = useCustomTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const { data: profileData } = useGetCustomerProfileQuery(undefined, { skip: !isAuthenticated });

  const displayFirstName = profileData?.data?.firstName || user?.firstName || 'Abhay';
  const displayLastName = profileData?.data?.lastName || user?.lastName || 'Ram';
  const displayEmail = profileData?.data?.email || user?.email || 'maddipativikas130@gmail.com';
  const rawAvatar = profileData?.data?.avatarUrl || profileData?.data?.profileImage || user?.avatarUrl || user?.profileImage;
  const avatarImage = rawAvatar && rawAvatar !== 'null' && rawAvatar !== 'undefined' ? rawAvatar : undefined;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setAnchorEl(null);
    navigate('/');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#FFFFFF', color: '#0F172A', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 2 }}>
          {/* Brand Logo */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: '#0F172A' }}>
            <Box sx={{ p: 1, bgcolor: '#2563EB', borderRadius: 2, display: 'flex' }}>
              <ShoppingBag size={22} color="#FFFFFF" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Comzilo<span style={{ color: '#2563EB' }}>Store</span>
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#F1F5F9',
              borderRadius: 3,
              px: 2,
              py: 0.5,
              flexGrow: 1,
              maxWidth: 500,
            }}
          >
            <InputBase
              placeholder="Search products, brands, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1, fontSize: '0.875rem' }}
            />
            <IconButton type="submit" size="small">
              <Search size={18} color="#64748B" />
            </IconButton>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton component={Link} to="/become-seller" color="inherit">
              <Typography variant="body2" sx={{ fontWeight: 600, px: 1, color: '#2563EB' }}>Become a Seller</Typography>
            </IconButton>

            <IconButton component={Link} to="/products" color="inherit">
              <Typography variant="body2" sx={{ fontWeight: 600, px: 1 }}>Shop Catalog</Typography>
            </IconButton>

            <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'light' ? <Moon size={22} /> : <Sun size={22} color="#F59E0B" />}
              </IconButton>
            </Tooltip>

            <Tooltip title="My Wishlist">
              <IconButton component={Link} to="/account/wishlist" color="inherit">
                <Badge badgeContent={wishlistItems.length} color="error">
                  <Heart size={22} />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Shopping Cart">
              <IconButton component={Link} to="/cart" color="inherit">
                <Badge badgeContent={totalCartCount} color="primary">
                  <ShoppingCart size={22} />
                </Badge>
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Tooltip title="My Account">
                  <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit" sx={{ p: 0.5 }}>
                    <UserAvatar
                      src={avatarImage}
                      firstName={displayFirstName}
                      lastName={displayLastName}
                      size={36}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{
                    sx: { borderRadius: 3, mt: 1, minWidth: 200, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {displayFirstName} {displayLastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      {displayEmail}
                    </Typography>
                  </Box>
                  <MenuItem component={Link} to="/account" onClick={() => setAnchorEl(null)} sx={{ py: 1.2, fontWeight: 600 }}>
                    My Dashboard
                  </MenuItem>
                  <MenuItem component={Link} to="/account/orders" onClick={() => setAnchorEl(null)} sx={{ py: 1.2, fontWeight: 600 }}>
                    My Orders
                  </MenuItem>
                  <MenuItem component={Link} to="/account/support" onClick={() => setAnchorEl(null)} sx={{ py: 1.2, fontWeight: 600 }}>
                    Support Center
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.2, fontWeight: 700 }}>
                    <LogOut size={16} style={{ marginRight: 8 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                startIcon={<User size={18} />}
                sx={{ borderRadius: 2, fontWeight: 700, ml: 1, textTransform: 'none' }}
              >
                My Account
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
