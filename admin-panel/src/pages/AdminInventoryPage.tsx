import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Boxes, Warehouse as WarehouseIcon, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { axiosInstance } from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const AdminInventoryPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [anaRes, whRes] = await Promise.allSettled([
        axiosInstance.get('/admin/inventory/analytics'),
        axiosInstance.get('/admin/inventory/warehouses'),
      ]);

      if (anaRes.status === 'fulfilled') setStats(anaRes.value.data.data || null);
      if (whRes.status === 'fulfilled') setWarehouses(whRes.value.data.data || []);

      if (isManualRefresh) {
        toast.success('Global inventory & warehouse analytics refreshed!');
      }
    } catch {
      toast.error('Failed to load global inventory statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Global SaaS Inventory & Warehouse Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor tenant inventory valuation, low stock monitoring, and warehouse performance.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          disabled={refreshing}
          startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshCw size={18} />}
          onClick={() => fetchData(true)}
          sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {/* Analytics Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary">Total Platform Inventory Value</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
              ₹{Number(stats?.totalInventoryValue || 0).toLocaleString('en-IN')}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary">Active Warehouses Tracked</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
              {stats?.totalWarehouses ?? warehouses.length ?? 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary">Low Stock Items</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mt: 0.5 }}>
              {stats?.lowStockItems ?? 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary">Pending Purchase Orders</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
              {stats?.pendingPurchaseOrders ?? 0}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Top Warehouses Grid */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#0F172A' }}>
        Tenant Warehouse Analytics & Storage Distribution ({warehouses.length})
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : warehouses.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No active warehouses tracked in the system.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {warehouses.map((w: any) => (
            <Grid item xs={12} sm={6} md={4} key={w.id || w.code}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', p: 2.5, boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                    {w.name}
                  </Typography>
                  {w.isDefault && <Chip label="DEFAULT" color="primary" size="small" sx={{ fontWeight: 800, fontSize: 10 }} />}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Warehouse Code: {w.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  City: {w.city || w.address || 'N/A'}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
