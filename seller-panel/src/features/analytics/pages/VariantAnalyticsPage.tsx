/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Download, TrendingUp, Package, AlertTriangle, DollarSign, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const VariantAnalyticsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [attrPerf, setAttrPerf] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [sumRes, topRes, attrRes] = await Promise.all([
        fetch('/api/v1/seller/analytics/variants/summary').then((r) => r.json()),
        fetch('/api/v1/seller/analytics/variants/top-sellers').then((r) => r.json()),
        fetch('/api/v1/seller/analytics/variants/attributes').then((r) => r.json()),
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (topRes.success) setTopSellers(topRes.data || []);
      if (attrRes.success) setAttrPerf(attrRes.data || []);
    } catch (e) {
      toast.error('Failed to load variant analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (type: string) => {
    window.open(`/api/v1/seller/analytics/variants/export?type=${type}`, '_blank');
    toast.success(`Exporting ${type} report to CSV...`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Variant Analytics & Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time performance analytics for product variants, inventory valuation, and attributes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            onClick={() => handleExportCSV('sales')}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Export Sales CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Download size={18} />}
            onClick={() => handleExportCSV('inventory')}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Export Inventory CSV
          </Button>
        </Box>
      </Box>

      {/* Summary KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Package color="#2563EB" size={24} />
                <Typography variant="subtitle2" color="text.secondary">Total Variants</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{summary?.totalVariants || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <DollarSign color="#10B981" size={24} />
                <Typography variant="subtitle2" color="text.secondary">Total Variant Revenue</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>₹{(summary?.totalRevenue || 0).toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <TrendingUp color="#8B5CF6" size={24} />
                <Typography variant="subtitle2" color="text.secondary">Available Stock</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{summary?.totalAvailableStock || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <AlertTriangle color="#EF4444" size={24} />
                <Typography variant="subtitle2" color="text.secondary">Low / Out of Stock</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={`${summary?.lowStockCount || 0} Low`} color="warning" size="small" sx={{ fontWeight: 700 }} />
                <Chip label={`${summary?.outOfStockCount || 0} Out`} color="error" size="small" sx={{ fontWeight: 700 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Top Selling Variants Table */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Top Selling Variants
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Units Sold</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#94A3B8' }}>
                        No variant sales data recorded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    topSellers.map((row) => (
                      <TableRow key={row.variantId}>
                        <TableCell><Chip label={row.variantSku || 'N/A'} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                        <TableCell>{row.productName}</TableCell>
                        <TableCell align="right">{row.quantitySold}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#2563EB' }}>₹{Number(row.totalRevenue).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Attribute Option Performance Table */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Layers color="#2563EB" size={20} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Attribute Option Performance
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Option (e.g. Size/Color)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Qty Sold</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attrPerf.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: '#94A3B8' }}>
                        No attribute performance data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    attrPerf.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell sx={{ fontWeight: 600 }}>{row.attributeOption}</TableCell>
                        <TableCell align="right">{row.totalQtySold}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: '#10B981' }}>₹{Number(row.totalRevenue).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
