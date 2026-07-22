import React from 'react';
import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerFooter: React.FC = () => {
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
              Help Center & FAQs
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              Order Tracking
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 1 }}>
              <Link to="/become-seller" style={{ color: '#94A3B8', textDecoration: 'none' }}>Become a Seller</Link>
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Terms of Service & Privacy
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Subscribe to Special Offers
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2 }}>
              Get weekly promotional discounts and new product release alerts directly in your inbox.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Your Email"
                size="small"
                sx={{ bgcolor: '#1E293B', borderRadius: 1, input: { color: '#FFFFFF' } }}
              />
              <Button variant="contained" color="primary" sx={{ fontWeight: 700 }}>
                Subscribe
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
