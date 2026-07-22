import React, { useState } from 'react';
import { Box, TextField, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Trash2 } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
} from '../../../api/endpoints/salesApi';
import { usePermission } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export const CustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const canCreate = usePermission('customer.create');
  const canDelete = usePermission('customer.delete');

  const { data, isLoading } = useGetCustomersQuery({ page: page + 1, limit: 10, search });
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleCreate = async () => {
    try {
      await createCustomer(formData).unwrap();
      toast.success('Customer profile created successfully');
      setOpenModal(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create customer');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteCustomer(selectedId).unwrap();
      toast.success('Customer deleted successfully');
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete customer');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1.5 },
    { field: 'phone', headerName: 'Phone Number', width: 140 },
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

  const rows = data?.data?.customers || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer
      title="Customer Relationship Management (CRM)"
      subtitle="Manage customer profiles, contact info, and lifetime purchase value"
      actionText={canCreate ? 'Create Customer' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search customers..."
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
        <DialogTitle sx={{ fontWeight: 700 }}>Create Customer Profile</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
        title="Delete Customer"
        message="Are you sure you want to delete this customer profile?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
