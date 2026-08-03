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
import { Package, Clock, CheckCircle2, Heart, MapPin, ArrowRight, Eye, RefreshCw, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useGetCustomerDashboardQuery } from '../../api/customerPortalApi';
import { formatPrice } from '../../utils/currencyService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUser } from '../../store/authSlice';

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { data: dashData, isLoading, refetch } = useGetCustomerDashboardQuery();

  const dispatch = useAppDispatch();
  const metrics = dashData?.data?.metrics || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    savedAddressesCount: 0,
  };

  const customer = dashData?.data?.customer || user;
  const recentOrders = dashData?.data?.recentOrders || [];

  React.useEffect(() => {
    if (dashData?.data?.customer) {
      const c = dashData.data.customer;
      const img = c.avatarUrl || c.profileImage || null;
      dispatch(updateUser({
        firstName: c.firstName,
        lastName: c.lastName,
        avatarUrl: img,
        profileImage: img,
      }));
    }
  }, [dashData, dispatch]);

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
                src={customer?.avatarUrl || customer?.profileImage || user?.avatarUrl || user?.profileImage || undefined}
                imgProps={{ style: { objectFit: 'cover' } }}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: '#2563EB',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  border: '3px solid #38BDF8',
                }}
              >
                {!(customer?.avatarUrl || customer?.profileImage || user?.avatarUrl || user?.profileImage) &&
                  (customer?.firstName?.[0] || user?.firstName?.[0] || customer?.fullName?.[0] || 'A').toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                  Hello, {customer?.firstName || user?.firstName || (customer?.fullName ? customer.fullName.split(' ')[0] : 'Customer')}!
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
      <Grid container spacing={2} alignItems="stretch" sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2.25, height: 110, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #2563EB', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5, display: 'block' }}>
                  TOTAL ORDERS
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1.2 }}>
                    {metrics.totalOrders}
                  </Typography>
                )}
              </Box>
              <Package size={24} color="#2563EB" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2.25, height: 110, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #F59E0B', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5, display: 'block' }}>
                  PENDING ORDERS
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1.2 }}>
                    {metrics.pendingOrders}
                  </Typography>
                )}
              </Box>
              <Clock size={24} color="#F59E0B" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2.25, height: 110, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #DC2626', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5, display: 'block' }}>
                  CANCELLED ORDERS
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1.2 }}>
                    {metrics.cancelledOrders || 0}
                  </Typography>
                )}
              </Box>
              <XCircle size={24} color="#DC2626" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2.25, height: 110, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #10B981', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5, display: 'block' }}>
                  COMPLETED ORDERS
                </Typography>
                {isLoading ? (
                  <Skeleton width={40} height={32} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1.2 }}>
                    {metrics.completedOrders}
                  </Typography>
                )}
              </Box>
              <CheckCircle2 size={24} color="#10B981" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2.25, height: 110, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderLeft: '4px solid #EC4899', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ fontWeight: 700, fontSize: '0.72rem', letterSpacing: 0.5, display: 'block' }}>
                  SAVED WISHLIST
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1.2 }}>
                  {wishlistItems.length}
                </Typography>
              </Box>
              <Heart size={24} color="#EC4899" />
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
                    secondary={`Placed on ${new Date(ord.createdAt).toLocaleDateString()} • Total: ${formatPrice(ord.totalAmount)}`}
                  />
                  <Chip
                    label={ord.status.toUpperCase()}
                    color={ord.status === 'completed' || ord.status === 'delivered' ? 'success' : 'primary'}
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Eye size={14} />}
                      onClick={() => navigate(`/account/orders?id=${ord.id}`)}
                      sx={{ borderRadius: 2 }}
                    >
                      Details
                    </Button>
                    {ord.status !== 'cancelled' && ord.status !== 'delivered' && ord.status !== 'completed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<XCircle size={14} />}
                        onClick={() => navigate(`/account/orders?id=${ord.id}`)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </Box>
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
