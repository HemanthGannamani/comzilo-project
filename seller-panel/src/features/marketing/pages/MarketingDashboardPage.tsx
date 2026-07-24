/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { Send, Mail, DollarSign, Ticket, ShoppingCart, MessageSquare, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const MarketingDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get('/marketing/dashboard');
        setStats(res.data?.data || null);
      } catch {
        toast.error('Failed to load marketing dashboard stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpis = stats?.kpis || {};

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Marketing & Engagement Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track campaign performance, conversion rates, coupon redemptions, and cart recovery analytics.
        </Typography>
      </Box>

      {/* KPI GRID */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '4px solid #2563EB' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TOTAL CAMPAIGNS</Typography>
                <Send size={20} color="#2563EB" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{kpis.totalCampaigns || 0}</Typography>
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>+12% this month</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '4px solid #059669' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>EMAILS SENT</Typography>
                <Mail size={20} color="#059669" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{kpis.emailsSent || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Delivery Rate: {kpis.emailDeliveryRate || '98%'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '4px solid #7C3AED' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>REVENUE GENERATED</Typography>
                <DollarSign size={20} color="#7C3AED" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>₹{kpis.revenueGenerated?.toLocaleString() || 0}</Typography>
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>Conversion: {kpis.conversionRate || '3.2%'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '4px solid #EA580C' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ABANDONED CARTS</Typography>
                <ShoppingCart size={20} color="#EA580C" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>{kpis.abandonedCarts || 0}</Typography>
              <Typography variant="caption" color="warning.main" sx={{ fontWeight: 700 }}>Recovery Rate: {kpis.recoveryRate || '18.4%'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
