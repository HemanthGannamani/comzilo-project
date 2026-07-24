import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, IconButton, TextField, Divider } from '@mui/material';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateQuantity, removeFromCart, applyCoupon } from '../../store/cartSlice';
import { formatPrice } from '../../utils/currencyService';
import toast from 'react-hot-toast';

export const CartPage: React.FC = () => {
  const { items, couponCode, discountAmount } = useAppSelector((state) => state.cart);
  const [couponInput, setCouponInput] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 99 || subtotal === 0 ? 0 : 15;
  const tax = subtotal * 0.08;
  const grandTotal = Math.max(0, subtotal + shipping + tax - discountAmount);

  const handleApplyCoupon = () => {
    if (couponInput.trim().toUpperCase() === 'SAVE10') {
      dispatch(applyCoupon({ code: 'SAVE10', discount: 10 }));
      toast.success('Coupon SAVE10 applied');
    } else {
      toast.error('Invalid Coupon Code. Try "SAVE10"');
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 4 }}>
          <ShoppingBag size={64} color="#94A3B8" />
          <Typography variant="h5" sx={{ fontWeight: 800, mt: 2, mb: 1 }}>
            Your Shopping Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore our tech catalog and add your favorite items to cart.
          </Typography>
          <Button component={Link} to="/products" variant="contained" size="large" sx={{ fontWeight: 700, px: 4, py: 1.5 }}>
            Browse Storefront
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        Shopping Cart ({items.length} Items)
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Item List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 3, p: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            {items.map((item, idx) => (
              <React.Fragment key={item.id}>
                {idx > 0 && <Divider sx={{ my: 2 }} />}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                    alt={item.name}
                    sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 800 }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </Box>

                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) => dispatch(updateQuantity({ id: item.id, quantity: parseInt(e.target.value) || 1 }))}
                    sx={{ width: 70 }}
                  />

                  <Typography variant="subtitle1" sx={{ fontWeight: 800, minWidth: 80, textAlign: 'right' }}>
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

        {/* Order Summary & Checkout */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Order Summary
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Shipping Fee</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Estimated Tax (8%)</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(tax)}</Typography>
            </Box>

            {discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, color: '#10B981' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Coupon Discount ({couponCode})</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>-{formatPrice(discountAmount)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Grand Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB' }}>{formatPrice(grandTotal)}</Typography>
            </Box>

            {/* Coupon Promo Input */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <TextField
                placeholder="Promo Code (SAVE10)"
                size="small"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                fullWidth
              />
              <Button variant="outlined" onClick={handleApplyCoupon} sx={{ fontWeight: 700 }}>
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
