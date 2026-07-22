import React, { useState } from 'react';
import { Box, TextField, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Trash2, CheckCircle, Ban } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantStatusMutation,
  useDeleteTenantMutation,
} from '../../api/adminApi';
import toast from 'react-hot-toast';

export const TenantsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', slug: '', plan: 'Enterprise' });

  const { data, isLoading } = useGetTenantsQuery({ page: page + 1, limit: 10, search });
  const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation();
  const [updateStatus] = useUpdateTenantStatusMutation();
  const [deleteTenant] = useDeleteTenantMutation();

  const handleCreate = async () => {
    try {
      await createTenant(formData).unwrap();
      toast.success('Tenant Organization created successfully');
      setOpenModal(false);
      setFormData({ name: '', slug: '', plan: 'Enterprise' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create tenant');
    }
  };

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Tenant set to ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update status');
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Organization Name', flex: 1, minWidth: 160 },
    { field: 'slug', headerName: 'Slug Identifier', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value || 'active'}
          color={params.value === 'suspended' ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color={params.row.status === 'active' ? 'warning' : 'success'}
            onClick={() => handleStatusChange(params.row.id, params.row.status || 'active')}
          >
            {params.row.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
          </IconButton>
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
        </Box>
      ),
    },
  ];

  const rows = data?.data?.tenants || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer
      title="Tenant Management"
      subtitle="Manage multi-tenant organization accounts, provisionings, and status locks"
      actionText="Provision Tenant"
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
        <DialogTitle sx={{ fontWeight: 700 }}>Provision New Tenant</DialogTitle>
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
            {isCreating ? 'Provisioning...' : 'Provision'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Tenant"
        message="Are you sure you want to delete this tenant organization?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
