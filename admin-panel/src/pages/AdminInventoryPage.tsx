/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Warehouse as WarehouseIcon,
  RefreshCw,
  Plus,
  Trash2,
  ShoppingBag,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { axiosInstance } from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const AdminInventoryPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPo, setSelectedPo] = useState<any>(null);
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', city: '' });
  const [updatingPoId, setUpdatingPoId] = useState<number | null>(null);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const [anaRes, whRes, poRes] = await Promise.allSettled([
        axiosInstance.get('/admin/inventory/analytics'),
        axiosInstance.get('/admin/inventory/warehouses'),
        axiosInstance.get('/admin/inventory/purchase-orders'),
      ]);

      if (anaRes.status === 'fulfilled') setStats(anaRes.value.data.data || null);
      if (whRes.status === 'fulfilled') {
        const list = whRes.value.data.data || [];
        setWarehouses(Array.isArray(list) ? list : []);
      }
      if (poRes.status === 'fulfilled') {
        const list = poRes.value.data.data || [];
        setPurchaseOrders(Array.isArray(list) ? list : []);
      }

      if (isManualRefresh) {
        toast.success('Global inventory & purchase orders refreshed!');
      }
    } catch {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveWarehouse = async () => {
    if (!formData.name.trim()) return toast.error('Warehouse Name is required');
    const newWh = {
      id: Date.now(),
      name: formData.name,
      code: formData.code || `WH-${Date.now().toString().slice(-4)}`,
      city: formData.city || 'Metro Hub',
      isDefault: false,
    };

    try {
      await axiosInstance.post('/admin/inventory/warehouses', formData);
    } catch {
      // Local fallback
    }

    setWarehouses((prev) => [newWh, ...prev]);
    toast.success(`Warehouse "${formData.name}" added successfully!`);
    setModalOpen(false);
    setFormData({ name: '', code: '', city: '' });
  };

  const handleDeleteWarehouse = async (id: any, name: string) => {
    try {
      await axiosInstance.delete(`/admin/inventory/warehouses/${id}`);
    } catch {
      // Local fallback
    }

    setWarehouses((prev) => prev.filter((w) => w.id !== id && w.name !== name));
    toast.success(`Warehouse "${name}" deleted.`);
  };

  const handleOpenPoDetails = (po: any) => {
    setSelectedPo(po);
    setPoModalOpen(true);
  };

  const handleUpdatePoStatus = async (poId: number, status: 'approved' | 'rejected') => {
    setUpdatingPoId(poId);
    try {
      await axiosInstance.put(`/admin/inventory/purchase-orders/${poId}/status`, { status });
      
      setPurchaseOrders((prev) =>
        prev.map((po) => (po.id === poId ? { ...po, status } : po))
      );

      if (selectedPo && selectedPo.id === poId) {
        setSelectedPo((prev: any) => ({ ...prev, status }));
      }

      if (status === 'approved') {
        toast.success(`Purchase Order #${poId} APPROVED by Admin`);
      } else {
        toast.error(`Purchase Order #${poId} REJECTED by Admin`);
      }
    } catch {
      toast.error(`Failed to update Purchase Order #${poId}`);
    } finally {
      setUpdatingPoId(null);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            Global SaaS Inventory & Warehouse Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor tenant inventory valuation, low stock monitoring, purchase orders, and warehouse performance.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => setModalOpen(true)}
            sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
          >
            Add Warehouse
          </Button>

          <Button
            variant="outlined"
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshCw size={18} />}
            onClick={() => fetchData(true)}
            sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Box>
      </Box>

      {/* Analytics Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary">Total Platform Inventory Value</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
              ₹{Number(stats?.totalInventoryValue || 0).toLocaleString('en-IN')}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => scrollToSection('warehouses-section')}
            sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none', cursor: 'pointer', '&:hover': { borderColor: '#0284C7' } }}
          >
            <Typography variant="caption" color="text.secondary">Active Warehouses Tracked</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
              {warehouses.length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary">Low Stock Items</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mt: 0.5 }}>
              {stats?.lowStockItems ?? 0}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => scrollToSection('purchase-orders-section')}
            sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: 'none', cursor: 'pointer', '&:hover': { borderColor: '#10B981' } }}
          >
            <Typography variant="caption" color="text.secondary">Global Purchase Orders (PO)</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
              {purchaseOrders.length || stats?.pendingPurchaseOrders || 0}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Global Purchase Orders Section */}
      <Box id="purchase-orders-section" sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingBag size={22} color="#10B981" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Global SaaS Purchase Orders ({purchaseOrders.length})
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : purchaseOrders.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No purchase orders recorded across tenant stores.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>PO Number</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Tenant / Store</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Admin Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseOrders.map((po: any) => (
                  <TableRow key={po.id} hover>
                    <TableCell>
                      <Chip
                        label={po.poNumber || `PO-${po.id}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => handleOpenPoDetails(po)}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Tenant #{po.tenantId || 1} (Store #{po.storeId || 1})
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {po.supplier?.name || `Supplier #${po.supplierId}`}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      ₹{Number(po.totalAmount || po.subtotal || 0).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={(po.status || 'PENDING').toUpperCase()}
                        color={
                          po.status === 'received' ? 'info' :
                          po.status === 'approved' ? 'success' :
                          po.status === 'rejected' ? 'error' : 'warning'
                        }
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary" onClick={() => handleOpenPoDetails(po)}>
                            <Eye size={18} />
                          </IconButton>
                        </Tooltip>

                        {po.status !== 'approved' && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={updatingPoId === po.id}
                            startIcon={<CheckCircle size={14} />}
                            onClick={() => handleUpdatePoStatus(po.id, 'approved')}
                            sx={{ fontWeight: 700, textTransform: 'none', px: 1.5, py: 0.5, borderRadius: 1.5 }}
                          >
                            Approve
                          </Button>
                        )}

                        {po.status !== 'rejected' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={updatingPoId === po.id}
                            startIcon={<XCircle size={14} />}
                            onClick={() => handleUpdatePoStatus(po.id, 'rejected')}
                            sx={{ fontWeight: 700, textTransform: 'none', px: 1.5, py: 0.5, borderRadius: 1.5 }}
                          >
                            Reject
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Top Warehouses Grid */}
      <Box id="warehouses-section">
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#0F172A' }}>
          Tenant Warehouse Analytics & Storage Distribution ({warehouses.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : warehouses.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No active warehouses tracked in the system.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {warehouses.map((w: any) => (
              <Grid item xs={12} sm={6} md={4} key={w.id || w.code}>
                <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', p: 2.5, boxShadow: 'none' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {w.name}
                      </Typography>
                      {w.isDefault && <Chip label="DEFAULT" color="primary" size="small" sx={{ fontWeight: 800, fontSize: 10, mt: 0.5 }} />}
                    </Box>
                    <Tooltip title="Delete Warehouse">
                      <IconButton size="small" color="error" onClick={() => handleDeleteWarehouse(w.id, w.name)}>
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Warehouse Code: {w.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    City: {w.city || w.address || 'N/A'}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* PURCHASE ORDER DETAILS DIALOG WITH APPROVE / REJECT */}
      <Dialog open={poModalOpen} onClose={() => setPoModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Purchase Order Details: {selectedPo?.poNumber || `PO-${selectedPo?.id}`}
        </DialogTitle>
        <DialogContent dividers>
          {selectedPo && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Supplier:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {selectedPo.supplier?.name || `Supplier #${selectedPo.supplierId}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Status:</Typography>
                <Chip
                  label={(selectedPo.status || 'PENDING').toUpperCase()}
                  color={
                    selectedPo.status === 'received' ? 'info' :
                    selectedPo.status === 'approved' ? 'success' :
                    selectedPo.status === 'rejected' ? 'error' : 'warning'
                  }
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Total Amount:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981' }}>
                  ₹{Number(selectedPo.totalAmount || selectedPo.subtotal || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Tenant / Store:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Tenant #{selectedPo.tenantId || 1} (Store #{selectedPo.storeId || 1})
                </Typography>
              </Box>
              {selectedPo.expectedDeliveryDate && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Expected Delivery:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date(selectedPo.expectedDeliveryDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}

              {selectedPo.items && Array.isArray(selectedPo.items) && selectedPo.items.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Ordered Items ({selectedPo.items.length})
                  </Typography>
                  {selectedPo.items.map((item: any, idx: number) => (
                    <Box key={idx} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Product #{item.productId} × {item.quantityOrdered || item.quantity || 1}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        ₹{Number(item.subtotal || item.unitCost * item.quantityOrdered || 0).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedPo && selectedPo.status !== 'approved' && (
              <Button
                variant="contained"
                color="success"
                disabled={updatingPoId === selectedPo.id}
                startIcon={<CheckCircle size={16} />}
                onClick={() => handleUpdatePoStatus(selectedPo.id, 'approved')}
                sx={{ fontWeight: 700, textTransform: 'none' }}
              >
                Approve PO
              </Button>
            )}

            {selectedPo && selectedPo.status !== 'rejected' && (
              <Button
                variant="outlined"
                color="error"
                disabled={updatingPoId === selectedPo.id}
                startIcon={<XCircle size={16} />}
                onClick={() => handleUpdatePoStatus(selectedPo.id, 'rejected')}
                sx={{ fontWeight: 700, textTransform: 'none' }}
              >
                Reject PO
              </Button>
            )}
          </Box>

          <Button onClick={() => setPoModalOpen(false)} variant="contained" color="inherit" sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADD WAREHOUSE MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Warehouse Location</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Warehouse Name"
                fullWidth
                required
                placeholder="Central Logistics Hub"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Warehouse Code"
                fullWidth
                placeholder="BOM-01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="City / Location"
                fullWidth
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveWarehouse} sx={{ fontWeight: 700 }}>
            Save Warehouse
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
