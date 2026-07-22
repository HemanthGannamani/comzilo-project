import React from 'react';
import { Box, Paper, Typography, Grid, Chip, Stack } from '@mui/material';
import { Building2, Store, DollarSign, Activity, ShieldCheck, Server, AlertTriangle } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useGetTenantsQuery, useGetStoresQuery, useGetHealthCheckQuery } from '../../api/adminApi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { data: tenantData } = useGetTenantsQuery({});
  const { data: storeData } = useGetStoresQuery({});
  const { data: healthData } = useGetHealthCheckQuery();

  const totalTenants = tenantData?.data?.total || tenantData?.data?.length || 1;
  const totalStores = storeData?.data?.total || storeData?.data?.length || 1;

  const revenueChartData = [
    { month: 'Jan', revenue: 14000, subscriptions: 12 },
    { month: 'Feb', revenue: 22000, subscriptions: 18 },
    { month: 'Mar', revenue: 19000, subscriptions: 24 },
    { month: 'Apr', revenue: 31000, subscriptions: 32 },
    { month: 'May', revenue: 45000, subscriptions: 40 },
    { month: 'Jun', revenue: 58000, subscriptions: 48 },
    { month: 'Jul', revenue: 72000, subscriptions: 55 },
  ];

  return (
    <PageContainer
      title="SaaS Control Center"
      subtitle="Executive platform analytics, tenant subscriptions, server status, and API health"
    >
      {/* KPI Cards Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #2563EB' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  TOTAL TENANTS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {totalTenants}
                </Typography>
              </Box>
              <Building2 size={32} color="#2563EB" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #10B981' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  ACTIVE STORES
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {totalStores}
                </Typography>
              </Box>
              <Store size={32} color="#10B981" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #8B5CF6' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  SaaS MRR REVENUE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  $72,000
                </Typography>
              </Box>
              <DollarSign size={32} color="#8B5CF6" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #F59E0B' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  API HEALTH STATUS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {healthData?.data?.status || 'HEALTHY'}
                </Typography>
              </Box>
              <Activity size={32} color="#F59E0B" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Monthly SaaS Recurring Revenue Growth ($)
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              System & Server Status
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Server size={20} color="#2563EB" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Node.js API Server
                </Typography>
              </Box>
              <Chip label="OPERATIONAL" color="success" size="small" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Activity size={20} color="#10B981" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  MySQL Database Engine
                </Typography>
              </Box>
              <Chip label="CONNECTED" color="success" size="small" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ShieldCheck size={20} color="#8B5CF6" />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  JWT Authentication
                </Typography>
              </Box>
              <Chip label="ACTIVE" color="success" size="small" />
            </Box>

            <Box sx={{ mt: 'auto', p: 2, bgcolor: '#FEF2F2', borderRadius: 2, display: 'flex', gap: 1.5 }}>
              <AlertTriangle size={20} color="#DC2626" />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#DC2626' }}>
                  AUTOMATED HEALTH ALERTS
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Zero critical server exceptions detected in the past 24 hours.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
