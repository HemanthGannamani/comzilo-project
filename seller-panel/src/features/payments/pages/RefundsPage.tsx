import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetRefundsQuery, useCreateRefundMutation } from '../../../api/endpoints/salesApi';
import { usePermission } from '../../../hooks/usePermission';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export const RefundsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    paymentId: '',
    amount: '',
    reason: '',
  });

  const canCreate = usePermission('refund.create');
  const { data, isLoading } = useGetRefundsQuery({});
  const [createRefund, { isLoading: isCreating }] = useCreateRefundMutation();

  const handleCreate = async () => {
    try {
      await createRefund({
        paymentId: Number(formData.paymentId),
        amount: parseFloat(formData.amount) || 0,
        reason: formData.reason,
      }).unwrap();
      toast.success('Refund processed successfully');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to process refund');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Refund ID', width: 100 },
    { field: 'paymentId', headerName: 'Payment ID', width: 110 },
    { field: 'amount', headerName: 'Amount', width: 130, renderCell: (params) => formatCurrency(params.value || 0) },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <Chip label={params.value || 'Refunded'} color="error" size="small" />,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
  ];

  const rows = data?.data?.refunds || data?.data || [];

  return (
    <PageContainer
      title="Payment Refunds"
      subtitle="Manage customer refund requests and reversals"
      actionText={canCreate ? 'Process Refund' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Process Refund</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Payment ID"
            fullWidth
            value={formData.paymentId}
            onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
          />
          <TextField
            label="Refund Amount ($)"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <TextField
            label="Reason"
            multiline
            rows={2}
            fullWidth
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="error" disabled={isCreating}>
            {isCreating ? 'Processing...' : 'Process Refund'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
