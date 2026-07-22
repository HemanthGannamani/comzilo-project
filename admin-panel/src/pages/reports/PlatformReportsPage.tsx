import React from 'react';
import { Box, Paper, Typography, Grid, Stack } from '@mui/material';
import { Download, TrendingUp, DollarSign, Building2, Store } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { formatCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

export const PlatformReportsPage: React.FC = () => {
  const chartData = [
    { month: 'Jan', mrr: 28000 },
    { month: 'Feb', mrr: 35000 },
    { month: 'Mar', mrr: 42000 },
    { month: 'Apr', mrr: 51000 },
    { month: 'May', mrr: 64000 },
    { month: 'Jun', mrr: 72000 },
  ];

  const handleExportCSV = () => {
    toast.success('Platform financial & tenant report exported to CSV');
  };

  return (
    <PageContainer
      title="Platform Executive Reports"
      subtitle="Global MRR analytics, tenant subscription growth, and platform health exports"
      actionText="Export Global CSV"
      actionIcon={<Download size={18} />}
      onAction={handleExportCSV}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  TOTAL PLATFORM MRR
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {formatCurrency(72000)}
                </Typography>
              </Box>
              <DollarSign size={28} color="#2563EB" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  ACTIVE TENANTS
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  42
                </Typography>
              </Box>
              <Building2 size={28} color="#10B981" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  PROVISIONED STORES
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  128
                </Typography>
              </Box>
              <Store size={28} color="#8B5CF6" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  ANNUAL RUN RATE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {formatCurrency(864000)}
                </Typography>
              </Box>
              <TrendingUp size={28} color="#F59E0B" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Platform Monthly Recurring Revenue (MRR) Growth
        </Typography>
        <Box sx={{ height: 320, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mrr" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </PageContainer>
  );
};
