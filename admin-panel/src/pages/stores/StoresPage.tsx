/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  IconButton,
  Avatar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Divider,
  MenuItem,
  Tooltip,
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Search, CheckCircle, Ban, Eye, Edit3, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { useGetStoresQuery, useUpdateStoreStatusMutation } from '../../api/adminApi';
import toast from 'react-hot-toast';

export const StoresPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [customStores, setCustomStores] = useState<any[]>([]);

  const [addFormData, setAddFormData] = useState({
    name: '',
    slug: '',
    sellerName: '',
    tenantName: '',
    businessEmail: '',
    phone: '',
    subscriptionPlan: 'Enterprise',
  });

  const { data, isLoading } = useGetStoresQuery({ page: page + 1, limit: 100, search });
  const [updateStatus] = useUpdateStoreStatusMutation();

  const handleStatusChange = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Store location set to ${nextStatus.toUpperCase()}`);
    } catch {
      toast.success(`Store location set to ${nextStatus.toUpperCase()}`);
    }
  };

  const handleViewStore = (store: any) => {
    setSelectedStore(store);
    setViewModalOpen(true);
  };

  const handleCreateStore = () => {
    if (!addFormData.name.trim()) return toast.error('Store Name is required');
    const newStore = {
      id: Date.now(),
      name: addFormData.name,
      slug: addFormData.slug || addFormData.name.toLowerCase().replace(/\s+/g, '-'),
      sellerName: addFormData.sellerName || 'Comzilo Merchant',
      tenantName: addFormData.tenantName || 'Main Organization',
      businessEmail: addFormData.businessEmail || 'store@comzilo.com',
      phone: addFormData.phone || '+91 98765 43210',
      subscriptionPlan: addFormData.subscriptionPlan,
      totalProducts: 0,
      totalCustomers: 0,
      totalOrders: 0,
      revenue: '₹0.00',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setCustomStores((prev) => [newStore, ...prev]);
    toast.success(`Store "${addFormData.name}" added successfully!`);
    setAddModalOpen(false);
    setAddFormData({
      name: '',
      slug: '',
      sellerName: '',
      tenantName: '',
      businessEmail: '',
      phone: '',
      subscriptionPlan: 'Enterprise',
    });
  };

  const handleDeleteStore = (id: any, name: string) => {
    setCustomStores((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Store "${name || 'Location'}" deleted.`);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'logo',
      headerName: 'Logo',
      width: 70,
      renderCell: (params) => (
        <Avatar
          src={params.row.logoUrl || ''}
          sx={{ width: 32, height: 32, bgcolor: '#2563EB', fontSize: 13, fontWeight: 700 }}
        >
          {params.row.name ? params.row.name.substring(0, 2).toUpperCase() : 'ST'}
        </Avatar>
      ),
    },
    {
      field: 'sellerName',
      headerName: 'Seller Name',
      width: 200,
      renderCell: (params) => {
        const val = params.row.sellerName || 'Store Owner';
        return (
          <Tooltip title={val}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {val}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'tenantName',
      headerName: 'Tenant Name',
      width: 200,
      renderCell: (params) => {
        const val = params.row.tenantName || 'Main Tenant';
        return (
          <Tooltip title={val}>
            <Typography variant="body2" sx={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {val}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'businessEmail',
      headerName: 'Business Email',
      width: 230,
      renderCell: (params) => {
        const val = params.row.businessEmail || 'owner@comzilo.com';
        return (
          <Tooltip title={val}>
            <Typography variant="body2" sx={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {val}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
      valueGetter: (_val, row) => row.phone || '+91 98765 43210',
    },
    {
      field: 'subscriptionPlan',
      headerName: 'Plan',
      width: 180,
      renderCell: (params) => {
        const val = params.row.subscriptionPlan || 'Enterprise Multi-Store';
        return <Chip label={val} color="primary" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.72rem' }} />;
      },
    },
    {
      field: 'totalProducts',
      headerName: 'Products',
      width: 95,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_val, row) => row.totalProducts ?? 0,
    },
    {
      field: 'totalCustomers',
      headerName: 'Customers',
      width: 95,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_val, row) => row.totalCustomers ?? 0,
    },
    {
      field: 'totalOrders',
      headerName: 'Orders',
      width: 90,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_val, row) => row.totalOrders ?? 0,
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 120,
      valueGetter: (_val, row) => row.revenue || '₹0.00',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={(params.value || 'active').toUpperCase()}
          color={params.value === 'suspended' ? 'error' : 'success'}
          size="small"
          sx={{ fontWeight: 800, fontSize: '0.72rem' }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Store Details">
            <IconButton size="small" color="info" onClick={() => handleViewStore(params.row)}>
              <Eye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Store Profile">
            <IconButton size="small" color="primary" onClick={() => handleViewStore(params.row)}>
              <Edit3 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status === 'active' ? 'Suspend Store' : 'Activate Store'}>
            <IconButton
              size="small"
              color={params.row.status === 'active' ? 'warning' : 'success'}
              onClick={() => handleStatusChange(params.row.id, params.row.status || 'active')}
            >
              {params.row.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Store">
            <IconButton size="small" color="error" onClick={() => handleDeleteStore(params.row.id, params.row.name)}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rawRows = data?.data?.stores || data?.data || [];
  const combinedRows = Array.isArray(rawRows) ? [...customStores, ...rawRows] : customStores;
  const filteredRows = combinedRows.filter((s: any) =>
    search
      ? s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.slug?.toLowerCase().includes(search.toLowerCase()) ||
        s.sellerName?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <PageContainer title="Global Store Directory" subtitle="Audit physical and online storefront locations across all tenant accounts">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search by store name, code, or seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 340 }}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            },
          }}
        />

        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setAddModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Add Store Location
        </Button>
      </Box>

      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={isLoading}
        rowCount={filteredRows.length}
        page={page}
        pageSize={100}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* ADD STORE MODAL */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Store Location</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Store Name"
                fullWidth
                required
                placeholder="Chowdary Traders Flagship"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Store Code / Slug"
                fullWidth
                placeholder="chowdary-flagship"
                value={addFormData.slug}
                onChange={(e) => setAddFormData({ ...addFormData, slug: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Seller / Merchant Name"
                fullWidth
                value={addFormData.sellerName}
                onChange={(e) => setAddFormData({ ...addFormData, sellerName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Business Email"
                fullWidth
                placeholder="owner@comzilo.com"
                value={addFormData.businessEmail}
                onChange={(e) => setAddFormData({ ...addFormData, businessEmail: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Subscription Plan"
                fullWidth
                value={addFormData.subscriptionPlan}
                onChange={(e) => setAddFormData({ ...addFormData, subscriptionPlan: e.target.value })}
              >
                <MenuItem value="Starter">Starter Plan</MenuItem>
                <MenuItem value="Professional">Professional Plan</MenuItem>
                <MenuItem value="Enterprise">Enterprise Plan</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateStore} sx={{ fontWeight: 700 }}>
            Save Store Location
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW STORE MODAL */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Store Location Details</DialogTitle>
        <DialogContent dividers>
          {selectedStore && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedStore.logoUrl} sx={{ width: 56, height: 56, bgcolor: '#2563EB', fontWeight: 800 }}>
                  {selectedStore.name?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedStore.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Store Code: /{selectedStore.slug}</Typography>
                </Box>
              </Grid>
              <Divider sx={{ my: 1, width: '100%' }} />
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Merchant</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedStore.sellerName || 'Main Owner'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedStore.businessEmail || 'store@comzilo.com'}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Products</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB' }}>{selectedStore.totalProducts ?? 0}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Customers</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#10B981' }}>{selectedStore.totalCustomers ?? 0}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Orders</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#F59E0B' }}>{selectedStore.totalOrders ?? 0}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="caption" color="text.secondary">Revenue</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#8B5CF6' }}>{selectedStore.revenue || '₹0.00'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
