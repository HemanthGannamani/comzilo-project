import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus, Heart, ArrowLeft, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateQuantity, removeFromCart, applyCoupon } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { useValidateCouponMutation } from '../../api/customerPortalApi';
import { formatPrice } from '../../utils/currencyService';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const { items, couponCode, discountAmount } = useAppSelector((state) => state.cart);
  const [couponInput, setCouponInput] = useState('');
  const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const grandTotal = Math.max(0, subtotal + shipping + tax - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon promo code');
      return;
    }

    try {
      const res = await validateCoupon({ code: couponInput, subtotal }).unwrap();
      const disc = res.data?.discountAmount || 10;
      dispatch(applyCoupon({ code: res.data?.code || couponInput.toUpperCase(), discount: disc }));
      toast.success(`Coupon ${res.data?.code} applied! Saved ${formatPrice(disc)}`);
      setCouponInput('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Invalid or expired coupon code');
    }
  };

  const handleSaveForLater = (item: any) => {
    dispatch(toggleWishlist(item));
    dispatch(removeFromCart(item.id));
    toast.success(`${item.name} moved to wishlist`);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <ShoppingBag size={64} color="#94A3B8" />
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 2, mb: 1, color: '#0F172A' }}>
            Your Shopping Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore our tech catalog and add your favorite items to cart.
          </Typography>
          <Button component={Link} to="/products" variant="contained" size="large" sx={{ fontWeight: 700, px: 4, py: 1.5, borderRadius: 2 }}>
            Browse Storefront
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Shopping Cart ({items.length} Items)
        </Typography>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* 1. Cart Items Review Table */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, p: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <Divider sx={{ my: 2.5 }} />}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  <Box
                    component="img"
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={item.name}
                    sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 2, border: '1px solid #F1F5F9' }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      SKU: PROD-{String(item.id).padStart(4, '0')}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {formatPrice(item.price)}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<Heart size={14} />}
                        onClick={() => handleSaveForLater(item)}
                        sx={{ fontSize: '0.75rem', p: 0 }}
                      >
                        Save for Later
                      </Button>
                    </Box>
                  </Box>

                  {/* Quantity Controller */}
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <Typography variant="body2" sx={{ px: 1.5, fontWeight: 700 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800, minWidth: 90, textAlign: 'right', color: '#0F172A' }}>
                    {formatPrice(item.price * item.quantity)}
                  </Typography>

                  <IconButton color="error" onClick={() => dispatch(removeFromCart(item.id))}>
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </React.Fragment>
            ))}
          </Paper>
        </Grid>

        {/* 2. Order Total & Coupon Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#0F172A' }}>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Shipping Fee</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Estimated Tax (8%)</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(tax)}</Typography>
            </Box>

            {discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, color: '#10B981' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Coupon ({couponCode})</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>-{formatPrice(discountAmount)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Grand Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB' }}>{formatPrice(grandTotal)}</Typography>
            </Box>

            {/* Promo Code Entry */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                placeholder="Promo Code (SAVE10)"
                size="small"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                fullWidth
              />
              <Button variant="outlined" disabled={isValidating} onClick={handleApplyCoupon} sx={{ fontWeight: 700 }}>
                Apply
              </Button>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              endIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/checkout')}
              sx={{ py: 1.5, fontWeight: 800, borderRadius: 2 }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
