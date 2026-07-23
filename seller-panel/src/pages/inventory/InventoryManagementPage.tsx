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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
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
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
  Download,
  CheckCircle2,
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
  const [products, setProducts] = useState<any[]>([]);
  const [grns, setGrns] = useState<any[]>([]);
  const [gins, setGins] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [serials, setSerials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Warehouse Location Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationForm, setLocationForm] = useState({
    warehouseId: '',
    name: '',
    code: '',
    aisle: 'A1',
    rack: 'R01',
    shelf: 'S01',
    bin: 'B01',
    zone: 'General Storage',
  });

  // Modals & Forms State
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

  const [poModalOpen, setPoModalOpen] = useState(false);
  const [viewPoModalOpen, setViewPoModalOpen] = useState(false);
  const [selectedPo, setSelectedPo] = useState<any>(null);
  const [poSearch, setPoSearch] = useState('');
  const [poForm, setPoForm] = useState({
    supplierId: '',
    warehouseId: '',
    productId: '',
    quantity: 100,
    unitPrice: 50.0,
    expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
  });

  const [adjModalOpen, setAdjModalOpen] = useState(false);
  const [adjSearch, setAdjSearch] = useState('');
  const [adjWarehouseFilter, setAdjWarehouseFilter] = useState('all');
  const [adjTypeFilter, setAdjTypeFilter] = useState('all');
  const [adjForm, setAdjForm] = useState({
    warehouseId: '',
    productId: '',
    type: 'increase',
    quantity: 10,
    reasonCode: 'AUDIT',
    reason: '',
  });

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    sourceWarehouseId: '',
    destinationWarehouseId: '',
    productId: '',
    quantity: 20,
    notes: 'Warehouse reallocation',
  });

  // Barcode State
  const [selectedBarcodeSku, setSelectedBarcodeSku] = useState('SKU-88492019');

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
        prodRes,
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
        axiosInstance.get('/products'),
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
      if (prodRes.status === 'fulfilled') {
        const raw = prodRes.value.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.rows || raw?.items || raw?.products || []);
        setProducts(list);
      }
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

  // WAREHOUSE LOCATION HANDLERS
  const handleOpenLocationModal = () => {
    setLocationForm({
      warehouseId: warehouses.length > 0 ? String(warehouses[0].id) : '1',
      name: 'Aisle 1 Rack 2 Bin 5',
      code: `LOC-${Date.now().toString().slice(-4)}`,
      aisle: 'A1',
      rack: 'R02',
      shelf: 'S01',
      bin: 'B05',
      zone: 'Fast Moving',
    });
    setLocationModalOpen(true);
  };

  const handleSaveLocation = async () => {
    if (!locationForm.name || !locationForm.warehouseId) {
      toast.error('Warehouse and Location Name are required');
      return;
    }

    try {
      const res = await axiosInstance.post('/store/inventory-management/locations', {
        warehouseId: Number(locationForm.warehouseId),
        name: locationForm.name,
        code: locationForm.code,
        aisle: locationForm.aisle,
        rack: locationForm.rack,
        shelf: locationForm.shelf,
        bin: locationForm.bin,
        zone: locationForm.zone,
      });
      toast.success('Warehouse location created successfully');
      setLocations([res.data.data, ...locations]);
      setLocationModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create warehouse location');
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;
    try {
      await axiosInstance.delete(`/store/inventory-management/locations/${id}`);
      toast.success('Location deleted successfully');
      setLocations(locations.filter((l) => l.id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete location');
    }
  };

  // TRANSFER HANDLERS
  const handleOpenTransferModal = () => {
    setTransferForm({
      sourceWarehouseId: warehouses.length > 0 ? String(warehouses[0].id) : '1',
      destinationWarehouseId: warehouses.length > 1 ? String(warehouses[1].id) : '1',
      productId: products.length > 0 ? String(products[0].id) : '1',
      quantity: 20,
      notes: 'Inter-warehouse stock reallocation',
    });
    setTransferModalOpen(true);
  };

  const handleSaveTransfer = async () => {
    if (transferForm.sourceWarehouseId === transferForm.destinationWarehouseId) {
      toast.error('Source and Destination warehouses must be different');
      return;
    }
    try {
      const res = await axiosInstance.post('/store/inventory-management/transfers', {
        sourceWarehouseId: Number(transferForm.sourceWarehouseId),
        destinationWarehouseId: Number(transferForm.destinationWarehouseId),
        items: [
          {
            productId: Number(transferForm.productId),
            quantity: Number(transferForm.quantity),
          },
        ],
        notes: transferForm.notes,
      });
      toast.success('Stock transfer executed successfully');
      setTransfers([res.data.data, ...transfers]);
      setTransferModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to execute stock transfer');
    }
  };

  // SUPPLIER HANDLERS
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

  // PURCHASE ORDER HANDLERS
  const handleOpenPoModal = () => {
    setPoForm({
      supplierId: suppliers.length > 0 ? String(suppliers[0].id) : '',
      warehouseId: warehouses.length > 0 ? String(warehouses[0].id) : '1',
      productId: products.length > 0 ? String(products[0].id) : '1',
      quantity: 100,
      unitPrice: 50.0,
      expectedDeliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    });
    setPoModalOpen(true);
  };

  const handleSavePo = async () => {
    if (!poForm.supplierId) {
      toast.error('Please select a supplier');
      return;
    }
    const totalAmount = Number(poForm.quantity) * Number(poForm.unitPrice);
    const payload = {
      supplierId: Number(poForm.supplierId),
      warehouseId: Number(poForm.warehouseId || 1),
      totalAmount,
      subtotal: totalAmount,
      expectedDeliveryDate: poForm.expectedDeliveryDate,
      items: [
        {
          productId: Number(poForm.productId || 1),
          quantity: Number(poForm.quantity),
          unitPrice: Number(poForm.unitPrice),
        },
      ],
    };
    try {
      const res = await axiosInstance.post('/store/inventory-management/purchase-orders', payload);
      toast.success('Purchase Order created successfully');
      setPurchaseOrders([res.data.data, ...purchaseOrders]);
      setPoModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create Purchase Order');
    }
  };

  const handleDeletePo = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this Purchase Order?')) return;
    try {
      await axiosInstance.delete(`/store/inventory-management/purchase-orders/${id}`);
      toast.success('Purchase Order deleted successfully');
      setPurchaseOrders(purchaseOrders.filter((po) => po.id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete Purchase Order');
    }
  };

  // ADJUSTMENT HANDLERS
  const handleOpenAdjModal = () => {
    setAdjForm({
      warehouseId: warehouses.length > 0 ? String(warehouses[0].id) : '1',
      productId: products.length > 0 ? String(products[0].id) : '1',
      type: 'increase',
      quantity: 10,
      reasonCode: 'AUDIT',
      reason: 'Physical count adjustment',
    });
    setAdjModalOpen(true);
  };

  const handleSaveAdjustment = async () => {
    if (!adjForm.warehouseId || !adjForm.productId) {
      toast.error('Warehouse and Product selection are required');
      return;
    }
    if (Number(adjForm.quantity) <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    const payload = {
      warehouseId: Number(adjForm.warehouseId),
      productId: Number(adjForm.productId),
      type: adjForm.type,
      quantity: Number(adjForm.quantity),
      reasonCode: adjForm.reasonCode,
      reason: adjForm.reason || `${adjForm.type === 'increase' ? 'Increase' : 'Decrease'} adjustment`,
    };
    try {
      const res = await axiosInstance.post('/store/inventory-management/adjustments', payload);
      toast.success('Stock adjustment created successfully');
      setAdjustments([res.data.data, ...adjustments]);
      setAdjModalOpen(false);
      const balRes = await axiosInstance.get('/store/inventory-management/balances');
      setBalances(balRes.data.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create stock adjustment');
    }
  };

  const handleDeleteAdjustment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this stock adjustment?')) return;
    try {
      await axiosInstance.delete(`/store/inventory-management/adjustments/${id}`);
      toast.success('Stock adjustment deleted successfully');
      setAdjustments(adjustments.filter((adj) => adj.id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete stock adjustment');
    }
  };

  // EXPORT CSV HANDLER
  const handleExportCsv = () => {
    if (balances.length === 0) {
      toast.error('No stock balance data to export');
      return;
    }
    let csv = 'Product ID,Product Name,Warehouse ID,On Hand Qty,Available Qty,Reserved Qty,Unit Cost (INR),Total Valuation (INR)\n';
    balances.forEach((b: any) => {
      const qty = Number(b.onHandQuantity || b.quantityOnHand || 0);
      const cost = Number(b.unitCost || b.averageCost || 100);
      csv += `"${b.productId}","${b.product?.name || 'Product #' + b.productId}","${b.warehouseId}","${qty}","${b.availableQuantity || 0}","${b.quantityReserved || 0}","${cost}","${qty * cost}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Inventory_Valuation_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Inventory valuation CSV report downloaded');
  };

  // Calculate live totals from database
  const liveValuationSum = balances.reduce((sum, b) => {
    const qty = Number(b.onHandQuantity || b.quantityOnHand || 0);
    const cost = Number(b.unitCost || b.averageCost || 100);
    return sum + qty * cost;
  }, 0);

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
                  ₹{liveValuationSum > 0 ? liveValuationSum.toLocaleString() : (stats?.totalInventoryValue || '0')}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Fulfillment Warehouses</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                  {warehouses.length}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Low Stock SKUs</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mt: 0.5 }}>
                  {stats?.lowStockItems || 0}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Active Suppliers</Typography>
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
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Fulfillment Warehouses</Typography>
          </Box>
          {warehouses.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <WarehouseIcon size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No active warehouses registered
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {warehouses.map((w: any) => (
                <Grid item xs={12} sm={6} key={w.id || w.code}>
                  <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{w.name}</Typography>
                      {w.isDefault && <Chip label="PRIMARY" color="primary" size="small" />}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Code: {w.code} | City: {w.city || 'Default Location'}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* TAB 2: WAREHOUSE LOCATIONS */}
      {tabIndex === 2 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Warehouse Bin Locations</Typography>
              <Typography variant="body2" color="text.secondary">Aisle, Rack, Shelf, and Bin level location mappings</Typography>
            </Box>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenLocationModal}>
              Create Location
            </Button>
          </Box>
          {locations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <MapPin size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No bin locations created yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Map your physical warehouse aisles, racks, and shelf bins to track precise item locations.
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenLocationModal}>
                Create Location
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Location Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Warehouse ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Zone</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locations.map((loc: any) => (
                    <TableRow key={loc.id} hover>
                      <TableCell>
                        <Chip label={loc.code || `LOC-${loc.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{loc.name}</TableCell>
                      <TableCell>Warehouse #{loc.warehouseId}</TableCell>
                      <TableCell>{loc.zone || 'General Storage'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleDeleteLocation(loc.id)} color="error">
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 3: STOCK BALANCES */}
      {tabIndex === 3 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Live Stock Balances & Valuation</Typography>
            <Button variant="outlined" startIcon={<Plus size={18} />} onClick={handleOpenAdjModal}>
              Record Stock Adjustment
            </Button>
          </Box>
          {balances.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Boxes size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No stock balance records found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Perform a Stock Adjustment or Goods Receipt (GRN) to populate live stock inventory balances.
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdjModal}>
                Record Stock Adjustment
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product ID / Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Warehouse</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>On Hand Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Available Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Reserved Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Valuation (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {balances.map((b: any) => {
                    const qty = Number(b.onHandQuantity || b.quantityOnHand || 0);
                    const cost = Number(b.unitCost || b.averageCost || 100);
                    return (
                      <TableRow key={b.id} hover>
                        <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {b.product?.name || `Product #${b.productId}`}
                        </TableCell>
                        <TableCell>Warehouse #{b.warehouseId}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#0284C7' }}>{qty} units</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#10B981' }}>{b.availableQuantity || qty} units</TableCell>
                        <TableCell sx={{ color: '#F59E0B' }}>{b.quantityReserved || 0} units</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>₹{(qty * cost).toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 4: CENTRAL STOCK MANAGEMENT */}
      {tabIndex === 4 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Central Stock Operations & Control</Typography>
              <Typography variant="body2" color="text.secondary">Real-time inventory levels across all fulfillment centers</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdjModal}>Stock Adjustment</Button>
              <Button variant="outlined" startIcon={<ArrowRightLeft size={18} />} onClick={handleOpenTransferModal}>Stock Transfer</Button>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                <Typography variant="subtitle2" color="text.secondary">Active Product SKUs</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{products.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                <Typography variant="subtitle2" color="text.secondary">Transfers Recorded</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{transfers.length}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ p: 2.5, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                <Typography variant="subtitle2" color="text.secondary">Adjustments Recorded</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>{adjustments.length}</Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* TAB 5: STOCK TRANSFERS */}
      {tabIndex === 5 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Inter-Warehouse Stock Transfers</Typography>
              <Typography variant="body2" color="text.secondary">Move inventory between regional distribution hubs</Typography>
            </Box>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenTransferModal}>
              New Stock Transfer
            </Button>
          </Box>
          {transfers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <ArrowRightLeft size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No stock transfers recorded
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenTransferModal} sx={{ mt: 2 }}>
                New Stock Transfer
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Transfer #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Source Warehouse</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Destination Warehouse</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Notes / Reason</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transfers.map((trf: any) => (
                    <TableRow key={trf.id} hover>
                      <TableCell><Chip label={trf.transferNumber || `TRF-${trf.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>Warehouse #{trf.sourceWarehouseId}</TableCell>
                      <TableCell>Warehouse #{trf.destinationWarehouseId}</TableCell>
                      <TableCell>{trf.notes || 'Stock Reallocation'}</TableCell>
                      <TableCell><Chip label="COMPLETED" color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 6: STOCK ADJUSTMENTS */}
      {tabIndex === 6 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Stock Adjustments & Reconciliation</Typography>
              <Typography variant="body2" color="text.secondary">Record physical stock count reconciliations or damage write-offs</Typography>
            </Box>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdjModal}>
              Create Stock Adjustment
            </Button>
          </Box>
          {adjustments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Sliders size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No stock adjustments recorded
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdjModal} sx={{ mt: 2 }}>
                Create Stock Adjustment
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Adjustment #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Product ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Warehouse ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type & Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Reason Code</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adjustments.map((adj: any) => {
                    const isIncrease = adj.adjustmentType === 'increase' || adj.quantity > 0;
                    return (
                      <TableRow key={adj.id} hover>
                        <TableCell><Chip label={adj.adjustmentNumber || `ADJ-${adj.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                        <TableCell>Product #{adj.productId}</TableCell>
                        <TableCell>Warehouse #{adj.warehouseId}</TableCell>
                        <TableCell>
                          <Chip
                            icon={isIncrease ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            label={`${isIncrease ? '+' : ''}${adj.quantity} ${isIncrease ? 'Increase' : 'Decrease'}`}
                            color={isIncrease ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{adj.reasonCode || 'AUDIT'}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleDeleteAdjustment(adj.id)} color="error">
                            <Trash2 size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 7: SUPPLIERS */}
      {tabIndex === 7 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Supplier & Vendor Directory</Typography>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpenSupplierModal()}>
              Create Supplier
            </Button>
          </Box>
          {suppliers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <UsersRound size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No suppliers created yet
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpenSupplierModal()} sx={{ mt: 2 }}>
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
                    <TableCell sx={{ fontWeight: 700 }}>GST / Tax ID</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.map((sup: any) => (
                    <TableRow key={sup.id} hover>
                      <TableCell><Chip label={sup.code || `SUP-${sup.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{sup.name}</TableCell>
                      <TableCell>{sup.companyName || 'N/A'}</TableCell>
                      <TableCell>{sup.gstNumber || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleDeleteSupplier(sup.id)} color="error">
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 8: PURCHASE ORDERS */}
      {tabIndex === 8 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Purchase Orders (PO)</Typography>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenPoModal}>
              Create Purchase Order
            </Button>
          </Box>
          {purchaseOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <FileSpreadsheet size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No purchase orders issued yet
              </Typography>
              <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenPoModal} sx={{ mt: 2 }}>
                Create Purchase Order
              </Button>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>PO Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Supplier</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.map((po: any) => (
                    <TableRow key={po.id} hover>
                      <TableCell><Chip label={po.poNumber || `PO-${po.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{po.supplier?.name || `Supplier #${po.supplierId}`}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>₹{Number(po.totalAmount || po.subtotal || 0).toLocaleString()}</TableCell>
                      <TableCell><Chip label="APPROVED" color="info" size="small" /></TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleDeletePo(po.id)} color="error">
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 9: GOODS RECEIPT (GRN) */}
      {tabIndex === 9 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Goods Receipt Notes (GRN)</Typography>
          </Box>
          {grns.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <FileCheck size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No goods receipt notes recorded
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>GRN #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>PO Reference</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Warehouse ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grns.map((grn: any) => (
                    <TableRow key={grn.id} hover>
                      <TableCell><Chip label={grn.grnNumber || `GRN-${grn.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>PO #{grn.poId || 'N/A'}</TableCell>
                      <TableCell>Warehouse #{grn.warehouseId}</TableCell>
                      <TableCell><Chip label="RECEIVED" color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 10: GOODS ISSUE (GIN) */}
      {tabIndex === 10 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Goods Issue Notes (GIN)</Typography>
          </Box>
          {gins.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <FileText size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No goods issue notes recorded
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>GIN #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Order Reference</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Warehouse ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gins.map((gin: any) => (
                    <TableRow key={gin.id} hover>
                      <TableCell><Chip label={gin.ginNumber || `GIN-${gin.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>{gin.referenceOrder || 'N/A'}</TableCell>
                      <TableCell>Warehouse #{gin.warehouseId}</TableCell>
                      <TableCell><Chip label="DISPATCHED" color="info" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 11: BARCODE */}
      {tabIndex === 11 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Barcode & QR Code Generator</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Generate and print SKU Barcodes (CODE128) and QR labels</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Label Configuration</Typography>
                <TextField
                  label="Product SKU / Barcode Data"
                  fullWidth
                  value={selectedBarcodeSku}
                  onChange={(e) => setSelectedBarcodeSku(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <Box sx={{ textAlign: 'center', p: 3, border: '1px dashed #94A3B8', borderRadius: 2, bgcolor: '#FFFFFF', mb: 3 }}>
                  <Box sx={{ letterSpacing: 6, fontSize: 32, fontFamily: 'monospace', fontWeight: 'bold' }}>
                    |||| ||| ||||| |||| ||
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1 }}>{selectedBarcodeSku}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" startIcon={<Printer size={18} />} onClick={() => window.print()}>
                    Print Barcode Labels
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* TAB 12: SERIAL NUMBERS */}
      {tabIndex === 12 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Serialized Item Tracking</Typography>
          {serials.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <QrCode size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No serial numbers tracked
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Serial Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Product ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serials.map((ser: any) => (
                    <TableRow key={ser.id} hover>
                      <TableCell><Chip label={ser.serialNumber || `SN-${ser.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>Product #{ser.productId}</TableCell>
                      <TableCell><Chip label={String(ser.status || 'AVAILABLE').toUpperCase()} color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 13: BATCH MANAGEMENT */}
      {tabIndex === 13 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Batch & Lot Management</Typography>
          {batches.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Layers size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No active inventory batches created
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Batch Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Product ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Manufactured Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batches.map((bat: any) => (
                    <TableRow key={bat.id} hover>
                      <TableCell><Chip label={bat.batchNumber || `BAT-${bat.id}`} size="small" color="primary" sx={{ fontWeight: 700 }} /></TableCell>
                      <TableCell>Product #{bat.productId}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{bat.quantity || 0} units</TableCell>
                      <TableCell>{bat.manufacturedDate ? new Date(bat.manufacturedDate).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* TAB 14: EXPIRY MANAGEMENT */}
      {tabIndex === 14 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Expiration Risk Monitor</Typography>
          {batches.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <Calendar size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No batch expiry risks detected
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {batches.map((b: any) => (
                <Grid item xs={12} sm={6} key={b.id}>
                  <Card sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Batch {b.batchNumber}</Typography>
                      <Chip label="LOW RISK" color="success" size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Expiry Date: {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'No Expiry Set'}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* TAB 15: REPORTS & ALERTS */}
      {tabIndex === 15 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Inventory Analytics & Stock Valuation Reports</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 3, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Calculated Inventory Valuation</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                  ₹{liveValuationSum.toLocaleString()}
                </Typography>
                <Button variant="contained" startIcon={<Download size={18} />} onClick={handleExportCsv}>
                  Export Inventory Valuation CSV
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* WAREHOUSE LOCATION DIALOG */}
      <Dialog open={locationModalOpen} onClose={() => setLocationModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Warehouse Location</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Target Warehouse</InputLabel>
                <Select
                  value={locationForm.warehouseId}
                  label="Target Warehouse"
                  onChange={(e) => setLocationForm({ ...locationForm, warehouseId: e.target.value })}
                >
                  {warehouses.map((w: any) => (
                    <MenuItem key={w.id} value={String(w.id)}>
                      {w.name} ({w.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location Name"
                fullWidth
                required
                value={locationForm.name}
                onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location Code"
                fullWidth
                value={locationForm.code}
                onChange={(e) => setLocationForm({ ...locationForm, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Zone / Area"
                fullWidth
                value={locationForm.zone}
                onChange={(e) => setLocationForm({ ...locationForm, zone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setLocationModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLocation} sx={{ px: 3, fontWeight: 700 }}>
            Save Location
          </Button>
        </DialogActions>
      </Dialog>

      {/* STOCK TRANSFER DIALOG */}
      <Dialog open={transferModalOpen} onClose={() => setTransferModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Execute Stock Transfer</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Source Warehouse</InputLabel>
                <Select
                  value={transferForm.sourceWarehouseId}
                  label="Source Warehouse"
                  onChange={(e) => setTransferForm({ ...transferForm, sourceWarehouseId: e.target.value })}
                >
                  {warehouses.map((w: any) => (
                    <MenuItem key={w.id} value={String(w.id)}>
                      {w.name} ({w.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Destination Warehouse</InputLabel>
                <Select
                  value={transferForm.destinationWarehouseId}
                  label="Destination Warehouse"
                  onChange={(e) => setTransferForm({ ...transferForm, destinationWarehouseId: e.target.value })}
                >
                  {warehouses.map((w: any) => (
                    <MenuItem key={w.id} value={String(w.id)}>
                      {w.name} ({w.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Product to Transfer</InputLabel>
                <Select
                  value={transferForm.productId}
                  label="Product to Transfer"
                  onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
                >
                  {products.map((p: any) => (
                    <MenuItem key={p.id} value={String(p.id)}>
                      {p.name} (#{p.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Transfer Quantity"
                type="number"
                fullWidth
                required
                value={transferForm.quantity}
                onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Transfer Notes"
                multiline
                rows={2}
                fullWidth
                value={transferForm.notes}
                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setTransferModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTransfer} sx={{ px: 3, fontWeight: 700 }}>
            Transfer Stock
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE STOCK ADJUSTMENT DIALOG */}
      <Dialog open={adjModalOpen} onClose={() => setAdjModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Stock Adjustment</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Warehouse</InputLabel>
                <Select
                  value={adjForm.warehouseId}
                  label="Warehouse"
                  onChange={(e) => setAdjForm({ ...adjForm, warehouseId: e.target.value })}
                >
                  {warehouses.map((w: any) => (
                    <MenuItem key={w.id} value={String(w.id)}>
                      {w.name} ({w.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Target Product</InputLabel>
                <Select
                  value={adjForm.productId}
                  label="Target Product"
                  onChange={(e) => setAdjForm({ ...adjForm, productId: e.target.value })}
                >
                  {products.map((p: any) => (
                    <MenuItem key={p.id} value={String(p.id)}>
                      {p.name} (#{p.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Adjustment Type</InputLabel>
                <Select
                  value={adjForm.type}
                  label="Adjustment Type"
                  onChange={(e) => setAdjForm({ ...adjForm, type: e.target.value })}
                >
                  <MenuItem value="increase">Increase (+ Stock)</MenuItem>
                  <MenuItem value="decrease">Decrease (- Stock)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Adjustment Quantity"
                type="number"
                fullWidth
                required
                value={adjForm.quantity}
                onChange={(e) => setAdjForm({ ...adjForm, quantity: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Reason Category</InputLabel>
                <Select
                  value={adjForm.reasonCode}
                  label="Reason Category"
                  onChange={(e) => setAdjForm({ ...adjForm, reasonCode: e.target.value })}
                >
                  <MenuItem value="AUDIT">Audit Count Correction</MenuItem>
                  <MenuItem value="DAMAGED">Damaged Goods</MenuItem>
                  <MenuItem value="EXPIRED">Expired Items</MenuItem>
                  <MenuItem value="THEFT">Theft / Unaccounted Loss</MenuItem>
                  <MenuItem value="FOUND">Found Extra Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Adjustment Reason & Notes"
                multiline
                rows={2}
                fullWidth
                placeholder="Explain why stock is being adjusted..."
                value={adjForm.reason}
                onChange={(e) => setAdjForm({ ...adjForm, reason: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAdjModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAdjustment} sx={{ px: 3, fontWeight: 700 }}>
            Execute Adjustment
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* CREATE PURCHASE ORDER DIALOG */}
      <Dialog open={poModalOpen} onClose={() => setPoModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Issue Purchase Order</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Select Supplier / Vendor</InputLabel>
                <Select
                  value={poForm.supplierId}
                  label="Select Supplier / Vendor"
                  onChange={(e) => setPoForm({ ...poForm, supplierId: e.target.value })}
                >
                  {suppliers.map((s: any) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} {s.companyName ? `(${s.companyName})` : ''} - {s.code || `SUP-${s.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Destination Warehouse</InputLabel>
                <Select
                  value={poForm.warehouseId}
                  label="Destination Warehouse"
                  onChange={(e) => setPoForm({ ...poForm, warehouseId: e.target.value })}
                >
                  {warehouses.map((w: any) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name} ({w.city || w.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Expected Delivery Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={poForm.expectedDeliveryDate}
                onChange={(e) => setPoForm({ ...poForm, expectedDeliveryDate: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Ordered Quantity (Units)"
                type="number"
                fullWidth
                value={poForm.quantity}
                onChange={(e) => setPoForm({ ...poForm, quantity: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit Price / Cost (₹)"
                type="number"
                fullWidth
                value={poForm.unitPrice}
                onChange={(e) => setPoForm({ ...poForm, unitPrice: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">Calculated Total Order Cost:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                    ₹{(Number(poForm.quantity) * Number(poForm.unitPrice)).toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setPoModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSavePo} sx={{ px: 3, fontWeight: 700 }}>
            Issue Purchase Order
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
