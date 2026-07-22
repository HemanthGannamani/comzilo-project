import React from 'react';
import { Box, Paper, Typography, Grid, Stack } from '@mui/material';
import { Download, BarChart3, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useGetDashboardReportQuery, useGetSalesReportQuery } from '../../../api/endpoints/platformApi';
import { formatCurrency } from '../../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  useGetDashboardReportQuery();
  useGetSalesReportQuery();

  const chartData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 6800 },
    { name: 'Wed', revenue: 5100 },
    { name: 'Thu', revenue: 8400 },
    { name: 'Fri', revenue: 9900 },
    { name: 'Sat', revenue: 12500 },
    { name: 'Sun', revenue: 11000 },
  ];

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Day,Revenue\nMon,4200\nTue,6800\nWed,5100\nThu,8400\nFri,9900\nSat,12500\nSun,11000';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'comzilo_sales_report.csv');
    document.body.appendChild(link);
    link.click();
    toast.success('Sales report exported to CSV!');
  };

  return (
    <PageContainer
      title="Reporting & Business Analytics"
      subtitle="Read-only executive analytics, sales trends, and CSV data export"
      actionText="Export CSV Report"
      actionIcon={<Download size={18} />}
      onAction={handleExportCSV}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  WEEKLY REVENUE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {formatCurrency(57900)}
                </Typography>
              </Box>
              <DollarSign size={28} color="#2563EB" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  ORDERS PROCESSED
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  642
                </Typography>
              </Box>
              <ShoppingBag size={28} color="#10B981" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  AVG ORDER VALUE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {formatCurrency(90.18)}
                </Typography>
              </Box>
              <TrendingUp size={28} color="#8B5CF6" />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper sx={{ p: 2.5 }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  POS SALES RATIO
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  68.4%
                </Typography>
              </Box>
              <BarChart3 size={28} color="#F59E0B" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Daily Revenue Performance
        </Typography>
        <Box sx={{ height: 340, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </PageContainer>
  );
};
