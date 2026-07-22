import React, { useState } from 'react';
import { Box, TextField, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Trash2 } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useDeleteWarehouseMutation,
} from '../../../api/endpoints/inventoryApi';
import { usePermission } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export const WarehousesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', code: '', address: '' });

  const canCreate = usePermission('warehouse.create');
  const canDelete = usePermission('warehouse.delete');

  const { data, isLoading } = useGetWarehousesQuery({ search });
  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();
  const [deleteWarehouse] = useDeleteWarehouseMutation();

  const handleCreate = async () => {
    try {
      await createWarehouse(formData).unwrap();
      toast.success('Warehouse created successfully');
      setOpenModal(false);
      setFormData({ name: '', code: '', address: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create warehouse');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteWarehouse(selectedId).unwrap();
      toast.success('Warehouse deleted successfully');
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete warehouse');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Warehouse Name', flex: 1, minWidth: 160 },
    { field: 'code', headerName: 'Code', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <Chip label={params.value || 'Active'} color="success" size="small" />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canDelete && (
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setSelectedId(params.row.id);
                setConfirmOpen(true);
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const rows = data?.data?.warehouses || data?.data || [];

  return (
    <PageContainer
      title="Fulfillment Warehouses"
      subtitle="Manage inventory distribution centers and bin locations"
      actionText={canCreate ? 'Create Warehouse' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search warehouses..."
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

      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Warehouse</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Warehouse Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Warehouse Code (e.g. WH-MAIN)"
            fullWidth
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Warehouse"
        message="Are you sure you want to delete this warehouse?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
