import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, Stack } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, XCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { axiosInstance } from '../../api/axiosInstance';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalCustomers: 0,
    growthRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/reports/dashboard');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch {
        // Fallback default metrics
      }
    };
    fetchStats();
  }, []);

  const chartData = stats.chartData || [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 0 },
    { month: 'Mar', sales: 0 },
  ];

  return (
    <PageContainer title="Executive Dashboard" subtitle="Overview of real-time sales performance and business metrics">
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TOTAL REVENUE
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {formatCurrency(stats.totalSales || stats.totalRevenue || 0)}
                  </Typography>
                </Box>
                <AvatarBox icon={<DollarSign size={22} color="#2563EB" />} bgcolor="#EFF6FF" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TOTAL ORDERS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.totalOrders || 0}
                  </Typography>
                </Box>
                <AvatarBox icon={<ShoppingBag size={22} color="#10B981" />} bgcolor="#ECFDF5" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    PENDING ORDERS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.pendingOrders || 0}
                  </Typography>
                </Box>
                <AvatarBox icon={<Clock size={22} color="#F59E0B" />} bgcolor="#FFFBEB" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    CANCELLED ORDERS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.cancelledOrders || 0}
                  </Typography>
                </Box>
                <AvatarBox icon={<XCircle size={22} color="#DC2626" />} bgcolor="#FEF2F2" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TOTAL CUSTOMERS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.totalCustomers || 0}
                  </Typography>
                </Box>
                <AvatarBox icon={<Users size={22} color="#8B5CF6" />} bgcolor="#F5F3FF" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Card>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    GROWTH RATE
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    +{stats.growthRate || 0}%
                  </Typography>
                </Box>
                <AvatarBox icon={<TrendingUp size={22} color="#10B981" />} bgcolor="#ECFDF5" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Chart */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Revenue Trend Analysis
        </Typography>
        <Box sx={{ height: 320, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#2563EB" fill="#DBEAFE" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </PageContainer>
  );
};

const AvatarBox: React.FC<{ icon: React.ReactNode; bgcolor: string }> = ({ icon, bgcolor }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: 2,
      bgcolor,
    }}
  >
    {icon}
  </Box>
);
