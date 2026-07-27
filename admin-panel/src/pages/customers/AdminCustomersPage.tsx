import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Grid,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Users } from 'lucide-react';
import {
  useGetAdminCustomersQuery,
  useGetTenantsQuery,
  useGetStoresQuery,
} from '../../api/adminApi';

export const AdminCustomersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [storeId, setStoreId] = useState('');

  const { data: customersData, isLoading } = useGetAdminCustomersQuery({
    page,
    limit: 10,
    search,
    tenantId,
    storeId,
  });

  const { data: tenantsData } = useGetTenantsQuery({ limit: 100 });
  const { data: storesData } = useGetStoresQuery({ limit: 100 });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Customer Name',
      width: 180,
      valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    },
    { field: 'email', headerName: 'Email Address', width: 220 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'tenant',
      headerName: 'Tenant',
      width: 160,
      valueGetter: (_, row) => row.tenant?.name || `Tenant #${row.tenantId}`,
    },
    {
      field: 'store',
      headerName: 'Store',
      width: 160,
      valueGetter: (_, row) => row.store?.name || `Store #${row.storeId}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value || 'Active'}
          color={params.value === 'blocked' ? 'error' : 'success'}
          size="small"
        />
      ),
    },
  ];

  const rows = customersData?.data?.rows || customersData?.data?.customers || [];
  const totalCount = customersData?.data?.count || customersData?.data?.total || rows.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2, color: '#2563EB', display: 'flex' }}>
          <Users size={28} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
            All Platform Customers
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Global customer directory across all tenants, sellers, and store outlets
          </Typography>
        </Box>
      </Box>

      {/* Filter Toolbar */}
      <Paper sx={{ p: 2.5, mb: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748B' }} />,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Tenant</InputLabel>
              <Select
                value={tenantId}
                label="Filter by Tenant"
                onChange={(e) => setTenantId(e.target.value)}
              >
                <MenuItem value="">All Tenants</MenuItem>
                {tenantsData?.data?.tenants?.map((t: any) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Store</InputLabel>
              <Select
                value={storeId}
                label="Filter by Store"
                onChange={(e) => setStoreId(e.target.value)}
              >
                <MenuItem value="">All Stores</MenuItem>
                {storesData?.data?.stores?.map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Customer DataGrid Table */}
      <Paper sx={{ border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3, overflow: 'hidden' }}>
        <Box style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{ page: page - 1, pageSize: 10 }}
            onPaginationModelChange={(model) => setPage(model.page + 1)}
            sx={{ border: 'none' }}
          />
        </Box>
      </Paper>
    </Container>
  );
};
