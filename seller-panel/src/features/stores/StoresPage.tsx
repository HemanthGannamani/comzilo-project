import React, { useState } from 'react';
import { Box, TextField, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useGetStoresQuery, useCreateStoreMutation, useDeleteStoreMutation } from '../../api/endpoints/mastersApi';
import { usePermission } from '../../hooks/usePermission';
import toast from 'react-hot-toast';

export const StoresPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', code: '', currency: 'USD' });

  const canCreate = usePermission('store.create');
  const canDelete = usePermission('store.delete');

  const { data, isLoading } = useGetStoresQuery({ page: page + 1, limit: 10, search });
  const [createStore, { isLoading: isCreating }] = useCreateStoreMutation();
  const [deleteStore] = useDeleteStoreMutation();

  const handleCreate = async () => {
    try {
      await createStore(formData).unwrap();
      toast.success('Store location created successfully');
      setOpenModal(false);
      setFormData({ name: '', code: '', currency: 'USD' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create store');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteStore(selectedId).unwrap();
      toast.success('Store deleted successfully');
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete store');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Store Name', flex: 1, minWidth: 160 },
    { field: 'code', headerName: 'Store Code', width: 130 },
    { field: 'currency', headerName: 'Currency', width: 110 },
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

  const rows = data?.data?.stores || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer
      title="Stores Management"
      subtitle="Manage physical and online store locations for active tenant"
      actionText={canCreate ? 'Create Store' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search stores..."
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
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Store Location</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Store Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Store Code (e.g. STORE-01)"
            fullWidth
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <TextField
            label="Currency"
            fullWidth
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
        title="Delete Store"
        message="Are you sure you want to soft-delete this store location?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
