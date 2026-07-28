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
  MenuItem,
  Alert,
} from '@mui/material';
import { Package, Truck, XCircle, Search, Eye, Download, AlertTriangle } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { OrderNavigationMap } from '../../components/common/OrderNavigationMap';
import { useGetMyOrdersQuery, useGetMyOrderDetailsQuery, useCancelMyOrderMutation } from '../../api/customerPortalApi';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Found a better price elsewhere',
  'Delivery time is too long',
  'Need to change shipping address or items',
  'Duplicate order placed',
  'Payment or pricing issue',
  'Other reason',
];

export const CustomerOrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdFromUrl = searchParams.get('id');

  const [search, setSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    selectedIdFromUrl ? Number(selectedIdFromUrl) : null
  );

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);
  const [cancelNotes, setCancelNotes] = useState('');

  const { data: ordersData, isLoading, refetch } = useGetMyOrdersQuery({ search });
  const { data: orderDetailsData, isLoading: loadingDetails } = useGetMyOrderDetailsQuery(selectedOrderId!, {
    skip: !selectedOrderId,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelMyOrderMutation();

  const orders = ordersData?.data?.rows || ordersData?.data?.orders || [];
  const selectedOrder = orderDetailsData?.data;

  const handleOpenCancelDialog = (ord: any) => {
    setCancellingOrder(ord);
    setCancelReason(CANCELLATION_REASONS[0]);
    setCancelNotes('');
  };

  const handleConfirmCancellation = async () => {
    if (!cancellingOrder) return;
    try {
      await cancelOrder({
        id: cancellingOrder.id,
        reason: cancelReason,
        notes: cancelNotes,
      }).unwrap();

      toast.success(`Order #${cancellingOrder.orderNumber || cancellingOrder.id} cancelled successfully!`);
      setCancellingOrder(null);
      refetch();
      if (selectedOrderId === cancellingOrder.id) {
        setSelectedOrderId(null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel order');
    }
  };

  const isCancellable = (status: string) => {
    const s = (status || '').toLowerCase();
    return s !== 'cancelled' && s !== 'delivered' && s !== 'shipped' && s !== 'completed';
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
                  <Box sx={{ p: 1.5, bgcolor: ord.status === 'cancelled' ? '#FEF2F2' : '#EFF6FF', borderRadius: 2 }}>
                    <Package size={24} color={ord.status === 'cancelled' ? '#DC2626' : '#2563EB'} />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Order #{ord.orderNumber}
                      </Typography>
                    }
                    secondary={`Placed on ${new Date(ord.createdAt).toLocaleDateString()} • Items: ${ord.items?.length || 1}`}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: ord.status === 'cancelled' ? '#DC2626' : '#2563EB' }}>
                    ${ord.totalAmount}
                  </Typography>
                  <Chip
                    label={ord.status.toUpperCase()}
                    color={ord.status === 'completed' || ord.status === 'delivered' ? 'success' : ord.status === 'cancelled' ? 'error' : 'primary'}
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

                  {isCancellable(ord.status) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<XCircle size={14} />}
                      onClick={() => handleOpenCancelDialog(ord)}
                      disabled={isCancelling}
                      sx={{ borderRadius: 2, fontWeight: 700 }}
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

      {/* CANCEL ORDER REASON DIALOG MODAL */}
      <Dialog
        open={Boolean(cancellingOrder)}
        onClose={() => setCancellingOrder(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle color="#DC2626" size={24} />
          Cancel Order #{cancellingOrder?.orderNumber}
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Are you sure you want to cancel this order? Once confirmed, the seller will be notified and stock will be released.
          </Alert>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Why are you cancelling this order? *
          </Typography>
          <TextField
            select
            fullWidth
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            sx={{ mb: 2.5 }}
          >
            {CANCELLATION_REASONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Additional Feedback / Reason Details (Optional)
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Tell us more about why you chose to cancel..."
            value={cancelNotes}
            onChange={(e) => setCancelNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setCancellingOrder(null)} sx={{ fontWeight: 600 }}>
            Keep My Order
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancellation}
            disabled={isCancelling}
            startIcon={isCancelling ? <CircularProgress size={16} color="inherit" /> : <XCircle size={16} />}
            sx={{ fontWeight: 700 }}
          >
            Confirm Cancellation
          </Button>
        </DialogActions>
      </Dialog>

      {/* ORDER DETAILS MODAL */}
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
              <Box sx={{ p: 2, bgcolor: selectedOrder.status === 'cancelled' ? '#FEF2F2' : '#F8FAFC', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    ORDER STATUS
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, textTransform: 'capitalize', color: selectedOrder.status === 'cancelled' ? '#DC2626' : '#0F172A' }}>
                    {selectedOrder.status}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={`Payment: ${selectedOrder.paymentStatus}`} color={selectedOrder.status === 'cancelled' ? 'error' : 'success'} sx={{ fontWeight: 700 }} />
                  {isCancellable(selectedOrder.status) && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<XCircle size={14} />}
                      onClick={() => handleOpenCancelDialog(selectedOrder)}
                      sx={{ fontWeight: 700 }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Live Order Location & Navigation Map */}
              <OrderNavigationMap
                orderNumber={selectedOrder.orderNumber}
                status={selectedOrder.status}
                destinationAddress={selectedOrder.shippingAddress?.addressLine1 ? `${selectedOrder.shippingAddress.addressLine1}, ${selectedOrder.shippingAddress.city}` : 'Hyderabad, Telangana, India'}
              />

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
