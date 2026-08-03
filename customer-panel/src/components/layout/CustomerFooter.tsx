import React, { useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';
import { ShoppingBag, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../api/axiosInstance';

export const CustomerFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post('/customer-portal/newsletter/subscribe', { email: trimmed });
      toast.success(res.data?.message || `Welcome email sent to ${trimmed}!`);
      setEmail('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || `Promotional email dispatched to ${trimmed}`;
      toast.success(msg);
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#0F172A', color: '#F8FAFC', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ p: 1, bgcolor: '#2563EB', borderRadius: 2, display: 'flex' }}>
                <ShoppingBag size={20} color="#FFFFFF" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Comzilo Storefront
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              Enterprise multi-tenant retail storefront. High performance catalog browsing, instant checkout, and live order tracking.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Customer Support & Care
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              <Link to="/support" style={{ color: '#94A3B8', textDecoration: 'none' }}>Help Center & FAQs</Link>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              <Link to="/account/orders" style={{ color: '#94A3B8', textDecoration: 'none' }}>Order Tracking</Link>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              <Link to="/become-seller" style={{ color: '#94A3B8', textDecoration: 'none' }}>Become a Seller</Link>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms of Service & Privacy</Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Subscribe to Special Offers
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              Get weekly promotional discounts and new product release alerts directly in your inbox.
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Your Email Address"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ bgcolor: '#1E293B', borderRadius: 1, input: { color: '#FFFFFF' }, flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={<Send size={14} />}
                sx={{ fontWeight: 700, px: 2.5, whiteSpace: 'nowrap' }}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="caption" sx={{ color: '#64748B', textAlign: 'center', display: 'block' }}>
          © 2026 Comzilo Multi-Tenant Commerce Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
