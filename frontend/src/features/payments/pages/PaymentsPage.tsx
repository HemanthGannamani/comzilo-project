import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, MenuItem } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetPaymentsQuery, useCreatePaymentMutation } from '../../../api/endpoints/salesApi';
import { usePermission } from '../../../hooks/usePermission';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    paymentMethod: 'card',
  });

  const canCreate = usePermission('payment.create');
  const { data, isLoading } = useGetPaymentsQuery({});
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();

  const handleCreate = async () => {
    try {
      await createPayment({
        orderId: Number(formData.orderId),
        amount: parseFloat(formData.amount) || 0,
        paymentMethod: formData.paymentMethod,
      }).unwrap();
      toast.success('Payment recorded successfully');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to record payment');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Payment ID', width: 100 },
    { field: 'orderId', headerName: 'Order ID', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 130, renderCell: (params) => formatCurrency(params.value || 0) },
    { field: 'paymentMethod', headerName: 'Method', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <Chip label={params.value || 'Completed'} color="success" size="small" />,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
  ];

  const rows = data?.data?.payments || data?.data || [];

  return (
    <PageContainer
      title="Payment Transactions"
      subtitle="Audit history of payment transactions and processor settlements"
      actionText={canCreate ? 'Record Payment' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Record Payment</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Order ID"
            fullWidth
            value={formData.orderId}
            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
          />
          <TextField
            label="Amount ($)"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <TextField
            select
            label="Payment Method"
            fullWidth
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          >
            <MenuItem value="card">Credit / Debit Card</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Recording...' : 'Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
