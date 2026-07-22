import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  useGetStockTransfersQuery,
  useCreateStockTransferMutation,
  useShipStockTransferMutation,
  useReceiveStockTransferMutation,
} from '../../../api/endpoints/inventoryApi';
import { usePermission } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export const StockTransfersPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    productId: '',
    quantity: 1,
  });

  const canCreate = usePermission('stock_transfer.create');
  const { data, isLoading } = useGetStockTransfersQuery({});
  const [createTransfer, { isLoading: isCreating }] = useCreateStockTransferMutation();
  const [shipTransfer] = useShipStockTransferMutation();
  const [receiveTransfer] = useReceiveStockTransferMutation();

  const handleCreate = async () => {
    try {
      await createTransfer({
        sourceWarehouseId: Number(formData.sourceWarehouseId),
        destinationWarehouseId: Number(formData.destinationWarehouseId),
        items: [{ productId: Number(formData.productId), quantity: Number(formData.quantity) }],
      }).unwrap();
      toast.success('Stock transfer requested successfully');
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to request transfer');
    }
  };

  const handleShip = async (id: number) => {
    try {
      await shipTransfer(id).unwrap();
      toast.success('Stock transfer marked as shipped');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to ship transfer');
    }
  };

  const handleReceive = async (id: number) => {
    try {
      await receiveTransfer(id).unwrap();
      toast.success('Stock transfer received at destination');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to receive transfer');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sourceWarehouseId', headerName: 'Source WH', width: 120 },
    { field: 'destinationWarehouseId', headerName: 'Dest WH', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Pending'}
          color={params.value === 'received' ? 'success' : params.value === 'shipped' ? 'info' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {params.row.status === 'pending' && (
            <Button size="small" variant="outlined" color="info" onClick={() => handleShip(params.row.id)}>
              Ship
            </Button>
          )}
          {params.row.status === 'shipped' && (
            <Button size="small" variant="contained" color="success" onClick={() => handleReceive(params.row.id)}>
              Receive
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const rows = data?.data?.transfers || data?.data || [];

  return (
    <PageContainer
      title="Inter-Warehouse Stock Transfers"
      subtitle="Manage inventory movement workflows between fulfillment centers"
      actionText={canCreate ? 'Request Transfer' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Request Stock Transfer</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Source Warehouse ID"
            fullWidth
            value={formData.sourceWarehouseId}
            onChange={(e) => setFormData({ ...formData, sourceWarehouseId: e.target.value })}
          />
          <TextField
            label="Destination Warehouse ID"
            fullWidth
            value={formData.destinationWarehouseId}
            onChange={(e) => setFormData({ ...formData, destinationWarehouseId: e.target.value })}
          />
          <TextField
            label="Product ID"
            fullWidth
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Requesting...' : 'Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
