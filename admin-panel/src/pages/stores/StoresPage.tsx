import React, { useState } from 'react';
import { Box, TextField, Chip, IconButton } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Search, CheckCircle, Ban } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { useGetStoresQuery, useUpdateStoreStatusMutation } from '../../api/adminApi';
import toast from 'react-hot-toast';

export const StoresPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetStoresQuery({ page: page + 1, limit: 10, search });
  const [updateStatus] = useUpdateStoreStatusMutation();

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Store location set to ${nextStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update store status');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Store Location Name', flex: 1, minWidth: 160 },
    { field: 'code', headerName: 'Store Code', width: 130 },
    { field: 'currency', headerName: 'Currency', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value || 'Active'} color={params.value === 'suspended' ? 'error' : 'success'} size="small" />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          size="small"
          color={params.row.status === 'active' ? 'warning' : 'success'}
          onClick={() => handleStatusChange(params.row.id, params.row.status || 'active')}
        >
          {params.row.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
        </IconButton>
      ),
    },
  ];

  const rows = data?.data?.stores || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer title="Global Store Directory" subtitle="Audit physical and online storefront locations across all tenant accounts">
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
    </PageContainer>
  );
};
