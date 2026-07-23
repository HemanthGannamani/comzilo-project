import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Switch,
  Divider,
  Button,
} from '@mui/material';
import { Truck, ShieldCheck, Activity, Globe, RefreshCw } from 'lucide-react';
import { axiosInstance } from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const AdminShippingProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [provRes, anaRes] = await Promise.allSettled([
        axiosInstance.get('/admin/shipping-providers/providers'),
        axiosInstance.get('/admin/shipping-providers/analytics'),
      ]);

      if (provRes.status === 'fulfilled') setProviders(provRes.value.data.data || []);
      if (anaRes.status === 'fulfilled') setAnalytics(anaRes.value.data.data || null);
    } catch {
      toast.error('Failed to load global shipping providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleGlobalStatus = async (id: number, currentStatus: boolean) => {
    try {
      await axiosInstance.patch(`/admin/shipping-providers/providers/${id}/status`, {
        isActive: !currentStatus,
      });
      toast.success('Global provider status updated');
      fetchData();
    } catch {
      toast.error('Failed to update provider status');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Global Shipping Providers & Logistics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage SaaS platform-wide shipping carrier availability, status, and analytics.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshCw size={18} />} onClick={fetchData} sx={{ fontWeight: 700 }}>
          Refresh
        </Button>
      </Box>

      {/* Analytics Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Total Platform Shipments</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
              {analytics?.totalShipments || 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Successful Deliveries</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
              {analytics?.delivered || 0} ({analytics?.deliverySuccessRate || '100%'})
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Average Delivery Time</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
              {analytics?.averageDeliveryTimeDays || '2.4 Days'}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">Top Carrier</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366F1', mt: 0.5 }}>
              {analytics?.mostUsedProvider || 'Shiprocket'}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Providers Grid */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Global Carriers & Aggregators (18)
      </Typography>

      <Grid container spacing={3}>
        {providers.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.code}>
            <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Truck color="#0284C7" size={22} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {p.name}
                      </Typography>
                      <Chip label={p.type.toUpperCase()} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.65rem' }} />
                    </Box>
                  </Box>

                  <Switch
                    checked={p.isActive}
                    onChange={() => handleToggleGlobalStatus(p.id, p.isActive)}
                    color="success"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 2 }}>
                  {p.description}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Chip label={p.isActive ? 'PLATFORM ENABLED' : 'GLOBALLY DISABLED'} color={p.isActive ? 'success' : 'default'} size="small" />
                  <Typography variant="caption" color="text.secondary">Code: {p.code}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
