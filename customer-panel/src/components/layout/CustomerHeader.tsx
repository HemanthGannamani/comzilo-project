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
} from '@mui/material';
import { ShoppingBag, Search, Heart, ShoppingCart, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';

export const CustomerHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

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

            <IconButton component={Link} to="/account/wishlist" color="inherit">
              <Badge badgeContent={wishlistItems.length} color="error">
                <Heart size={22} />
              </Badge>
            </IconButton>

            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={totalCartCount} color="primary">
                <ShoppingCart size={22} />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
                  <User size={22} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <MenuItem component={Link} to="/account" onClick={() => setAnchorEl(null)}>
                    My Dashboard
                  </MenuItem>
                  <MenuItem component={Link} to="/account/orders" onClick={() => setAnchorEl(null)}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <LogOut size={16} style={{ marginRight: 8 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} to="/login" variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, ml: 1 }}>
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
