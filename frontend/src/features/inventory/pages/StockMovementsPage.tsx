import React, { useState } from 'react';
import { Box, TextField, Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Search } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetStockMovementsQuery } from '../../../api/endpoints/inventoryApi';
import { formatDateTime } from '../../../utils/formatters';

export const StockMovementsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetStockMovementsQuery({ page: page + 1, limit: 10, search });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'referenceNo', headerName: 'Ref No', width: 140 },
    { field: 'productName', headerName: 'Product', flex: 1, minWidth: 150 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    {
      field: 'type',
      headerName: 'Movement Type',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Inbound'}
          color={params.value === 'inbound' ? 'success' : params.value === 'outbound' ? 'error' : 'info'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date & Time',
      width: 170,
      renderCell: (params) => formatDateTime(params.value),
    },
  ];

  const rows = data?.data?.movements || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer title="Stock Movements Audit Log" subtitle="Complete physical inventory addition and removal logs">
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search movements..."
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
