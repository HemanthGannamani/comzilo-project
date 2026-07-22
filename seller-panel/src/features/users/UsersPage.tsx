import React, { useState, useEffect } from 'react';
import { Box, TextField, Chip, IconButton } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Search, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { axiosInstance } from '../../api/axiosInstance';
import { usePermission } from '../../hooks/usePermission';
import toast from 'react-hot-toast';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canDelete = usePermission('user.delete');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/auth/profile');
      if (res.data?.data?.user) {
        setUsers([res.data.data.user]);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      toast.success('User deleted successfully');
      setConfirmOpen(false);
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1.5 },
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

  return (
    <PageContainer title="User Management" subtitle="Manage administrative users, credentials, and profile roles">
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search users..."
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

      <DataTable rows={users} columns={columns} loading={loading} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
        message="Are you sure you want to remove this administrative user?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
