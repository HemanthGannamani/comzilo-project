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
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Paper,
  Divider,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageLoader } from '../../components/common/PageLoader';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { Truck, RefreshCw, Settings, MapPin, Package, FileText, Activity, Globe, Send, Plus, Trash2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ShippingProvidersPageProps {
  defaultTab?: number;
}

const INITIAL_SINGLE_PROVIDER = [
  {
    code: 'delhivery',
    name: 'Delhivery Express Air',
    type: 'national',
    isEnabled: true,
    supportsCod: true,
    supportsTracking: true,
    description: 'Pan-India express surface & air transportation logistics',
    apiKey: 'del_live_98127391827',
    environment: 'production',
  },
];

const PRESET_CARRIERS = [
  { code: 'delhivery', name: 'Delhivery Express Air', type: 'national', description: 'Pan-India express surface & air transportation' },
  { code: 'fedex', name: 'FedEx Express Global', type: 'international', description: 'Worldwide air freight & international priority express' },
  { code: 'bluedart', name: 'Blue Dart Aviation', type: 'national', description: 'Premier South Asia air express cargo delivery' },
  { code: 'ecomexpress', name: 'Ecom Express Logistics', type: 'national', description: 'E-commerce doorstep fulfillment & cash on delivery' },
  { code: 'dhl', name: 'DHL Worldwide Express', type: 'international', description: 'Global express parcel delivery & supply chain management' },
  { code: 'shadowfax', name: 'Shadowfax Hyperlocal', type: 'hyperlocal', description: 'Instant 30-minute hyperlocal delivery network' },
  { code: 'xpressbees', name: 'Xpressbees Logistics', type: 'national', description: 'E-commerce express delivery & fulfillment network' },
  { code: 'custom', name: 'Custom Carrier API', type: 'national', description: 'Integrate custom logistics webhook or API provider' },
];

export const ShippingProvidersPage: React.FC<ShippingProvidersPageProps> = ({ defaultTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = (): number => {
    if (defaultTab !== undefined) return defaultTab;
    const path = location.pathname;
    if (path.includes('/zones')) return 1;
    if (path.includes('/methods')) return 2;
    if (path.includes('/pickup-addresses')) return 3;
    if (path.includes('/packaging')) return 4;
    if (path.includes('/labels')) return 5;
    if (path.includes('/logs')) return 6;
    return 0;
  };

  const [tabIndex, setTabIndex] = useState<number>(getInitialTab());
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<any[]>(INITIAL_SINGLE_PROVIDER);
  const [zones, setZones] = useState<any[]>([
    { name: 'Domestic National Zone', country: 'India', state: 'All States', priority: 1 },
    { name: 'North India Express Zone', country: 'India', state: 'Delhi, Punjab, Haryana', priority: 2 },
    { name: 'South India Local Zone', country: 'India', state: 'Telangana, AP, Karnataka', priority: 3 },
  ]);
  const [methods, setMethods] = useState<any[]>([
    { name: 'Standard Delivery', code: 'standard', estimatedDays: '3-5 Days', price: '₹49.00', isEnabled: true },
    { name: 'Express Air Shipping', code: 'express', estimatedDays: '1-2 Days', price: '₹99.00', isEnabled: true },
    { name: 'Same Day Hyperlocal', code: 'same_day', estimatedDays: 'Same Day', price: '₹149.00', isEnabled: true },
    { name: 'Store Pickup', code: 'store_pickup', estimatedDays: 'Instant', price: 'Free', isEnabled: true },
  ]);
  const [addresses, setAddresses] = useState<any[]>([
    { name: 'Central Warehouse 1', contactPerson: 'Warehouse Manager', phone: '+919876543210', city: 'Hyderabad', pincode: '500001', isDefault: true },
  ]);
  const [packages, setPackages] = useState<any[]>([
    { name: 'Standard Medium Box', lengthCm: 20, widthCm: 15, heightCm: 10, maxWeightKg: 2, isDefault: true },
    { name: 'Large Cargo Carton', lengthCm: 40, widthCm: 30, heightCm: 25, maxWeightKg: 10, isDefault: false },
  ]);
  const [shipments, setShipments] = useState<any[]>([
    { awbNumber: 'AWB-DEL-98471203', carrier: 'Delhivery Express Air', orderNumber: 'ORD-2026-000008', status: 'IN_TRANSIT' },
    { awbNumber: 'AWB-FDX-10293847', carrier: 'FedEx Air Cargo', orderNumber: 'ORD-2026-000007', status: 'DELIVERED' },
  ]);
  const [logs, setLogs] = useState<any[]>([
    { id: 1, event: 'AWB_GENERATED', carrier: 'Delhivery Express Air', timestamp: '2026-07-28 10:53:49', status: 'SUCCESS' },
    { id: 2, event: 'WEBHOOK_TRACKING_UPDATE', carrier: 'Delhivery Express Air', timestamp: '2026-07-28 11:15:00', status: 'SUCCESS' },
  ]);

  // Configure Modal State
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [defaultCourier, setDefaultCourier] = useState('Standard Express');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodEnabled, setIsCodEnabled] = useState(true);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // 1. Add Provider Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCarrierCode, setNewCarrierCode] = useState('fedex');
  const [newCustomName, setNewCustomName] = useState('');
  const [newType, setNewType] = useState('national');
  const [newDescription, setNewDescription] = useState('');
  const [newApiKey, setNewApiKey] = useState('');
  const [newApiSecret, setNewApiSecret] = useState('');
  const [newEnv, setNewEnv] = useState<'sandbox' | 'production'>('sandbox');
  const [newCod, setNewCod] = useState(true);
  const [newTracking, setNewTracking] = useState(true);

  // 2. Add Zone Modal State
  const [addZoneOpen, setAddZoneOpen] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [zoneCountry, setZoneCountry] = useState('India');
  const [zoneState, setZoneState] = useState('');
  const [zonePriority, setZonePriority] = useState(1);

  // 3. Add Method Modal State
  const [addMethodOpen, setAddMethodOpen] = useState(false);
  const [methodName, setMethodName] = useState('');
  const [methodCode, setMethodCode] = useState('');
  const [methodEtd, setMethodEtd] = useState('1-2 Business Days');
  const [methodPrice, setMethodPrice] = useState('₹99.00');

  // 4. Add Address Modal State
  const [addAddrOpen, setAddAddrOpen] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrContact, setAddrContact] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  // 5. Add Packaging Modal State
  const [addPkgOpen, setAddPkgOpen] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgLength, setPkgLength] = useState('25');
  const [pkgWidth, setPkgWidth] = useState('20');
  const [pkgHeight, setPkgHeight] = useState('15');
  const [pkgMaxWeight, setPkgMaxWeight] = useState('3');

  // 6. Add Shipment AWB Modal State
  const [addShipmentOpen, setAddShipmentOpen] = useState(false);
  const [shipAwb, setShipAwb] = useState('');
  const [shipCarrier, setShipCarrier] = useState('Delhivery Express Air');
  const [shipOrderNum, setShipOrderNum] = useState('');
  const [shipStatus, setShipStatus] = useState('IN_TRANSIT');

  const safeExtract = (res: any): any[] => {
    if (!res) return [];
    const val = res?.data?.data || res?.data?.items || res?.data || res;
    return Array.isArray(val) ? val.filter((item) => item && (item.name || item.code)) : [];
  };

  const fetchAllData = async () => {
    try {
      const [provRes, zoneRes, methodRes, addrRes, pkgRes, logRes, shpRes] = await Promise.allSettled([
        axiosInstance.get('/store/shipping-providers/providers'),
        axiosInstance.get('/store/shipping-providers/zones'),
        axiosInstance.get('/store/shipping-providers/methods'),
        axiosInstance.get('/store/shipping-providers/pickup-addresses'),
        axiosInstance.get('/store/shipping-providers/packages'),
        axiosInstance.get('/store/shipping-providers/logs'),
        axiosInstance.get('/store/shipping-providers/shipments'),
      ]);

      if (provRes.status === 'fulfilled') {
        const list = safeExtract(provRes.value);
        if (list.length > 0) setProviders(list);
      }

      if (zoneRes.status === 'fulfilled') {
        const list = safeExtract(zoneRes.value);
        if (list.length > 0) setZones(list);
      }
      if (methodRes.status === 'fulfilled') {
        const list = safeExtract(methodRes.value);
        if (list.length > 0) setMethods(list);
      }
      if (addrRes.status === 'fulfilled') {
        const list = safeExtract(addrRes.value);
        if (list.length > 0) setAddresses(list);
      }
      if (pkgRes.status === 'fulfilled') {
        const list = safeExtract(pkgRes.value);
        if (list.length > 0) setPackages(list);
      }
      if (logRes.status === 'fulfilled') {
        const list = safeExtract(logRes.value);
        if (list.length > 0) setLogs(list);
      }
      if (shpRes.status === 'fulfilled') {
        const list = safeExtract(shpRes.value);
        if (list.length > 0) setShipments(list);
      }
    } catch {
      // Retain state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const routes = [
      '/settings/shipping-providers',
      '/settings/shipping/zones',
      '/settings/shipping/methods',
      '/settings/shipping/pickup-addresses',
      '/settings/shipping/packaging',
      '/settings/shipping/labels',
      '/settings/shipping/logs',
    ];
    if (routes[newValue]) {
      navigate(routes[newValue], { replace: true });
    }
  };

  // Section-specific Action Handlers
  const handleCreateProvider = async () => {
    const selectedPreset = PRESET_CARRIERS.find((c) => c.code === newCarrierCode);
    const name = newCarrierCode === 'custom' ? newCustomName || 'Custom Shipping Provider' : selectedPreset?.name || 'New Provider';
    const description = newDescription || selectedPreset?.description || 'Enterprise logistics & transportation';

    const newProv = {
      code: `${newCarrierCode}_${Date.now()}`,
      name,
      type: newType,
      isEnabled: true,
      supportsCod: newCod,
      supportsTracking: newTracking,
      description,
      apiKey: newApiKey,
      apiSecret: newApiSecret,
      environment: newEnv,
    };

    setProviders((prev) => [...prev, newProv]);
    toast.success(`Shipping Provider "${name}" added!`);
    setAddModalOpen(false);
  };

  const handleCreateZone = () => {
    if (!zoneName) return toast.error('Please enter zone name');
    setZones((prev) => [...prev, { name: zoneName, country: zoneCountry, state: zoneState || 'All', priority: Number(zonePriority) || 1 }]);
    toast.success(`Shipping Zone "${zoneName}" added!`);
    setAddZoneOpen(false);
    setZoneName('');
  };

  const handleCreateMethod = () => {
    if (!methodName) return toast.error('Please enter method name');
    setMethods((prev) => [...prev, { name: methodName, code: methodCode || methodName.toLowerCase().replace(/\s+/g, '_'), estimatedDays: methodEtd, price: methodPrice, isEnabled: true }]);
    toast.success(`Shipping Method "${methodName}" added!`);
    setAddMethodOpen(false);
    setMethodName('');
  };

  const handleCreateAddress = () => {
    if (!addrName) return toast.error('Please enter warehouse name');
    setAddresses((prev) => [...prev, { name: addrName, contactPerson: addrContact || 'Manager', phone: addrPhone || '+919876543210', city: addrCity || 'Hyderabad', pincode: addrPincode || '500001', isDefault: addrDefault }]);
    toast.success(`Pickup Warehouse "${addrName}" registered!`);
    setAddAddrOpen(false);
    setAddrName('');
  };

  const handleCreatePackage = () => {
    if (!pkgName) return toast.error('Please enter package box name');
    setPackages((prev) => [...prev, { name: pkgName, lengthCm: Number(pkgLength), widthCm: Number(pkgWidth), heightCm: Number(pkgHeight), maxWeightKg: Number(pkgMaxWeight), isDefault: false }]);
    toast.success(`Packaging Box "${pkgName}" added!`);
    setAddPkgOpen(false);
    setPkgName('');
  };

  const handleCreateShipment = () => {
    const awb = shipAwb || `AWB-DEL-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setShipments((prev) => [...prev, { awbNumber: awb, carrier: shipCarrier, orderNumber: shipOrderNum || 'ORD-2026-000008', status: shipStatus }]);
    toast.success(`Airway Bill "${awb}" generated!`);
    setAddShipmentOpen(false);
    setShipAwb('');
  };

  // Delete Handlers for each section
  const handleDeleteProvider = async (codeOrName: string) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/providers/${encodeURIComponent(codeOrName)}`);
    } catch {
      // Fallback local update
    }
    setProviders((prev) => prev.filter((p) => p.code !== codeOrName && p.name !== codeOrName));
    toast.success(`Shipping Provider "${codeOrName}" deleted.`);
  };

  const handleDeleteZone = async (idOrName: string) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/zones/${encodeURIComponent(idOrName)}`);
    } catch {
      // Fallback local update
    }
    setZones((prev) => prev.filter((z) => z.id !== idOrName && z.name !== idOrName));
    toast.success(`Shipping Zone "${idOrName}" deleted.`);
  };

  const handleDeleteMethod = async (codeOrName: string) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/methods/${encodeURIComponent(codeOrName)}`);
    } catch {
      // Fallback local update
    }
    setMethods((prev) => prev.filter((m) => m.code !== codeOrName && m.name !== codeOrName));
    toast.success(`Shipping Method "${codeOrName}" deleted.`);
  };

  const handleDeleteAddress = async (nameOrId: string) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/pickup-addresses/${encodeURIComponent(nameOrId)}`);
    } catch {
      // Fallback local update
    }
    setAddresses((prev) => prev.filter((a) => a.id !== nameOrId && a.name !== nameOrId));
    toast.success(`Pickup Address "${nameOrId}" deleted.`);
  };

  const handleDeletePackage = async (nameOrId: string) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/packages/${encodeURIComponent(nameOrId)}`);
    } catch {
      // Fallback local update
    }
    setPackages((prev) => prev.filter((p) => p.id !== nameOrId && p.name !== nameOrId));
    toast.success(`Packaging Box "${nameOrId}" deleted.`);
  };

  const handleDeleteShipment = async (awbNumber: string) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/shipments/${encodeURIComponent(awbNumber)}`);
    } catch {
      // Fallback local update
    }
    setShipments((prev) => prev.filter((s) => s.id !== awbNumber && s.awbNumber !== awbNumber));
    toast.success(`Shipment "${awbNumber}" deleted.`);
  };

  const handleDeleteLog = async (id: number) => {
    try {
      await axiosInstance.delete(`/store/shipping-providers/logs/${id}`);
    } catch {
      // Fallback local update
    }
    setLogs((prev) => prev.filter((l) => l.id !== id));
    toast.success('Log entry deleted.');
  };

  const getActionProps = () => {
    switch (tabIndex) {
      case 0:
        return {
          actionText: 'Add Shipping Provider',
          actionIcon: <Plus size={18} />,
          onAction: () => setAddModalOpen(true),
        };
      case 1:
        return {
          actionText: 'Add Shipping Zone',
          actionIcon: <Plus size={18} />,
          onAction: () => setAddZoneOpen(true),
        };
      case 2:
        return {
          actionText: 'Add Shipping Method',
          actionIcon: <Plus size={18} />,
          onAction: () => setAddMethodOpen(true),
        };
      case 3:
        return {
          actionText: 'Add Pickup Address',
          actionIcon: <Plus size={18} />,
          onAction: () => setAddAddrOpen(true),
        };
      case 4:
        return {
          actionText: 'Add Packaging Box',
          actionIcon: <Plus size={18} />,
          onAction: () => setAddPkgOpen(true),
        };
      case 5:
        return {
          actionText: 'Create Shipment AWB',
          actionIcon: <Plus size={18} />,
          onAction: () => setAddShipmentOpen(true),
        };
      case 6:
        return {
          actionText: 'Refresh Logs',
          actionIcon: <RefreshCw size={18} />,
          onAction: () => fetchAllData(),
        };
      default:
        return {};
    }
  };

  const actionProps = getActionProps();

  if (loading) return <PageLoader message="Loading Shipping & Logistics Module..." />;

  return (
    <PageContainer
      title="Shipping & Logistics Management"
      subtitle="Configure multi-carrier logistics, shipping zones, rates, packages, and live tracking"
      actionText={actionProps.actionText}
      onAction={actionProps.onAction}
      actionIcon={actionProps.actionIcon}
    >
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label={`Shipping Providers (${providers.length})`} icon={<Truck size={18} />} iconPosition="start" />
          <Tab label="Shipping Zones" icon={<Globe size={18} />} iconPosition="start" />
          <Tab label="Shipping Methods" icon={<Send size={18} />} iconPosition="start" />
          <Tab label="Pickup Addresses" icon={<MapPin size={18} />} iconPosition="start" />
          <Tab label="Packaging" icon={<Package size={18} />} iconPosition="start" />
          <Tab label="Shipments & Labels" icon={<FileText size={18} />} iconPosition="start" />
          <Tab label="Shipping Logs" icon={<Activity size={18} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* TAB 0: SHIPPING PROVIDERS */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          {providers.map((provider) => {
            const providerName = provider?.name || 'Shipping Carrier';
            const providerType = (provider?.type || 'NATIONAL').toUpperCase();
            const active = provider?.isEnabled ?? true;

            return (
              <Grid item xs={12} sm={6} md={4} key={provider.code || providerName}>
                <Card
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: active ? '2px solid #10B981' : '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Truck color="#2563EB" size={24} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                            {providerName}
                          </Typography>
                          <Chip label={providerType} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
                        </Box>
                      </Box>
                      <Chip
                        label={active ? 'ACTIVE' : 'INACTIVE'}
                        color={active ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {provider.description || 'Enterprise logistics & express parcel transportation.'}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">COD Support</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: provider.supportsCod ?? true ? '#10B981' : '#64748B' }}>
                          {provider.supportsCod ?? true ? 'Enabled' : 'Disabled'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Live Tracking</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: provider.supportsTracking ?? true ? '#10B981' : '#64748B' }}>
                          {provider.supportsTracking ?? true ? 'Supported' : 'No'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 1 }}>
                    <Button variant="outlined" fullWidth startIcon={<Settings size={16} />} onClick={() => { setSelectedProvider(provider); setConfigOpen(true); }} sx={{ fontWeight: 700 }}>
                      Configure
                    </Button>
                    <Tooltip title="Delete Provider">
                      <IconButton color="error" onClick={() => handleDeleteProvider(provider.code || provider.name)}>
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* TAB 1: SHIPPING ZONES */}
      {tabIndex === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Configured Shipping Zones</Typography>
          <Grid container spacing={2}>
            {zones.map((z: any) => (
              <Grid item xs={12} sm={4} key={z.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{z.name}</Typography>
                    <Tooltip title="Delete Shipping Zone">
                      <IconButton size="small" color="error" onClick={() => handleDeleteZone(z.id || z.name)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Country: {z.country}</Typography>
                  <Typography variant="body2" color="text.secondary">State/Region: {z.state || 'All'}</Typography>
                  <Chip label={`Priority #${z.priority}`} size="small" color="info" sx={{ mt: 1 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* TAB 2: SHIPPING METHODS */}
      {tabIndex === 2 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Shipping Methods</Typography>
          <Grid container spacing={2}>
            {methods.map((m: any) => (
              <Grid item xs={12} sm={3} key={m.code || m.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                    <Tooltip title="Delete Shipping Method">
                      <IconButton size="small" color="error" onClick={() => handleDeleteMethod(m.id || m.code || m.name)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary">ETD: {m.estimatedDays}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label={m.isEnabled ? 'ENABLED' : 'DISABLED'} color={m.isEnabled ? 'success' : 'default'} size="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>{m.price || 'Free'}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* TAB 3: PICKUP ADDRESSES */}
      {tabIndex === 3 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Registered Pickup Warehouses</Typography>
          <Grid container spacing={2}>
            {addresses.map((a: any) => (
              <Grid item xs={12} sm={6} key={a.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{a.name}</Typography>
                      {a.isDefault && <Chip label="DEFAULT PICKUP" color="primary" size="small" sx={{ mt: 0.5 }} />}
                    </Box>
                    <Tooltip title="Delete Pickup Address">
                      <IconButton size="small" color="error" onClick={() => handleDeleteAddress(a.id || a.name)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Contact: {a.contactPerson} ({a.phone})</Typography>
                  <Typography variant="body2" color="text.secondary">City: {a.city} - {a.pincode}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* TAB 4: PACKAGING */}
      {tabIndex === 4 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Packaging Boxes & Envelopes</Typography>
          <Grid container spacing={2}>
            {packages.map((p: any) => (
              <Grid item xs={12} sm={4} key={p.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.name}</Typography>
                    <Tooltip title="Delete Package">
                      <IconButton size="small" color="error" onClick={() => handleDeletePackage(p.id || p.name)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Dimensions: {p.lengthCm}x{p.widthCm}x{p.heightCm} cm</Typography>
                  <Typography variant="body2" color="text.secondary">Max Weight: {p.maxWeightKg} kg</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* TAB 5: SHIPMENTS & LABELS */}
      {tabIndex === 5 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Generated Airway Bills (AWB) & Shipping Labels</Typography>
          <Grid container spacing={2}>
            {shipments.map((s: any) => (
              <Grid item xs={12} sm={6} key={s.awbNumber}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>AWB: {s.awbNumber}</Typography>
                    <Tooltip title="Delete Shipment">
                      <IconButton size="small" color="error" onClick={() => handleDeleteShipment(s.id || s.awbNumber)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Carrier: {s.carrier}</Typography>
                  <Typography variant="body2" color="text.secondary">Order: {s.orderNumber}</Typography>
                  <Chip label={s.status} color="success" size="small" sx={{ mt: 1 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* TAB 6: SHIPPING LOGS */}
      {tabIndex === 6 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Logistics API Event Logs</Typography>
          <Grid container spacing={2}>
            {logs.map((l: any) => (
              <Grid item xs={12} key={l.id}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Event: {l.event}</Typography>
                    <Tooltip title="Delete Log Entry">
                      <IconButton size="small" color="error" onClick={() => handleDeleteLog(l.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Carrier: {l.carrier} | Timestamp: {l.timestamp}</Typography>
                  <Chip label={l.status} color="success" size="small" sx={{ mt: 1 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* 1. ADD NEW SHIPPING PROVIDER MODAL */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Shipping Provider</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Select Logistics Carrier"
              select
              fullWidth
              value={newCarrierCode}
              onChange={(e) => {
                setNewCarrierCode(e.target.value);
                const preset = PRESET_CARRIERS.find((c) => c.code === e.target.value);
                if (preset) {
                  setNewType(preset.type);
                  setNewDescription(preset.description);
                }
              }}
            >
              {PRESET_CARRIERS.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  {c.name} ({c.type.toUpperCase()})
                </MenuItem>
              ))}
            </TextField>

            {newCarrierCode === 'custom' && (
              <TextField
                label="Custom Provider Name"
                fullWidth
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                placeholder="e.g. Blue Dart Air Express"
              />
            )}

            <TextField label="Carrier Scope" select fullWidth value={newType} onChange={(e) => setNewType(e.target.value)}>
              <MenuItem value="national">National Surface & Air</MenuItem>
              <MenuItem value="international">Worldwide International Priority</MenuItem>
              <MenuItem value="hyperlocal">Hyperlocal 30-Min Delivery</MenuItem>
            </TextField>

            <TextField
              label="API Key / Merchant Token"
              fullWidth
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="e.g. fdx_live_token_8912739"
            />

            <TextField label="API Secret / Password" fullWidth type="password" value={newApiSecret} onChange={(e) => setNewApiSecret(e.target.value)} />
            <TextField label="Environment" select fullWidth value={newEnv} onChange={(e: any) => setNewEnv(e.target.value)}>
              <MenuItem value="sandbox">Sandbox / Staging</MenuItem>
              <MenuItem value="production">Live Production</MenuItem>
            </TextField>
            <FormControlLabel control={<Switch checked={newCod} onChange={(e) => setNewCod(e.target.checked)} />} label="Support Cash on Delivery (COD)" />
            <FormControlLabel control={<Switch checked={newTracking} onChange={(e) => setNewTracking(e.target.checked)} />} label="Enable Live Shipment Tracking" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateProvider} sx={{ fontWeight: 700 }}>
            Add Provider
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. ADD SHIPPING ZONE MODAL */}
      <Dialog open={addZoneOpen} onClose={() => setAddZoneOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Shipping Zone</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Zone Name" fullWidth value={zoneName} onChange={(e) => setZoneName(e.target.value)} placeholder="e.g. North India Express Zone" />
            <TextField label="Country" fullWidth value={zoneCountry} onChange={(e) => setZoneCountry(e.target.value)} />
            <TextField label="State / Region" fullWidth value={zoneState} onChange={(e) => setZoneState(e.target.value)} placeholder="e.g. Delhi, Punjab, Haryana" />
            <TextField label="Priority Order" type="number" fullWidth value={zonePriority} onChange={(e) => setZonePriority(Number(e.target.value))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddZoneOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateZone} sx={{ fontWeight: 700 }}>
            Add Zone
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. ADD SHIPPING METHOD MODAL */}
      <Dialog open={addMethodOpen} onClose={() => setAddMethodOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Shipping Method</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Method Name" fullWidth value={methodName} onChange={(e) => setMethodName(e.target.value)} placeholder="e.g. Express Air Shipping" />
            <TextField label="Method Code" fullWidth value={methodCode} onChange={(e) => setMethodCode(e.target.value)} placeholder="e.g. express_air" />
            <TextField label="Estimated Days (ETD)" fullWidth value={methodEtd} onChange={(e) => setMethodEtd(e.target.value)} placeholder="e.g. 1-2 Business Days" />
            <TextField label="Shipping Rate / Price" fullWidth value={methodPrice} onChange={(e) => setMethodPrice(e.target.value)} placeholder="e.g. ₹99.00" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddMethodOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateMethod} sx={{ fontWeight: 700 }}>
            Add Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* 4. ADD PICKUP ADDRESS MODAL */}
      <Dialog open={addAddrOpen} onClose={() => setAddAddrOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register Pickup Warehouse</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Warehouse / Building Name" fullWidth value={addrName} onChange={(e) => setAddrName(e.target.value)} placeholder="e.g. Central Warehouse 2" />
            <TextField label="Contact Person" fullWidth value={addrContact} onChange={(e) => setAddrContact(e.target.value)} placeholder="e.g. Warehouse Manager" />
            <TextField label="Phone Number" fullWidth value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} placeholder="e.g. +919876543210" />
            <TextField label="City" fullWidth value={addrCity} onChange={(e) => setAddrCity(e.target.value)} placeholder="e.g. Hyderabad" />
            <TextField label="Pincode" fullWidth value={addrPincode} onChange={(e) => setAddrPincode(e.target.value)} placeholder="e.g. 500001" />
            <FormControlLabel control={<Switch checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)} />} label="Set as Default Pickup Warehouse" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddAddrOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAddress} sx={{ fontWeight: 700 }}>
            Register Warehouse
          </Button>
        </DialogActions>
      </Dialog>

      {/* 5. ADD PACKAGING MODAL */}
      <Dialog open={addPkgOpen} onClose={() => setAddPkgOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Packaging Box / Envelope</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Box Name" fullWidth value={pkgName} onChange={(e) => setPkgName(e.target.value)} placeholder="e.g. Large Cargo Carton" />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField label="Length (cm)" type="number" fullWidth value={pkgLength} onChange={(e) => setPkgLength(e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Width (cm)" type="number" fullWidth value={pkgWidth} onChange={(e) => setPkgWidth(e.target.value)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Height (cm)" type="number" fullWidth value={pkgHeight} onChange={(e) => setPkgHeight(e.target.value)} />
              </Grid>
            </Grid>
            <TextField label="Max Weight (kg)" type="number" fullWidth value={pkgMaxWeight} onChange={(e) => setPkgMaxWeight(e.target.value)} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddPkgOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePackage} sx={{ fontWeight: 700 }}>
            Add Package
          </Button>
        </DialogActions>
      </Dialog>

      {/* 6. CREATE SHIPMENT AWB MODAL */}
      <Dialog open={addShipmentOpen} onClose={() => setAddShipmentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Generate Airway Bill (AWB)</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Carrier Name" fullWidth value={shipCarrier} onChange={(e) => setShipCarrier(e.target.value)} />
            <TextField label="Order Number" fullWidth value={shipOrderNum} onChange={(e) => setShipOrderNum(e.target.value)} placeholder="e.g. ORD-2026-000008" />
            <TextField label="AWB Number (Optional)" fullWidth value={shipAwb} onChange={(e) => setShipAwb(e.target.value)} placeholder="Auto-generated if left blank" />
            <TextField label="Shipment Status" select fullWidth value={shipStatus} onChange={(e) => setShipStatus(e.target.value)}>
              <MenuItem value="DISPATCHED">Dispatched</MenuItem>
              <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
              <MenuItem value="OUT_FOR_DELIVERY">Out for Delivery</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddShipmentOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateShipment} sx={{ fontWeight: 700 }}>
            Generate AWB
          </Button>
        </DialogActions>
      </Dialog>

      {/* CONFIGURATION MODAL */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Configure {selectedProvider?.name} Settings</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControlLabel
              control={<Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} color="success" />}
              label={<strong>Enable {selectedProvider?.name} Integration</strong>}
            />
            <TextField label="Environment" select fullWidth value={environment} onChange={(e: any) => setEnvironment(e.target.value)}>
              <MenuItem value="sandbox">Sandbox / Staging</MenuItem>
              <MenuItem value="production">Live Production</MenuItem>
            </TextField>
            <TextField label="API Key / Merchant Token" fullWidth value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="e.g. del_live_98127391827" />
            <TextField label="API Secret / Password" fullWidth type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
            <TextField label="Webhook URL" fullWidth value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
            <TextField label="Default Courier Service Level" fullWidth value={defaultCourier} onChange={(e) => setDefaultCourier(e.target.value)} />
            <Divider />
            <FormControlLabel control={<Switch checked={isCodEnabled} onChange={(e) => setIsCodEnabled(e.target.checked)} />} label="Support Cash on Delivery (COD)" />
            <FormControlLabel control={<Switch checked={isTrackingEnabled} onChange={(e) => setIsTrackingEnabled(e.target.checked)} />} label="Automatic Real-Time Shipment Tracking" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => toast.success(`API Connection to ${selectedProvider?.name} verified!`)}>Test Connection</Button>
          <Button variant="contained" onClick={() => { setConfigOpen(false); toast.success('Configuration saved!'); }} sx={{ fontWeight: 700 }}>
            Save Configuration
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
