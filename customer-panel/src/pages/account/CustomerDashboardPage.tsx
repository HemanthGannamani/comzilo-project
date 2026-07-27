import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Skeleton,
  Divider,
} from '@mui/material';
import { Package, Clock, CheckCircle2, Heart, MapPin, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useGetCustomerDashboardQuery } from '../../api/customerPortalApi';
import { useAppSelector } from '../../store/hooks';

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { data: dashData, isLoading, refetch } = useGetCustomerDashboardQuery();

  const metrics = dashData?.data?.metrics || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    savedAddressesCount: 0,
  };

  const customer = dashData?.data?.customer || user;
  const recentOrders = dashData?.data?.recentOrders || [];

  return (
    <CustomerAccountLayout>
      {/* 1. Welcome Card Banner */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#2563EB',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  border: '3px solid #38BDF8',
                }}
              >
                {customer?.firstName?.[0] || 'C'}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Hello, {customer?.firstName || 'Valued Customer'}!
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Manage your personal profile, live orders, addresses, and wishlist.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/account/profile')}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 2. Key Metrics Summary Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #2563EB' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOTAL ORDERS
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {metrics.totalOrders}
                  </Typography>
                )}
              </Box>
              <Package size={28} color="#2563EB" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #F59E0B' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  PENDING ORDERS
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {metrics.pendingOrders}
                  </Typography>
                )}
              </Box>
              <Clock size={28} color="#F59E0B" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #10B981' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  COMPLETED
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {metrics.completedOrders}
                  </Typography>
                )}
              </Box>
              <CheckCircle2 size={28} color="#10B981" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #EC4899' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  SAVED WISHLIST
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                  {wishlistItems.length}
                </Typography>
              </Box>
              <Heart size={28} color="#EC4899" />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 3. Recent Orders Overview */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Recent Orders
          </Typography>
          <Button component={Link} to="/account/orders" endIcon={<ArrowRight size={16} />} sx={{ fontWeight: 700 }}>
            View All
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ py: 3 }}>
            <Skeleton height={50} sx={{ mb: 1 }} />
            <Skeleton height={50} />
          </Box>
        ) : recentOrders.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No recent orders found. Start shopping from our product catalog!
          </Typography>
        ) : (
          <List disablePadding>
            {recentOrders.map((ord: any, idx: number) => (
              <React.Fragment key={ord.id}>
                {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                <ListItem sx={{ px: 0, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2 }}>
                    <Package size={22} color="#2563EB" />
                  </Box>
                  <ListItemText
                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Order #{ord.orderNumber}</Typography>}
                    secondary={`Placed on ${new Date(ord.createdAt).toLocaleDateString()} • Total: $${ord.totalAmount}`}
                  />
                  <Chip
                    label={ord.status.toUpperCase()}
                    color={ord.status === 'completed' || ord.status === 'delivered' ? 'success' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Eye size={14} />}
                    onClick={() => navigate(`/account/orders?id=${ord.id}`)}
                    sx={{ borderRadius: 2 }}
                  >
                    Details
                  </Button>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* 4. Quick Actions Bar */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
          Quick Account Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<MapPin size={18} />}
              onClick={() => navigate('/account/addresses')}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              Manage Saved Addresses
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Heart size={18} />}
              onClick={() => navigate('/account/wishlist')}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              View Wishlist ({wishlistItems.length})
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<RefreshCw size={18} />}
              onClick={() => refetch()}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
            >
              Sync Profile Data
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </CustomerAccountLayout>
  );
};
