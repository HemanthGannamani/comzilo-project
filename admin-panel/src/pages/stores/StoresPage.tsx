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
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Search, CheckCircle, Ban, Eye, Edit3 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { useGetStoresQuery, useUpdateStoreStatusMutation } from '../../api/adminApi';
import toast from 'react-hot-toast';

export const StoresPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { data, isLoading } = useGetStoresQuery({ page: page + 1, limit: 100, search });
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

  const handleViewStore = (store: any) => {
    setSelectedStore(store);
    setViewModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 60 },
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
    { field: 'name', headerName: 'Store Name', flex: 1, minWidth: 160 },
    { field: 'slug', headerName: 'Store Code', width: 140 },
    { field: 'sellerName', headerName: 'Seller Name', width: 150, valueGetter: (_val, row) => row.sellerName || 'Store Owner' },
    { field: 'tenantName', headerName: 'Tenant Name', width: 150, valueGetter: (_val, row) => row.tenantName || 'Main Tenant' },
    { field: 'businessEmail', headerName: 'Business Email', width: 180, valueGetter: (_val, row) => row.businessEmail || 'owner@comzilo.com' },
    { field: 'phone', headerName: 'Phone', width: 130, valueGetter: (_val, row) => row.phone || '+915220230512' },
    { field: 'subscriptionPlan', headerName: 'Plan', width: 150, valueGetter: (_val, row) => row.subscriptionPlan || 'Enterprise' },
    { field: 'totalProducts', headerName: 'Products', width: 90, valueGetter: (_val, row) => row.totalProducts ?? 0 },
    { field: 'totalCustomers', headerName: 'Customers', width: 90, valueGetter: (_val, row) => row.totalCustomers ?? 0 },
    { field: 'totalOrders', headerName: 'Orders', width: 80, valueGetter: (_val, row) => row.totalOrders ?? 0 },
    { field: 'revenue', headerName: 'Revenue', width: 100, valueGetter: (_val, row) => row.revenue || '$0.00' },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value || 'active'}
          color={params.value === 'suspended' ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created Date',
      width: 120,
      valueGetter: (_val, row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" color="info" onClick={() => handleViewStore(params.row)} title="View Store">
            <Eye size={16} />
          </IconButton>
          <IconButton size="small" color="primary" onClick={() => handleViewStore(params.row)} title="Edit Store">
            <Edit3 size={16} />
          </IconButton>
          <IconButton
            size="small"
            color={params.row.status === 'active' ? 'warning' : 'success'}
            onClick={() => handleStatusChange(params.row.id, params.row.status || 'active')}
            title={params.row.status === 'active' ? 'Suspend Store' : 'Activate Store'}
          >
            {params.row.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
          </IconButton>
        </Box>
      ),
    },
  ];

  const rawRows = data?.data?.stores || data?.data || [];
  const filteredRows = Array.isArray(rawRows)
    ? rawRows.filter((s: any) =>
        search
          ? s.name?.toLowerCase().includes(search.toLowerCase()) ||
            s.slug?.toLowerCase().includes(search.toLowerCase()) ||
            s.sellerName?.toLowerCase().includes(search.toLowerCase())
          : true
      )
    : [];

  return (
    <PageContainer title="Global Store Directory" subtitle="Audit physical and online storefront locations across all tenant accounts">
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search by store name, code, or seller..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            },
          }}
          sx={{ maxWidth: 350 }}
        />
      </Box>

      <DataTable
        rows={filteredRows}
        columns={columns}
        loading={isLoading}
        rowCount={filteredRows.length}
        page={page}
        onPageChange={(p) => setPage(p)}
      />

      {/* Store View & Audit Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Store Details Audit</DialogTitle>
        <DialogContent dividers>
          {selectedStore && (
            <Box sx={{ py: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: '#2563EB', fontWeight: 800 }}>
                    {selectedStore.name?.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {selectedStore.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: {selectedStore.slug} | Status: {selectedStore.status}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tenant Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStore.tenantName || 'Main Tenant'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Seller Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStore.sellerName || 'Store Owner'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Business Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStore.businessEmail || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedStore.phone || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

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
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#8B5CF6' }}>{selectedStore.revenue || '$0.00'}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
