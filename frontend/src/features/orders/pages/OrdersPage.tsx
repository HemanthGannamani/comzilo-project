import React, { useState } from 'react';
import { Box, TextField, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Ban } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetOrdersQuery, useCreateOrderMutation, useCancelOrderMutation } from '../../../api/endpoints/salesApi';
import { usePermission } from '../../../hooks/usePermission';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export const OrdersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    items: [{ productId: '', quantity: 1, unitPrice: 10 }],
  });

  const canCreate = usePermission('order.create');
  const canCancel = usePermission('order.cancel');

  const { data, isLoading } = useGetOrdersQuery({ page: page + 1, limit: 10, search });
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();

  const handleCreate = async () => {
    try {
      await createOrder({
        customerId: Number(formData.customerId),
        items: formData.items.map((i) => ({
          productId: Number(i.productId),
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      }).unwrap();
      toast.success('Sales order placed successfully');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to place order');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelOrder(id).unwrap();
      toast.success('Order cancelled and stock released');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to cancel order');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 90 },
    { field: 'orderNumber', headerName: 'Order #', width: 140 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 130, renderCell: (params) => formatCurrency(params.value || 0) },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Paid'}
          color={params.value === 'paid' ? 'success' : params.value === 'refunded' ? 'error' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'orderStatus',
      headerName: 'Fulfillment',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Completed'}
          color={params.value === 'cancelled' ? 'error' : 'info'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canCancel && params.row.orderStatus !== 'cancelled' && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<Ban size={14} />}
              onClick={() => handleCancel(params.row.id)}
            >
              Cancel
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = data?.data?.orders || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer
      title="Sales Orders"
      subtitle="Manage customer sales orders, fulfillment, and checkout status"
      actionText={canCreate ? 'Create Sales Order' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            },
          }}
          sx={{ maxWidth: 300 }}
        />
      </Box>

      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={totalCount}
        page={page}
        onPageChange={(p) => setPage(p)}
      />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Sales Order</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Customer ID"
            fullWidth
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
          />
          <TextField
            label="Product ID"
            fullWidth
            value={formData.items[0].productId}
            onChange={(e) =>
              setFormData({
                ...formData,
                items: [{ ...formData.items[0], productId: e.target.value }],
              })
            }
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={formData.items[0].quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                items: [{ ...formData.items[0], quantity: Number(e.target.value) }],
              })
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Placing...' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
