import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  Building2,
  Store,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { useGetAdminDashboardMetricsQuery } from '../../api/adminApi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#F59E0B', '#10B981', '#EF4444'];

export const AdminDashboardPage: React.FC = () => {
  const { data: metricsData, isLoading: loadingMetrics } = useGetAdminDashboardMetricsQuery();

  if (loadingMetrics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  const metrics = metricsData?.data;
  const summary = metrics?.summary || {
    sellers: { total: 0, today: 0 },
    activeSellers: { total: 0, today: 0 },
    suspendedSellers: { total: 0, today: 0 },
    pendingApplications: { total: 0, today: 0 },
    approvedApplications: { total: 0, today: 0 },
    rejectedApplications: { total: 0, today: 0 },
    tenants: { total: 0, today: 0 },
    stores: { total: 0, today: 0 },
  };

  const growthData = metrics?.growth || [];
  const tenantsList = metrics?.tenants || [];
  const storesList = metrics?.stores || [];
  const activities = metrics?.activities || [];

  const pieData = [
    { name: 'Pending', value: summary.pendingApplications.total },
    { name: 'Approved', value: summary.approvedApplications.total },
    { name: 'Rejected', value: summary.rejectedApplications.total },
  ];

  return (
    <PageContainer
      title="SaaS Control Center"
      subtitle="Real-time control center for Super Admin to review sellers lifecycle, applications growth, system health, and activities"
    >
      {/* Metric Summary Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #2563EB' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL SELLERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {summary.sellers.total}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  +{summary.sellers.today} today
                </Typography>
              </Box>
              <Users size={32} color="#2563EB" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #10B981' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  ACTIVE SELLERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {summary.activeSellers.total}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  +{summary.activeSellers.today} today
                </Typography>
              </Box>
              <CheckCircle size={32} color="#10B981" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #EF4444' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  SUSPENDED SELLERS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {summary.suspendedSellers.total}
                </Typography>
                <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                  +{summary.suspendedSellers.today} today
                </Typography>
              </Box>
              <AlertTriangle size={32} color="#EF4444" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #F59E0B' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  PENDING APPS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {summary.pendingApplications.total}
                </Typography>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                  +{summary.pendingApplications.today} today
                </Typography>
              </Box>
              <FileText size={32} color="#F59E0B" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #8B5CF6' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL TENANTS
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {summary.tenants.total}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  +{summary.tenants.today} today
                </Typography>
              </Box>
              <Building2 size={32} color="#8B5CF6" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #EC4899' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL STORES
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {summary.stores.total}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                  +{summary.stores.today} today
                </Typography>
              </Box>
              <Store size={32} color="#EC4899" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Growth Bar Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Monthly Seller Registration Growth
            </Typography>
            <Box sx={{ height: 320, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Status Distribution Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Application Analytics
            </Typography>
            <Box sx={{ height: 260, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 'auto' }}>
              {pieData.map((entry, index) => (
                <Box key={entry.name} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 700 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index] }} />
                    {entry.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{entry.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Rankings List & Audit Feed */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {/* Top Tenants Card */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Top 10 Tenants</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Tenant Organization</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Sellers</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Stores</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenantsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">No tenants found.</TableCell>
                    </TableRow>
                  ) : (
                    tenantsList.map((t: any) => (
                      <TableRow key={t.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{t.sellerCount}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{t.storeCount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Top Stores Card */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Top Active Stores</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Store Outlet</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Seller Accounts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {storesList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">No stores found.</TableCell>
                    </TableRow>
                  ) : (
                    storesList.map((s: any) => (
                      <TableRow key={s.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{s.sellerCount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Audit Activities Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Recent Activities</Typography>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', maxH: 480 }}>
              {activities.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                  No activities recorded yet.
                </Typography>
              ) : (
                activities.map((act: any, idx: number) => (
                  <Box key={idx} sx={{ py: 1.5, borderBottom: idx < activities.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                          {act.action.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Entity ID: {act.entityId} ({act.entityType})
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(act.createdAt).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
