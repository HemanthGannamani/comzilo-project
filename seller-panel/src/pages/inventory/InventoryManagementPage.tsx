import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageLoader } from '../../components/common/PageLoader';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Warehouse as WarehouseIcon,
  MapPin,
  TrendingUp,
  Plus,
  ArrowRightLeft,
  Sliders,
  UsersRound,
  FileCheck,
  FileSpreadsheet,
  QrCode,
  Barcode as BarcodeIcon,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Search,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
} from 'lucide-react';

interface InventoryManagementPageProps {
  defaultTab?: number;
}

export const InventoryManagementPage: React.FC<InventoryManagementPageProps> = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = (): number => {
    if (defaultTab !== undefined) return defaultTab;
    const path = location.pathname;
    if (path.includes('/dashboard')) return 0;
    if (path.includes('/warehouses')) return 1;
    if (path.includes('/locations')) return 2;
    if (path.includes('/balances') || path.includes('/stock-balances')) return 3;
    if (path.includes('/stock-management')) return 4;
    if (path.includes('/transfers') || path.includes('/stock-transfers')) return 5;
    if (path.includes('/adjustments') || path.includes('/stock-adjustments')) return 6;
    if (path.includes('/suppliers')) return 7;
    if (path.includes('/purchase-orders')) return 8;
    if (path.includes('/grn') || path.includes('/goods-receipt')) return 9;
    if (path.includes('/gin') || path.includes('/goods-issue')) return 10;
    if (path.includes('/barcode')) return 11;
    if (path.includes('/serials') || path.includes('/serial-numbers')) return 12;
    if (path.includes('/batches') || path.includes('/batch-management')) return 13;
    if (path.includes('/expiry')) return 14;
    if (path.includes('/reports') || path.includes('/low-stock')) return 15;
    return 0;
  };

  const [tabIndex, setTabIndex] = useState<number>(getInitialTab);

  useEffect(() => {
    setTabIndex(getInitialTab());
  }, [location.pathname, defaultTab]);

  const handleTabChange = (_: any, newIndex: number) => {
    setTabIndex(newIndex);
    const routes = [
      '/inventory/dashboard',
      '/inventory/warehouses',
      '/inventory/locations',
      '/inventory/balances',
      '/inventory/stock-management',
      '/inventory/transfers',
      '/inventory/adjustments',
      '/inventory/suppliers',
      '/inventory/purchase-orders',
      '/inventory/grn',
      '/inventory/gin',
      '/inventory/barcode',
      '/inventory/serials',
      '/inventory/batches',
      '/inventory/expiry',
      '/inventory/reports',
    ];
    if (routes[newIndex]) {
      navigate(routes[newIndex]);
    }
  };

  const [stats, setStats] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [grns, setGrns] = useState<any[]>([]);
  const [gins, setGins] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [serials, setSerials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Supplier CRUD Modal State
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    code: '',
    companyName: '',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
  });

  const fetchAllData = async () => {
    try {
      const [
        dashRes,
        whRes,
        locRes,
        balRes,
        trfRes,
        adjRes,
        supRes,
        poRes,
        grnRes,
        ginRes,
        batRes,
        serRes,
      ] = await Promise.allSettled([
        axiosInstance.get('/store/inventory-management/dashboard'),
        axiosInstance.get('/store/inventory-management/warehouses'),
        axiosInstance.get('/store/inventory-management/locations'),
        axiosInstance.get('/store/inventory-management/balances'),
        axiosInstance.get('/store/inventory-management/transfers'),
        axiosInstance.get('/store/inventory-management/adjustments'),
        axiosInstance.get('/store/inventory-management/suppliers'),
        axiosInstance.get('/store/inventory-management/purchase-orders'),
        axiosInstance.get('/store/inventory-management/goods-receipts'),
        axiosInstance.get('/store/inventory-management/goods-issues'),
        axiosInstance.get('/store/inventory-management/batches'),
        axiosInstance.get('/store/inventory-management/serials'),
      ]);

      if (dashRes.status === 'fulfilled') setStats(dashRes.value.data.data || null);
      if (whRes.status === 'fulfilled') setWarehouses(whRes.value.data.data || []);
      if (locRes.status === 'fulfilled') setLocations(locRes.value.data.data || []);
      if (balRes.status === 'fulfilled') setBalances(balRes.value.data.data || []);
      if (trfRes.status === 'fulfilled') setTransfers(trfRes.value.data.data || []);
      if (adjRes.status === 'fulfilled') setAdjustments(adjRes.value.data.data || []);
      if (supRes.status === 'fulfilled') setSuppliers(supRes.value.data.data || []);
      if (poRes.status === 'fulfilled') setPurchaseOrders(poRes.value.data.data || []);
      if (grnRes.status === 'fulfilled') setGrns(grnRes.value.data.data || []);
      if (ginRes.status === 'fulfilled') setGins(ginRes.value.data.data || []);
      if (batRes.status === 'fulfilled') setBatches(batRes.value.data.data || []);
      if (serRes.status === 'fulfilled') setSerials(serRes.value.data.data || []);
    } catch {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenSupplierModal = (sup?: any) => {
    if (sup) {
      setEditingSupplier(sup);
      setSupplierForm({
        name: sup.name || '',
        code: sup.code || '',
        companyName: sup.companyName || '',
        email: sup.email || '',
        phone: sup.phone || '',
        gstNumber: sup.gstNumber || '',
        address: sup.address || '',
      });
    } else {
      setEditingSupplier(null);
      setSupplierForm({
        name: '',
        code: '',
        companyName: '',
        email: '',
        phone: '',
        gstNumber: '',
        address: '',
      });
    }
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = async () => {
    if (!supplierForm.name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    try {
      if (editingSupplier) {
        const res = await axiosInstance.put(
          `/store/inventory-management/suppliers/${editingSupplier.id}`,
          supplierForm
        );
        toast.success('Supplier updated successfully');
        setSuppliers(suppliers.map((s) => (s.id === editingSupplier.id ? res.data.data : s)));
      } else {
        const res = await axiosInstance.post('/store/inventory-management/suppliers', supplierForm);
        toast.success('Supplier created successfully');
        setSuppliers([res.data.data, ...suppliers]);
      }
      setSupplierModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save supplier');
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await axiosInstance.delete(`/store/inventory-management/suppliers/${id}`);
      toast.success('Supplier deleted successfully');
      setSuppliers(suppliers.filter((s) => s.id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete supplier');
    }
  };

  const filteredSuppliers = suppliers.filter((s: any) => {
    const q = supplierSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.code && s.code.toLowerCase().includes(q)) ||
      (s.companyName && s.companyName.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.phone && s.phone.toLowerCase().includes(q)) ||
      (s.gstNumber && s.gstNumber.toLowerCase().includes(q))
    );
  });

  if (loading) return <PageLoader message="Loading Enterprise Inventory Management..." />;

  return (
    <PageContainer
      title="Enterprise Inventory & Stock Control"
      subtitle="Multi-warehouse stock tracking, GRN/GIN, transfers, suppliers, purchase orders, batches & serial numbers"
    >
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Inventory Dashboard" icon={<TrendingUp size={18} />} iconPosition="start" />
          <Tab label="Warehouses" icon={<WarehouseIcon size={18} />} iconPosition="start" />
          <Tab label="Locations" icon={<MapPin size={18} />} iconPosition="start" />
          <Tab label="Stock Balances" icon={<Boxes size={18} />} iconPosition="start" />
          <Tab label="Stock Management" icon={<Layers size={18} />} iconPosition="start" />
          <Tab label="Stock Transfers" icon={<ArrowRightLeft size={18} />} iconPosition="start" />
          <Tab label="Stock Adjustments" icon={<Sliders size={18} />} iconPosition="start" />
          <Tab label="Suppliers" icon={<UsersRound size={18} />} iconPosition="start" />
          <Tab label="Purchase Orders" icon={<FileSpreadsheet size={18} />} iconPosition="start" />
          <Tab label="Goods Receipt (GRN)" icon={<FileCheck size={18} />} iconPosition="start" />
          <Tab label="Goods Issue (GIN)" icon={<FileText size={18} />} iconPosition="start" />
          <Tab label="Barcode" icon={<BarcodeIcon size={18} />} iconPosition="start" />
          <Tab label="Serial Numbers" icon={<QrCode size={18} />} iconPosition="start" />
          <Tab label="Batch Management" icon={<Layers size={18} />} iconPosition="start" />
          <Tab label="Expiry Management" icon={<Calendar size={18} />} iconPosition="start" />
          <Tab label="Reports & Alerts" icon={<AlertTriangle size={18} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* TAB 0: DASHBOARD */}
      {tabIndex === 0 && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Total Stock Valuation</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.5 }}>
                  ₹{stats?.totalInventoryValue || '1,250,000'}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Total Active Warehouses</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                  {stats?.totalWarehouses || warehouses.length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Low Stock Items</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mt: 0.5 }}>
                  {stats?.lowStockItems || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Total Suppliers</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
                  {suppliers.length}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* TAB 1: WAREHOUSES */}
      {tabIndex === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Warehouses</Typography>
          </Box>
          <Grid container spacing={2}>
            {warehouses.map((w: any) => (
              <Grid item xs={12} sm={6} key={w.id || w.code}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{w.name}</Typography>
                    {w.isDefault && <Chip label="PRIMARY" color="primary" size="small" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">Code: {w.code} | City: {w.city || 'N/A'}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* TAB 3: STOCK BALANCES */}
      {tabIndex === 3 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Live Stock Balances & Valuation</Typography>
          {balances.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No stock balances recorded. Perform a GRN or adjustment.</Typography>
          ) : (
            <Grid container spacing={2}>
              {balances.map((b: any) => (
                <Grid item xs={12} sm={4} key={b.id}>
                  <Card sx={{ p: 2, border: '1px solid #E2E8F0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{b.product?.name || `Product #${b.productId}`}</Typography>
                    <Typography variant="body2">On Hand: {b.onHandQuantity} units</Typography>
                    <Typography variant="body2" color="text.secondary">Available: {b.availableQuantity}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* TAB 7: SUPPLIERS */}
      {tabIndex === 7 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Supplier & Vendor Directory</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage raw material vendors, purchase orders, and GST compliance details.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenSupplierModal()}
              sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
            >
              Create Supplier
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              size="small"
              placeholder="Search suppliers by name, code, company, email, phone, GST..."
              value={supplierSearch}
              onChange={(e) => setSupplierSearch(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 500 }}
            />
          </Box>

          {filteredSuppliers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <UsersRound size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No suppliers found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {supplierSearch
                  ? 'No vendor matches your search criteria. Try a different query.'
                  : 'Start by creating your first supplier to issue Purchase Orders and Goods Receipt Notes.'}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => handleOpenSupplierModal()}
                sx={{ borderRadius: 2, fontWeight: 700 }}
              >
                Create Supplier
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Supplier Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Company Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Contact Details</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>GST / Tax ID</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSuppliers.map((sup: any) => (
                    <TableRow key={sup.id} hover>
                      <TableCell>
                        <Chip label={sup.code || `SUP-${sup.id}`} size="small" variant="outlined" color="primary" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#0F172A' }}>{sup.name}</TableCell>
                      <TableCell>{sup.companyName || 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {sup.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Mail size={14} color="#64748B" />
                              <Typography variant="caption">{sup.email}</Typography>
                            </Box>
                          )}
                          {sup.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone size={14} color="#64748B" />
                              <Typography variant="caption">{sup.phone}</Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{sup.gstNumber || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Supplier">
                          <IconButton size="small" onClick={() => handleOpenSupplierModal(sup)} color="primary">
                            <Edit2 size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Supplier">
                          <IconButton size="small" onClick={() => handleDeleteSupplier(sup.id)} color="error">
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* CREATE / EDIT SUPPLIER DIALOG */}
      <Dialog open={supplierModalOpen} onClose={() => setSupplierModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingSupplier ? 'Edit Supplier Details' : 'Create New Supplier'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier Name"
                fullWidth
                required
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier Code (Optional)"
                placeholder="e.g. SUP-001"
                fullWidth
                value={supplierForm.code}
                onChange={(e) => setSupplierForm({ ...supplierForm, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                fullWidth
                value={supplierForm.companyName}
                onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="GST Number / Tax ID"
                placeholder="e.g. 36AAAAA0000A1Z5"
                fullWidth
                value={supplierForm.gstNumber}
                onChange={(e) => setSupplierForm({ ...supplierForm, gstNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Billing / Office Address"
                multiline
                rows={3}
                fullWidth
                value={supplierForm.address}
                onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSupplierModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSupplier} sx={{ px: 3, fontWeight: 700 }}>
            {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
