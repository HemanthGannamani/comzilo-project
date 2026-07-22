import React from 'react';
import { Container, Grid, Paper, Typography, Box, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Package, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlist } = useAppSelector((state) => state.wishlist);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Welcome back, {user?.firstName || 'Customer'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal orders, delivery addresses, and wishlist items.
        </Typography>
      </Box>

      {/* Account Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper component={Link} to="/account/orders" sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', textDecoration: 'none', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2 }}>
              <Package size={28} color="#2563EB" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>3 Active</Typography>
              <Typography variant="body2" color="text.secondary">Orders & Shipments</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper component={Link} to="/account/wishlist" sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', textDecoration: 'none', color: '#0F172A', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#FEF2F2', borderRadius: 2 }}>
              <Heart size={28} color="#DC2626" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{wishlist.length} Items</Typography>
              <Typography variant="body2" color="text.secondary">Saved Wishlist</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#ECFDF5', borderRadius: 2 }}>
              <MapPin size={28} color="#10B981" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>2 Addresses</Typography>
              <Typography variant="body2" color="text.secondary">Saved Shipping Locations</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders Overview */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Recent Order Activity
          </Typography>
          <Button component={Link} to="/account/orders">
            View All Orders
          </Button>
        </Box>

        <List disablePadding>
          <ListItem sx={{ px: 0, py: 2, borderBottom: '1px solid #F1F5F9' }}>
            <ListItemText
              primary={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Order #ORD-849201</Typography>}
              secondary="Dispatched on July 20, 2026 • 2 Items • $389.00"
            />
            <Chip label="IN TRANSIT" color="primary" size="small" sx={{ fontWeight: 700 }} />
          </ListItem>
          <ListItem sx={{ px: 0, py: 2 }}>
            <ListItemText
              primary={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Order #ORD-739105</Typography>}
              secondary="Delivered on July 14, 2026 • 1 Item • $249.99"
            />
            <Chip label="DELIVERED" color="success" size="small" sx={{ fontWeight: 700 }} />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
};
