import React, { useState } from 'react';
import { Container, Typography, Box, Paper, TextField, MenuItem, FormControl, InputLabel, Select, Button, Chip, Drawer, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, Plus, Search, UserMinus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetSellersQuery, useUpdateSellerStatusMutation, useDeleteSellerMutation, useGetTenantsQuery, useGetStoresQuery } from '../api/adminApi';
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

  const { data: sellersData, isLoading, refetch } = useGetSellersQuery({
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

  const [updateSellerStatus] = useUpdateSellerStatusMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState('');

  const handleViewDetails = (sellerRow: any) => {
    setSelectedSeller(sellerRow);
    setIsDrawerOpen(true);
  };

  const handleStatusChangeClick = (statusVal: string) => {
    setStatusToChange(statusVal);
    setIsStatusDialogOpen(true);
  };

  const handleStatusConfirm = async () => {
    if (!selectedSeller) return;
    try {
      await updateSellerStatus({ id: selectedSeller.id, status: statusToChange }).unwrap();
      toast.success(`Seller status updated to ${statusToChange}`);
      setIsStatusDialogOpen(false);
      setIsDrawerOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedSeller) return;
    if (window.confirm('Are you sure you want to delete this seller account? This action is irreversible.')) {
      try {
        await deleteSeller(selectedSeller.id).unwrap();
        toast.success('Seller deleted successfully');
        setIsDrawerOpen(false);
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to delete seller');
      }
    }
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

      {/* Details Side Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 480, p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {selectedSeller && (
            <>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                Seller Account Profile
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2 }}>
                  OWNER ACCOUNT INFORMATION
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {selectedSeller.firstName} {selectedSeller.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedSeller.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedSeller.mobile || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Role Mapping</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedSeller.userRoles?.[0]?.role?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {selectedSeller.status}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2 }}>
                  BUSINESS INFORMATION
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Business Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedSeller.profile?.metadata?.businessName || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Business Type</Typography>
                    <Typography variant="body2">
                      {selectedSeller.profile?.metadata?.businessType || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">GST Number</Typography>
                    <Typography variant="body2">
                      {selectedSeller.profile?.metadata?.gstNumber || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">PAN Number</Typography>
                    <Typography variant="body2">
                      {selectedSeller.profile?.metadata?.panNumber || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">City & State</Typography>
                    <Typography variant="body2">
                      {selectedSeller.profile?.city || 'N/A'}, {selectedSeller.profile?.state || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2 }}>
                  TENANT & STORE MAPPING
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Tenant Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedSeller.tenant?.name || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Store Name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedSeller.userRoles?.[0]?.store?.name || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ pt: 3, borderTop: '1px solid #E2E8F0' }}>
                <Grid container spacing={2}>
                  {selectedSeller.status !== 'suspended' && (
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        startIcon={<ShieldAlert size={16} />}
                        onClick={() => handleStatusChangeClick('suspended')}
                      >
                        Suspend
                      </Button>
                    </Grid>
                  )}
                  {selectedSeller.status === 'suspended' && (
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        color="success"
                        fullWidth
                        startIcon={<CheckCircle2 size={16} />}
                        onClick={() => handleStatusChangeClick('active')}
                      >
                        Activate
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      startIcon={<UserMinus size={16} />}
                      onClick={handleDeleteClick}
                    >
                      Delete Account
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Suspend/Activate Confirm Dialog */}
      <Dialog open={isStatusDialogOpen} onClose={() => setIsStatusDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Status Update?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to change the status of this seller account to **{statusToChange}**?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusConfirm} color="primary" variant="contained">
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
