import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetStockReservationsQuery, useCreateStockReservationMutation } from '../../../api/endpoints/inventoryApi';
import { usePermission } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export const StockReservationsPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: 1,
    reference: '',
  });

  const canCreate = usePermission('stock_reservation.create');
  const { data, isLoading } = useGetStockReservationsQuery({});
  const [createReservation, { isLoading: isCreating }] = useCreateStockReservationMutation();

  const handleCreate = async () => {
    try {
      await createReservation({
        productId: Number(formData.productId),
        warehouseId: Number(formData.warehouseId),
        quantity: Number(formData.quantity),
        reference: formData.reference,
      }).unwrap();
      toast.success('Stock reservation hold created');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create reservation');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'reference', headerName: 'Reference', width: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <Chip label={params.value || 'Active Hold'} color="warning" size="small" />,
    },
  ];

  const rows = data?.data?.reservations || data?.data || [];

  return (
    <PageContainer
      title="Stock Reservations"
      subtitle="Temporary stock holds and fulfillment order reservations"
      actionText={canCreate ? 'Create Reservation' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>New Stock Reservation Hold</DialogTitle>
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
            label="Quantity to Hold"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Hold'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
