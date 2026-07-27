import React from 'react';
import { Container, Paper, Typography, Box, Button, Divider, Grid } from '@mui/material';
import { CheckCircle, Package, ArrowRight, Download, Truck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
      <Paper sx={{ p: 6, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#ECFDF5', borderRadius: '50%', mb: 3 }}>
          <CheckCircle size={56} color="#10B981" />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Order Confirmed & Placed!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
          Thank you for your purchase. We have received your order and sent a confirmation invoice to your registered email address.
        </Typography>

        <Paper sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 3, mb: 4, display: 'inline-block', minWidth: 320, border: '1px dashed #CBD5E1' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
            OFFICIAL TRACKING ORDER NUMBER
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5, fontFamily: 'monospace' }}>
            {orderNumber}
          </Typography>
        </Paper>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PAYMENT STATUS</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#10B981' }}>CONFIRMED</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ESTIMATED DELIVERY</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>3-5 Business Days</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} to="/account/orders" variant="outlined" size="large" startIcon={<Package size={18} />} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Track Package & Details
          </Button>

          <Button component={Link} to="/account/invoices" variant="outlined" size="large" startIcon={<Download size={18} />} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Download Tax Invoice
          </Button>

          <Button component={Link} to="/products" variant="contained" size="large" endIcon={<ArrowRight size={18} />} sx={{ borderRadius: 2, fontWeight: 800 }}>
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
