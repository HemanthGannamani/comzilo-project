import React, { useState } from 'react';
import { Box, TextField, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Trash2, RotateCcw } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useGetTenantsQuery, useCreateTenantMutation, useDeleteTenantMutation, useRestoreTenantMutation } from '../../api/endpoints/mastersApi';
import { usePermission } from '../../hooks/usePermission';
import toast from 'react-hot-toast';

export const TenantsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', slug: '', plan: 'Enterprise' });

  const canCreate = usePermission('tenant.create');
  const canDelete = usePermission('tenant.delete');

  const { data, isLoading } = useGetTenantsQuery({ page: page + 1, limit: 10, search });
  const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation();
  const [deleteTenant] = useDeleteTenantMutation();
  const [restoreTenant] = useRestoreTenantMutation();

  const handleCreate = async () => {
    try {
      await createTenant(formData).unwrap();
      toast.success('Tenant created successfully');
      setOpenModal(false);
      setFormData({ name: '', slug: '', plan: 'Enterprise' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create tenant');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteTenant(selectedId).unwrap();
      toast.success('Tenant deleted successfully');
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete tenant');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreTenant(id).unwrap();
      toast.success('Tenant restored successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to restore tenant');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Organization Name', flex: 1, minWidth: 160 },
    { field: 'slug', headerName: 'Slug', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Active'}
          color={params.value === 'suspended' ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
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
          {params.row.deletedAt && (
            <IconButton size="small" color="primary" onClick={() => handleRestore(params.row.id)}>
              <RotateCcw size={18} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const rows = data?.data?.tenants || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer
      title="Tenants Management"
      subtitle="Manage multi-tenant organization accounts and statuses"
      actionText={canCreate ? 'Create Tenant' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search tenants..."
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
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Tenant</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Organization Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Slug Identifier"
            fullWidth
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
        title="Delete Tenant"
        message="Are you sure you want to soft-delete this tenant?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
