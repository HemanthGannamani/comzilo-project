import React, { useState } from 'react';
import { Box, TextField, Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Search } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetStockBalancesQuery } from '../../../api/endpoints/inventoryApi';

export const StockBalancesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetStockBalancesQuery({ page: page + 1, limit: 10, search });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'productName', headerName: 'Product Name', flex: 1, minWidth: 160 },
    { field: 'sku', headerName: 'SKU', width: 130 },
    { field: 'warehouseName', headerName: 'Warehouse', width: 150 },
    { field: 'availableQty', headerName: 'Available Qty', width: 130 },
    { field: 'reservedQty', headerName: 'Reserved Qty', width: 130 },
    {
      field: 'status',
      headerName: 'Stock Status',
      width: 140,
      renderCell: (params) => {
        const qty = params.row.availableQty || 0;
        return (
          <Chip
            label={qty > 10 ? 'In Stock' : qty > 0 ? 'Low Stock' : 'Out of Stock'}
            color={qty > 10 ? 'success' : qty > 0 ? 'warning' : 'error'}
            size="small"
          />
        );
      },
    },
  ];

  const rows = data?.data?.balances || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer title="Stock Balances" subtitle="Real-time physical inventory levels across warehouses">
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search stock balances..."
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
