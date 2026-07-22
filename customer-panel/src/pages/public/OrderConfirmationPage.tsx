import React from 'react';
import { Container, Paper, Typography, Box, Button, Divider } from '@mui/material';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderConfirmationPage: React.FC = () => {
  const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
      <Paper sx={{ p: 6, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#ECFDF5', borderRadius: '50%', mb: 2 }}>
          <CheckCircle size={48} color="#10B981" />
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Thank You! Your Order is Confirmed
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          We have received your order and dispatched confirmation to your email.
        </Typography>

        <Paper sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 3, mb: 4, display: 'inline-block', minWidth: 320 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            TRACKING ORDER NUMBER
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5, fontFamily: 'monospace' }}>
            {orderNumber}
          </Typography>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button component={Link} to="/account/orders" variant="outlined" startIcon={<Package size={18} />}>
            View Order Status
          </Button>
          <Button component={Link} to="/products" variant="contained" endIcon={<ArrowRight size={18} />}>
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
