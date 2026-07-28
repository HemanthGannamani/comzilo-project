import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Paper, Stack, CircularProgress } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { axiosInstance } from '../../api/axiosInstance';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/reports/dashboard');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch {
        // Handle error gracefully without fake data
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalSales = Number(stats?.totalSales ?? stats?.totalRevenue ?? 0);
  const totalOrders = Number(stats?.totalOrders ?? 0);
  const totalCustomers = Number(stats?.totalCustomers ?? 0);
  const growthRate = Number(stats?.growthRate ?? 0);

  const chartData = stats?.chartData || [
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 0 },
    { month: 'Mar', sales: 0 },
  ];

  return (
    <PageContainer title="Executive Dashboard" subtitle="Overview of real-time sales performance and business metrics">
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                        {formatCurrency(totalSales)}
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
                        {totalOrders}
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
                        {totalCustomers}
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
                        +{growthRate}%
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
        </>
      )}
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
