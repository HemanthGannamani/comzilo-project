import React from 'react';
import { Container, Paper, Typography, Box, Button, Divider, Grid, Chip } from '@mui/material';
import { CheckCircle2, Truck, Package, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export const PublicOrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const activeOrderNum = orderNumber || 'ORD-2026-16450';

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button component={Link} to="/dashboard" startIcon={<ArrowLeft size={16} />} sx={{ mb: 3, fontWeight: 700 }}>
        Back to Portal
      </Button>

      <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
              REAL-TIME SHIPMENT DELIVERY TRACKING
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', mt: 0.5, fontFamily: 'monospace' }}>
              {activeOrderNum}
            </Typography>
          </Box>
          <Chip label="IN TRANSIT" color="primary" sx={{ fontWeight: 900, px: 1, py: 2, fontSize: '0.85rem' }} />
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* SHIPMENT TIMELINE & MAP STATUS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Truck size={20} color="#2563EB" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>CARRIER & EXPRESS</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>FedEx Express Air</Typography>
              <Typography variant="caption" color="text.secondary">Tracking ID: FDX-991827461</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MapPin size={20} color="#10B981" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>CURRENT LOCATION</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>Regional Distribution Center</Typography>
              <Typography variant="caption" color="text.secondary">Out for Last-Mile Delivery</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Clock size={20} color="#F59E0B" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>ESTIMATED DELIVERY</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>Today by 6:00 PM</Typography>
              <Typography variant="caption" color="text.secondary">On Schedule</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* PROGRESS TIMELINE */}
        <Box sx={{ p: 3, bgcolor: '#F1F5F9', borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Live Order Milestones</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle2 size={24} color="#10B981" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Order Confirmed & Payment Received</Typography>
                <Typography variant="caption" color="text.secondary">Merchant processed order #{activeOrderNum}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircle2 size={24} color="#10B981" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Package Packed & Shipping Label Created</Typography>
                <Typography variant="caption" color="text.secondary">Dispatched from Warehouse Hub #04</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Truck size={24} color="#2563EB" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2563EB' }}>In Transit & Out for Delivery</Typography>
                <Typography variant="caption" color="text.secondary">Driver assigned - En route to customer delivery location</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, opacity: 0.5 }}>
              <Package size={24} color="#64748B" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Delivered & Signed</Typography>
                <Typography variant="caption" color="text.secondary">Pending final handover</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need help with your delivery? Contact Comzilo 24/7 Merchant Support.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
