import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetStockAdjustmentsQuery, useCreateStockAdjustmentMutation } from '../../../api/endpoints/inventoryApi';
import { usePermission } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export const StockAdjustmentsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: 0,
    type: 'increase',
    reason: 'correction',
  });

  const canCreate = usePermission('stock_adjustment.create');
  const { data, isLoading } = useGetStockAdjustmentsQuery({});
  const [createAdjustment, { isLoading: isCreating }] = useCreateStockAdjustmentMutation();

  const handleCreate = async () => {
    try {
      await createAdjustment({
        productId: Number(formData.productId),
        warehouseId: Number(formData.warehouseId),
        quantity: Number(formData.quantity),
        type: formData.type,
        reason: formData.reason,
      }).unwrap();
      toast.success('Stock adjustment submitted successfully');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit adjustment');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <Chip label={params.value || 'Completed'} color="success" size="small" />,
    },
  ];

  const rows = data?.data?.adjustments || data?.data || [];

  return (
    <PageContainer
      title="Stock Adjustments"
      subtitle="Manual inventory reconciliation and count adjustments"
      actionText={canCreate ? 'New Adjustment' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>New Stock Adjustment</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product ID"
            fullWidth
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          />
          <TextField
            label="Warehouse ID"
            fullWidth
            value={formData.warehouseId}
            onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
          />
          <TextField
            label="Adjustment Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          />
          <TextField
            select
            label="Adjustment Type"
            fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="increase">Increase (+)</MenuItem>
            <MenuItem value="decrease">Decrease (-)</MenuItem>
            <MenuItem value="damage">Damage / Loss</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
