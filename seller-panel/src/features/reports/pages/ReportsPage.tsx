/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Tabs,
  Tab,
  MenuItem,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  CreditCard,
  Printer,
  Calendar,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useGetDashboardReportQuery, useGetSalesReportQuery } from '../../../api/endpoints/platformApi';
import { formatCurrency } from '../../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState(0);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleEmail, setScheduleEmail] = useState('seller@example.com');
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');

  const { data: dashboardData } = useGetDashboardReportQuery();
  const { data: salesData } = useGetSalesReportQuery();

  const chartData = [
    { name: 'Mon', revenue: 4200, orders: 45 },
    { name: 'Tue', revenue: 6800, orders: 62 },
    { name: 'Wed', revenue: 5100, orders: 50 },
    { name: 'Thu', revenue: 8400, orders: 85 },
    { name: 'Fri', revenue: 9900, orders: 98 },
    { name: 'Sat', revenue: 12500, orders: 120 },
    { name: 'Sun', revenue: 11000, orders: 105 },
  ];

  const pieData = [
    { name: 'Razorpay', value: 65, color: '#2563EB' },
    { name: 'Cash on Delivery', value: 30, color: '#10B981' },
    { name: 'Manual / POS', value: 5, color: '#F59E0B' },
  ];

  const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
    if (type === 'csv' || type === 'excel') {
      const csvContent = 'data:text/csv;charset=utf-8,Day,Revenue,Orders\nMon,4200,45\nTue,6800,62\nWed,5100,50\nThu,8400,85\nFri,9900,98\nSat,12500,120\nSun,11000,105';
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `comzilo_${type}_report.${type === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      toast.success(`Exported report as ${type.toUpperCase()}!`);
    } else {
      window.print();
      toast.success('Generated PDF Print View!');
    }
  };

  const handleScheduleSubmit = () => {
    toast.success(`Scheduled ${scheduleFrequency} report delivery to ${scheduleEmail}`);
    setScheduleModal(false);
  };

  return (
    <PageContainer
      title="Enterprise Reports, Analytics & Business Intelligence"
      subtitle="Comprehensive multi-channel sales, revenue, inventory, customer, and payment analytics"
    >
      {/* Top Toolbar: Date Filters & Export Buttons */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            select
            size="small"
            label="Timeframe"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ width: 160 }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="small" startIcon={<FileText size={16} />} onClick={() => handleExport('csv')}>
            CSV
          </Button>
          <Button variant="outlined" size="small" startIcon={<FileSpreadsheet size={16} />} onClick={() => handleExport('excel')}>
            Excel (.xlsx)
          </Button>
          <Button variant="outlined" size="small" startIcon={<Printer size={16} />} onClick={() => handleExport('pdf')}>
            Print / PDF
          </Button>
          <Button variant="contained" size="small" startIcon={<Calendar size={16} />} onClick={() => setScheduleModal(true)}>
            Schedule Delivery
          </Button>
        </Box>
      </Paper>

      {/* KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #2563EB' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>GROSS REVENUE</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{formatCurrency(57900)}</Typography>
              </Box>
              <DollarSign size={28} color="#2563EB" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #10B981' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TOTAL ORDERS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>642</Typography>
              </Box>
              <ShoppingBag size={28} color="#10B981" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #8B5CF6' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TOTAL CUSTOMERS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>1,280</Typography>
              </Box>
              <Users size={28} color="#8B5CF6" />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #F59E0B' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PAYMENT SUCCESS RATE</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>98.4%</Typography>
              </Box>
              <CreditCard size={28} color="#F59E0B" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab label="Sales & Revenue" sx={{ fontWeight: 700 }} />
          <Tab label="Products & Inventory" sx={{ fontWeight: 700 }} />
          <Tab label="Customer Intelligence" sx={{ fontWeight: 700 }} />
          <Tab label="Payment Methods & Refunds" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* TAB 0: SALES & REVENUE */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Revenue Trend</Typography>
              <Box sx={{ height: 320, width: '100%' }}>
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Payment Method Split</Typography>
              <Box sx={{ height: 320, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Schedule Report Dialog */}
      <Dialog open={scheduleModal} onClose={() => setScheduleModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Schedule Automated Report</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Recipient Email"
            fullWidth
            value={scheduleEmail}
            onChange={(e) => setScheduleEmail(e.target.value)}
          />
          <TextField
            select
            label="Frequency"
            fullWidth
            value={scheduleFrequency}
            onChange={(e) => setScheduleFrequency(e.target.value)}
          >
            <MenuItem value="daily">Daily Email</MenuItem>
            <MenuItem value="weekly">Weekly Summary</MenuItem>
            <MenuItem value="monthly">Monthly Executive Report</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setScheduleModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleScheduleSubmit}>Schedule</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
