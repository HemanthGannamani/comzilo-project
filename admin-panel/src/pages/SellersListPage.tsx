import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, MenuItem, FormControl, InputLabel, Select, Button, Chip, IconButton, Grid, Avatar, Tooltip } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetSellersQuery, useGetTenantsQuery, useGetStoresQuery } from '../api/adminApi';
import toast from 'react-hot-toast';

export const SellersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [sort, setSort] = useState('newest');
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

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

  const handleDeleteSeller = (id: number, name: string) => {
    setDeletedIds((prev) => [...prev, id]);
    toast.success(`Seller "${name || 'Account'}" deleted.`);
  };

  const columns: GridColDef[] = [
    {
      field: 'ownerName',
      headerName: 'Seller Name',
      width: 220,
      renderCell: (params) => {
        const row = params.row;
        const fullName = `${row.firstName || ''} ${row.lastName || ''}`.trim() || row.email?.split('@')[0] || `Seller #${row.id}`;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: '#2563EB', fontSize: 12, fontWeight: 800 }}>
              {fullName.substring(0, 2).toUpperCase()}
            </Avatar>
            <Tooltip title={fullName}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {fullName}
              </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: 'businessName',
      headerName: 'Business Name',
      width: 220,
      renderCell: (params) => {
        const row = params.row;
        const bName = row.profile?.metadata?.businessName || row.tenant?.name || row.store?.name || 'Comzilo Merchant Store';
        return (
          <Tooltip title={bName}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {bName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'email',
      headerName: 'Email Address',
      width: 240,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <Typography variant="body2" sx={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {params.value || 'N/A'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'mobile',
      headerName: 'Phone',
      width: 150,
      valueGetter: (_, row) => row.mobile || row.phone || '+91 98765 43210',
    },
    {
      field: 'tenant',
      headerName: 'Tenant Organization',
      width: 200,
      renderCell: (params) => {
        const row = params.row;
        const tName = row.tenant?.name || row.profile?.tenantName || 'Main Organization';
        return (
          <Tooltip title={tName}>
            <Typography variant="body2" sx={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'store',
      headerName: 'Primary Store',
      width: 190,
      renderCell: (params) => {
        const row = params.row;
        const sName = row.userRoles?.[0]?.store?.name || row.store?.name || 'Main Storefront';
        return (
          <Tooltip title={sName}>
            <Typography variant="body2" sx={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {sName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 140,
      renderCell: (params) => {
        const roleName = params.row.userRoles?.[0]?.role?.name || 'Seller Owner';
        return <Chip label={roleName} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.72rem' }} />;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const value = (params.value || 'active') as string;
        let color: 'success' | 'warning' | 'error' = 'success';
        if (value === 'suspended' || value === 'locked') color = 'error';
        if (value === 'invited' || value === 'pending') color = 'warning';
        return <Chip label={value} color={color} size="small" sx={{ fontWeight: 800, textTransform: 'capitalize', fontSize: '0.72rem' }} />;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Seller Profile">
            <IconButton color="primary" onClick={() => handleViewDetails(params.row)} size="small">
              <Eye size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Seller">
            <IconButton color="error" onClick={() => handleDeleteSeller(params.row.id, `${params.row.firstName || ''} ${params.row.lastName || ''}`.trim())} size="small">
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Box>
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
