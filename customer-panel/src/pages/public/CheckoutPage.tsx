import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  TextField,
  Chip,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { MapPin, Truck, CreditCard, ShieldCheck, CheckCircle, Tag, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearCart, applyCoupon } from '../../store/cartSlice';
import {
  useGetMyAddressesQuery,
  useValidateCouponMutation,
  usePlaceOrderMutation,
} from '../../api/customerPortalApi';
import { formatPrice } from '../../utils/currencyService';
import toast from 'react-hot-toast';

export const CheckoutPage: React.FC = () => {
  const { items, couponCode, discountAmount } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Queries & Mutations
  const { data: addressData, isLoading: loadingAddresses } = useGetMyAddressesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();

  // State
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay' | 'stripe' | 'paypal' | 'wallet'>('cod');
  const [couponInput, setCouponInput] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const addresses = addressData?.data || [];

  // Pre-select default shipping address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultShipping = addresses.find((a: any) => a.isDefaultShipping) || addresses[0];
      setSelectedAddressId(defaultShipping.id);
    }
  }, [addresses, selectedAddressId]);

  // Total Calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let shippingFee = 15;
  if (shippingMethod === 'express') shippingFee = 25;
  if (shippingMethod === 'pickup' || subtotal > 99) shippingFee = 0;

  const tax = (subtotal - discountAmount) * 0.08;
  const grandTotal = Math.max(0, subtotal + shippingFee + tax - discountAmount);

  // Handlers
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Enter coupon code');
      return;
    }
    try {
      const res = await validateCoupon({ code: couponInput, subtotal }).unwrap();
      const disc = res.data?.discountAmount || 10;
      dispatch(applyCoupon({ code: res.data?.code || couponInput.toUpperCase(), discount: disc }));
      toast.success(`Coupon ${res.data?.code} applied! Saved ${formatPrice(disc)}`);
      setCouponInput('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Invalid coupon code');
    }
  };

  const handlePlaceOrderSubmit = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedAddressId && addresses.length > 0) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept terms & conditions');
      return;
    }

    try {
      const payload = {
        items,
        shippingAddressId: selectedAddressId,
        shippingMethod,
        couponCode,
        paymentMethod,
        notes: customerNotes,
      };

      const res = await placeOrder(payload).unwrap();
      toast.success('Order placed successfully!');
      const order = res.data?.order;
      dispatch(clearCart());
      navigate(`/order-confirmation?orderNumber=${order?.orderNumber || 'CONFIRMED'}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
            Your Cart is Empty
          </Typography>
          <Button variant="contained" onClick={() => navigate('/products')} sx={{ fontWeight: 700 }}>
            Return to Storefront
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        Enterprise Checkout & Order Placement
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side: Steps (Address, Shipping, Payment, Notes) */}
        <Grid item xs={12} md={7.5}>
          {/* STEP 1: ADDRESS SELECTION */}
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={22} color="#2563EB" /> 1. Select Delivery Address
              </Typography>
              <Button size="small" startIcon={<Plus size={16} />} onClick={() => navigate('/account/addresses')}>
                Manage Addresses
              </Button>
            </Box>

            {loadingAddresses ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : addresses.length === 0 ? (
              <Box sx={{ p: 3, bgcolor: '#FFFBEB', borderRadius: 2, border: '1px solid #FDE68A' }}>
                <Typography variant="body2" color="warning.main">
                  No saved address found. Please add a delivery address in your Account Portal or proceed with default shipping location.
                </Typography>
              </Box>
            ) : (
              <RadioGroup
                value={selectedAddressId || ''}
                onChange={(e) => setSelectedAddressId(Number(e.target.value))}
              >
                <Grid container spacing={2}>
                  {addresses.map((addr: any) => (
                    <Grid key={addr.id} item xs={12} sm={6}>
                      <Paper
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          border: selectedAddressId === addr.id ? '2px solid #2563EB' : '1px solid #E2E8F0',
                          bgcolor: selectedAddressId === addr.id ? '#EFF6FF' : '#FFFFFF',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <FormControlLabel
                          value={addr.id}
                          control={<Radio size="small" />}
                          label={
                            <Box sx={{ ml: 0.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                {addr.addressLine1}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                {addr.city}, {addr.state} {addr.postalCode}
                              </Typography>
                              {addr.isDefaultShipping && (
                                <Chip label="DEFAULT" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', mt: 0.5 }} />
                              )}
                            </Box>
                          }
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            )}
          </Paper>

          {/* STEP 2: SHIPPING METHOD */}
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Truck size={22} color="#2563EB" /> 2. Select Shipping Method
            </Typography>

            <RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value as any)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: shippingMethod === 'standard' ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
                    <FormControlLabel
                      value="standard"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Standard Delivery</Typography>
                          <Typography variant="caption" color="text.secondary">Est. 3-5 Days • $15</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: shippingMethod === 'express' ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
                    <FormControlLabel
                      value="express"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Express Courier</Typography>
                          <Typography variant="caption" color="text.secondary">Est. 24-48 Hrs • $25</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: shippingMethod === 'pickup' ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
                    <FormControlLabel
                      value="pickup"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Store Pickup</Typography>
                          <Typography variant="caption" color="text.secondary">Same Day • FREE</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
              </Grid>
            </RadioGroup>
          </Paper>

          {/* STEP 3: PAYMENT METHOD */}
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CreditCard size={22} color="#2563EB" /> 3. Select Payment Gateway
            </Typography>

            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: paymentMethod === 'cod' ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
                    <FormControlLabel
                      value="cod"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Cash on Delivery (COD)</Typography>
                          <Typography variant="caption" color="text.secondary">Pay upon package arrival</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: paymentMethod === 'razorpay' ? '2px solid #2563EB' : '1px solid #E2E8F0' }}>
                    <FormControlLabel
                      value="razorpay"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Razorpay Gateway</Typography>
                            <Chip label="ACTIVE" color="success" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">UPI, Credit/Debit Cards & NetBanking</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: paymentMethod === 'stripe' ? '2px solid #2563EB' : '1px solid #E2E8F0', opacity: 0.6 }}>
                    <FormControlLabel
                      value="stripe"
                      disabled
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Stripe Credit Card</Typography>
                            <Chip label="COMING SOON" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">International Card Gateway</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, borderRadius: 2, border: paymentMethod === 'paypal' ? '2px solid #2563EB' : '1px solid #E2E8F0', opacity: 0.6 }}>
                    <FormControlLabel
                      value="paypal"
                      disabled
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>PayPal Express</Typography>
                            <Chip label="COMING SOON" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary">PayPal Global Wallet</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
              </Grid>
            </RadioGroup>
          </Paper>

          {/* STEP 4: CUSTOMER NOTES & TERMS */}
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
              Delivery Instructions / Notes
            </Typography>
            <TextField
              multiline
              rows={2}
              fullWidth
              placeholder="e.g. Leave package at front door or call before arrival..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={<Checkbox checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} color="primary" />}
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the store terms & conditions, privacy rules, and return policies.
                </Typography>
              }
            />
          </Paper>
        </Grid>

        {/* Right Side: Order Review & Final Place Button */}
        <Grid item xs={12} md={4.5}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', position: 'sticky', top: 90 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5, color: '#0F172A' }}>
              Order Review ({items.length} Items)
            </Typography>

            {/* Items List */}
            <Box sx={{ maxHeight: 220, overflowY: 'auto', pr: 1, mb: 2 }}>
              {items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 700, maxWidth: '70%' }}>
                    {item.quantity}x {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {formatPrice(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Promo Code Entry */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
              <TextField
                placeholder="Coupon Code"
                size="small"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                fullWidth
              />
              <Button variant="outlined" disabled={isValidatingCoupon} onClick={handleApplyCoupon} sx={{ fontWeight: 700 }}>
                Apply
              </Button>
            </Box>

            {/* Price Calculations */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(subtotal)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Shipping</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Tax (8%)</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatPrice(tax)}</Typography>
            </Box>

            {discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: '#10B981' }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Discount ({couponCode})</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>-{formatPrice(discountAmount)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Grand Total</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563EB' }}>{formatPrice(grandTotal)}</Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isPlacingOrder}
              onClick={handlePlaceOrderSubmit}
              startIcon={<ShieldCheck size={20} />}
              sx={{ py: 1.8, fontWeight: 800, borderRadius: 2, fontSize: '1rem' }}
            >
              {isPlacingOrder ? 'Processing Order...' : `Place Order (${formatPrice(grandTotal)})`}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
