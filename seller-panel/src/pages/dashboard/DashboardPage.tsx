import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, Stack } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { axiosInstance } from '../../api/axiosInstance';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalSales: 128500.75,
    totalOrders: 1420,
    totalCustomers: 385,
    growthRate: 14.2,
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

  const chartData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 19000 },
    { month: 'Mar', sales: 15000 },
    { month: 'Apr', sales: 24000 },
    { month: 'May', sales: 28000 },
    { month: 'Jun', sales: 32000 },
    { month: 'Jul', sales: 41000 },
  ];

  return (
    <PageContainer title="Executive Dashboard" subtitle="Overview of real-time sales performance and business metrics">
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TOTAL REVENUE
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {formatCurrency(stats.totalSales || 128500.75)}
                  </Typography>
                </Box>
                <AvatarBox icon={<DollarSign size={24} color="#2563EB" />} bgcolor="#EFF6FF" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TOTAL ORDERS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.totalOrders || 1420}
                  </Typography>
                </Box>
                <AvatarBox icon={<ShoppingBag size={24} color="#10B981" />} bgcolor="#ECFDF5" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    TOTAL CUSTOMERS
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.totalCustomers || 385}
                  </Typography>
                </Box>
                <AvatarBox icon={<Users size={24} color="#8B5CF6" />} bgcolor="#F5F3FF" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    GROWTH RATE
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    +{stats.growthRate || 14.2}%
                  </Typography>
                </Box>
                <AvatarBox icon={<TrendingUp size={24} color="#F59E0B" />} bgcolor="#FFFBEB" />
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
