import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, MenuItem, FormControl, InputLabel, Select, Button, Chip, IconButton, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetSellersQuery, useGetTenantsQuery, useGetStoresQuery } from '../api/adminApi';

export const SellersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [sort, setSort] = useState('newest');

  const { data: sellersData, isLoading } = useGetSellersQuery({
    page,
    limit: 10,
    search,
    status,
    role,
    tenantId,
    storeId,
    sort,
  });

  const { data: tenantsData } = useGetTenantsQuery({ limit: 100 });
  const { data: storesData } = useGetStoresQuery({ limit: 100 });

  const handleViewDetails = (sellerRow: any) => {
    navigate(`/sellers/${sellerRow.id}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'ownerName',
      headerName: 'Seller Name',
      width: 180,
      valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    },
    {
      field: 'businessName',
      headerName: 'Business Name',
      width: 180,
      valueGetter: (_, row) => row.profile?.metadata?.businessName || 'N/A',
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'mobile', headerName: 'Phone', width: 140 },
    {
      field: 'tenant',
      headerName: 'Tenant',
      width: 150,
      valueGetter: (_, row) => row.tenant?.name || 'N/A',
    },
    {
      field: 'store',
      headerName: 'Store',
      width: 150,
      valueGetter: (_, row) => row.userRoles?.[0]?.store?.name || 'N/A',
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      valueGetter: (_, row) => row.userRoles?.[0]?.role?.name || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const value = params.value as string;
        let color: 'success' | 'warning' | 'error' = 'success';
        if (value === 'suspended' || value === 'locked') color = 'error';
        if (value === 'invited') color = 'warning';
        return <Chip label={value} color={color} size="small" sx={{ fontWeight: 700, textTransform: 'capitalize' }} />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 150,
      valueFormatter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleViewDetails(params.row)} size="small">
          <Eye size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Platform Sellers & Staff
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage store owners, managers, and warehouse staff.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate('/sellers/add')}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Add Seller
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              size="small"
              placeholder="Search sellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748B' }} />,
                },
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
                <MenuItem value="invited">Invited</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="tenant_owner">Seller</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tenant</InputLabel>
              <Select value={tenantId} label="Tenant" onChange={(e) => setTenantId(e.target.value)}>
                <MenuItem value="">All Tenants</MenuItem>
                {tenantsData?.data?.tenants?.map((t: any) => (
                  <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Store</InputLabel>
              <Select value={storeId} label="Store" onChange={(e) => setStoreId(e.target.value)}>
                <MenuItem value="">All Stores</MenuItem>
                {storesData?.data?.stores?.map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Grid */}
      <Paper sx={{ border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3, overflow: 'hidden' }}>
        <Box style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={sellersData?.data?.sellers || []}
            columns={columns}
            loading={isLoading}
            paginationMode="server"
            rowCount={sellersData?.data?.total || 0}
            paginationModel={{ page: page - 1, pageSize: 10 }}
            onPaginationModelChange={(model) => setPage(model.page + 1)}
            sx={{ border: 'none' }}
          />
        </Box>
      </Paper>

    </Container>
  );
};
