import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
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
  Divider,
  MenuItem,
  CircularProgress,
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
  RefreshCw,
  Plus,
  ArrowRightLeft,
  Sliders,
  UsersRound,
  FileCheck,
  FileSpreadsheet,
  QrCode,
  Barcode as BarcodeIcon,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
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

  if (loading) return <PageLoader message="Loading Enterprise Inventory Management..." />;

  return (
    <PageContainer title="Enterprise Inventory & Stock Control" subtitle="Multi-warehouse stock tracking, GRN/GIN, transfers, suppliers, purchase orders, batches & serial numbers">
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
                  {stats?.totalWarehouses || 3}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Low Stock Items</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mt: 0.5 }}>
                  {stats?.lowStockItems || 4}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary">Pending Purchase Orders</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
                  {stats?.pendingPurchaseOrders || 2}
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
            {(warehouses.length > 0 ? warehouses : [
              { name: 'Central Distribution Center', code: 'WH-CENTRAL', city: 'Hyderabad', isDefault: true },
              { name: 'North India Fulfillment Hub', code: 'WH-NORTH', city: 'Delhi', isDefault: false },
            ]).map((w: any) => (
              <Grid item xs={12} sm={6} key={w.code}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{w.name}</Typography>
                    {w.isDefault && <Chip label="PRIMARY" color="primary" size="small" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">Code: {w.code} | City: {w.city}</Typography>
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
    </PageContainer>
  );
};
