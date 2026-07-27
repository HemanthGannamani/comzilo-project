import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { Package, Truck, XCircle, Search, Eye, Download } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useGetMyOrdersQuery, useGetMyOrderDetailsQuery, useCancelMyOrderMutation } from '../../api/customerPortalApi';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

export const CustomerOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdFromUrl = searchParams.get('id');

  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    selectedIdFromUrl ? Number(selectedIdFromUrl) : null
  );

  const { data: ordersData, isLoading } = useGetMyOrdersQuery({ search });
  const { data: orderDetailsData, isLoading: loadingDetails } = useGetMyOrderDetailsQuery(selectedOrderId!, {
    skip: !selectedOrderId,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelMyOrderMutation();

  const orders = ordersData?.data?.rows || ordersData?.data?.orders || [];
  const selectedOrder = orderDetailsData?.data;

  const handleCancel = async (id: number) => {
    try {
      await cancelOrder(id).unwrap();
      toast.success('Order cancelled successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel order');
    }
  };

  return (
    <CustomerAccountLayout>
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            My Orders & Tracking
          </Typography>
          <TextField
            size="small"
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748B' }} />,
            }}
            sx={{ maxWidth: 300 }}
          />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        ) : orders.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
            No orders found in your account history.
          </Typography>
        ) : (
          <List disablePadding>
            {orders.map((ord: any, idx: number) => (
              <React.Fragment key={ord.id}>
                {idx > 0 && <Divider sx={{ my: 2 }} />}
                <ListItem sx={{ px: 0, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2 }}>
                    <Package size={24} color="#2563EB" />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Order #{ord.orderNumber}
                      </Typography>
                    }
                    secondary={`Placed on ${new Date(ord.createdAt).toLocaleDateString()} • Items: ${ord.items?.length || 1}`}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB' }}>
                    ${ord.totalAmount}
                  </Typography>
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
                    onClick={() => {
                      setSelectedOrderId(ord.id);
                      setSearchParams({ id: String(ord.id) });
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    View Details
                  </Button>

                  {(ord.status === 'pending' || ord.status === 'processing' || ord.status === 'unconfirmed') && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<XCircle size={14} />}
                      onClick={() => handleCancel(ord.id)}
                      disabled={isCancelling}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* 4. ORDER DETAILS MODAL */}
      <Dialog
        open={Boolean(selectedOrderId)}
        onClose={() => {
          setSelectedOrderId(null);
          setSearchParams({});
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Order Details #{selectedOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={36} />
            </Box>
          ) : selectedOrder ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Status Header Bar */}
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    ORDER STATUS
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'capitalize' }}>
                    {selectedOrder.status}
                  </Typography>
                </Box>
                <Chip label={`Payment: ${selectedOrder.paymentStatus}`} color="success" sx={{ fontWeight: 700 }} />
              </Box>

              {/* Items List */}
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Order Items ({selectedOrder.items?.length || 0})
              </Typography>
              <List disablePadding>
                {selectedOrder.items?.map((item: any) => (
                  <ListItem key={item.id} sx={{ px: 0, py: 1, borderBottom: '1px solid #F1F5F9' }}>
                    <ListItemText
                      primary={<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{item.productName || item.sku}</Typography>}
                      secondary={`Qty: ${item.quantity} • Unit Price: $${item.unitPrice}`}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      ${item.total}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              {/* Total Calculation Grid */}
              <Box sx={{ alignSelf: 'flex-end', width: { xs: '100%', sm: 300 }, py: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>${selectedOrder.subtotal}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Tax</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>${selectedOrder.taxAmount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Shipping Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>${selectedOrder.shippingFee || 0}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Paid</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2563EB' }}>
                    ${selectedOrder.totalAmount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography color="error">Failed to load order details.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSelectedOrderId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </CustomerAccountLayout>
  );
};
