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
  CircularProgress,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageLoader } from '../../components/common/PageLoader';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { Truck, CheckCircle2, ShieldCheck, RefreshCw, Settings, MapPin, Package, FileText, Activity, Globe, Send } from 'lucide-react';

export const ShippingProvidersPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [providers, setProviders] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // Form State
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('sandbox');
  const [defaultCourier, setDefaultCourier] = useState('Standard Express');
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCodEnabled, setIsCodEnabled] = useState(true);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

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

      if (provRes.status === 'fulfilled') setProviders(provRes.value.data.data || []);
      if (zoneRes.status === 'fulfilled') setZones(zoneRes.value.data.data || []);
      if (methodRes.status === 'fulfilled') setMethods(methodRes.value.data.data || []);
      if (addrRes.status === 'fulfilled') setAddresses(addrRes.value.data.data || []);
      if (pkgRes.status === 'fulfilled') setPackages(pkgRes.value.data.data || []);
      if (logRes.status === 'fulfilled') setLogs(logRes.value.data.data || []);
      if (shpRes.status === 'fulfilled') setShipments(shpRes.value.data.data || []);
    } catch {
      toast.error('Failed to load shipping settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenConfig = (provider: any) => {
    setSelectedProvider(provider);
    setApiKey(provider.apiKey || '');
    setApiSecret(provider.apiSecret || '');
    setWebhookUrl(provider.webhookUrl || `https://api.comzilo.com/webhooks/shipping/${provider.code}`);
    setWebhookSecret(provider.webhookSecret || '');
    setEnvironment(provider.environment || 'sandbox');
    setDefaultCourier(provider.defaultCourier || 'Standard Express');
    setIsEnabled(provider.isEnabled || false);
    setIsCodEnabled(provider.isCodEnabled ?? true);
    setIsTrackingEnabled(provider.isTrackingEnabled ?? true);
    setConfigOpen(true);
  };

  const handleSaveConfig = async () => {
    if (!selectedProvider) return;
    try {
      await axiosInstance.post(`/store/shipping-providers/providers/${selectedProvider.providerId}/configure`, {
        isEnabled,
        apiKey,
        apiSecret,
        webhookUrl,
        webhookSecret,
        environment,
        defaultCourier,
        isCodEnabled,
        isTrackingEnabled,
      });
      toast.success(`${selectedProvider.name} configuration saved successfully!`);
      setConfigOpen(false);
      fetchAllData();
    } catch {
      toast.error('Failed to save provider configuration');
    }
  };

  const handleTestConnection = async () => {
    if (!selectedProvider) return;
    setTestingConnection(true);
    try {
      const res = await axiosInstance.post('/store/shipping-providers/providers/test-connection', {
        providerCode: selectedProvider.code,
      });
      if (res.data.data.success) {
        toast.success(`Connection to ${selectedProvider.name} verified successfully!`);
      } else {
        toast.error(`Connection failed: ${res.data.data.message}`);
      }
    } catch {
      toast.error('Failed to test connection');
    } finally {
      setTestingConnection(false);
    }
  };

  if (loading) return <PageLoader message="Loading Shipping Module..." />;

  return (
    <PageContainer title="Shipping & Logistics Management" subtitle="Configure 18+ multi-carrier logistics, shipping zones, rates, packages, and live tracking">
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)} variant="scrollable" scrollButtons="auto">
          <Tab label="Shipping Providers (18)" icon={<Truck size={18} />} iconPosition="start" />
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
          {providers.map((provider) => (
            <Grid item xs={12} sm={6} md={4} key={provider.code}>
              <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', border: provider.isEnabled ? '2px solid #10B981' : '1px solid #E2E8F0' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck color="#0284C7" size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {provider.name}
                        </Typography>
                        <Chip label={provider.type.toUpperCase()} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.65rem' }} />
                      </Box>
                    </Box>
                    <Chip
                      label={provider.isEnabled ? 'ACTIVE' : 'INACTIVE'}
                      color={provider.isEnabled ? 'success' : 'default'}
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
                      <Typography variant="body2" sx={{ fontWeight: 600, color: provider.supportsCod ? '#10B981' : '#64748B' }}>
                        {provider.supportsCod ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Live Tracking</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: provider.supportsTracking ? '#10B981' : '#64748B' }}>
                        {provider.supportsTracking ? 'Supported' : 'No'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>

                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 1 }}>
                  <Button variant="outlined" fullWidth startIcon={<Settings size={16} />} onClick={() => handleOpenConfig(provider)} sx={{ fontWeight: 700 }}>
                    Configure
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* TAB 1: SHIPPING ZONES */}
      {tabIndex === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Configured Shipping Zones</Typography>
          <Grid container spacing= {2}>
            {(zones.length > 0 ? zones : [
              { name: 'Domestic National Zone', country: 'India', state: 'All States', priority: 1 },
              { name: 'North India Express Zone', country: 'India', state: 'Delhi, Punjab, Haryana', priority: 2 },
              { name: 'South India Local Zone', country: 'India', state: 'Telangana, AP, Karnataka', priority: 3 },
            ]).map((z: any) => (
              <Grid item xs={12} sm={4} key={z.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{z.name}</Typography>
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
            {(methods.length > 0 ? methods : [
              { name: 'Standard Delivery', code: 'standard', estimatedDays: '3-5 Days', isEnabled: true },
              { name: 'Express Air Shipping', code: 'express', estimatedDays: '1-2 Days', isEnabled: true },
              { name: 'Same Day Hyperlocal', code: 'same_day', estimatedDays: 'Same Day', isEnabled: true },
              { name: 'Store Pickup', code: 'store_pickup', estimatedDays: 'Instant', isEnabled: true },
            ]).map((m: any) => (
              <Grid item xs={12} sm={3} key={m.code}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                  <Typography variant="caption" color="text.secondary">ETD: {m.estimatedDays}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={m.isEnabled ? 'ENABLED' : 'DISABLED'} color={m.isEnabled ? 'success' : 'default'} size="small" />
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
            {(addresses.length > 0 ? addresses : [
              { name: 'Central Warehouse 1', contactPerson: 'Warehouse Manager', phone: '+919876543210', city: 'Hyderabad', pincode: '500001', isDefault: true },
            ]).map((a: any) => (
              <Grid item xs={12} sm={6} key={a.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{a.name}</Typography>
                    {a.isDefault && <Chip label="DEFAULT PICKUP" color="primary" size="small" />}
                  </Box>
                  <Typography variant="body2" color="text.secondary">Contact: {a.contactPerson} ({a.phone})</Typography>
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
            {(packages.length > 0 ? packages : [
              { name: 'Standard Medium Box', lengthCm: 20, widthCm: 15, heightCm: 10, maxWeightKg: 2, isDefault: true },
              { name: 'Large Cargo Carton', lengthCm: 40, widthCm: 30, heightCm: 25, maxWeightKg: 10, isDefault: false },
            ]).map((p: any) => (
              <Grid item xs={12} sm={4} key={p.name}>
                <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{p.name}</Typography>
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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Active Shipments & Labels</Typography>
          {shipments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No shipments generated yet. Use Ship Order from Orders page.</Typography>
          ) : (
            <Grid container spacing={2}>
              {shipments.map((s: any) => (
                <Grid item xs={12} sm={6} key={s.id}>
                  <Card sx={{ p: 2, border: '1px solid #E2E8F0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Order #{s.orderNumber} - {s.awbNumber}</Typography>
                    <Typography variant="body2">Courier: {s.courierName}</Typography>
                    <Chip label={s.status.toUpperCase()} color="success" size="small" sx={{ mt: 1 }} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* TAB 6: SHIPPING LOGS */}
      {tabIndex === 6 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>API & Webhook Audit Logs</Typography>
          {logs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No logs recorded yet.</Typography>
          ) : (
            <Box>
              {logs.map((l: any) => (
                <Box key={l.id} sx={{ p: 1.5, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{l.action.toUpperCase()} - {l.providerCode}</Typography>
                  <Chip label={l.status.toUpperCase()} color={l.status === 'success' ? 'success' : 'error'} size="small" />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* PROVIDER CONFIGURATION DIALOG */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Settings color="#0284C7" /> Configure {selectedProvider?.name} Credentials & Rules
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Enable Shipping Provider</Typography>
              <Typography variant="caption" color="text.secondary">Activate this courier carrier for live order fulfillment</Typography>
            </Box>
            <Switch checked={isEnabled} onChange={(e) => setIsEnabled(e.target.checked)} color="success" />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="API Key / App Client ID" fullWidth type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="API Secret / Password" fullWidth type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Webhook Callback URL" fullWidth value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Webhook Secret Key" fullWidth type="password" value={webhookSecret} onChange={(e) => setWebhookSecret(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Environment Mode" fullWidth value={environment} onChange={(e) => setEnvironment(e.target.value as any)}>
                <MenuItem value="sandbox">Sandbox / Testing</MenuItem>
                <MenuItem value="production">Live Production</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Default Courier Service" fullWidth value={defaultCourier} onChange={(e) => setDefaultCourier(e.target.value)} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Carrier Features & Rules</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch checked={isCodEnabled} onChange={(e) => setIsCodEnabled(e.target.checked)} />} label="Allow Cash On Delivery (COD)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel control={<Switch checked={isTrackingEnabled} onChange={(e) => setIsTrackingEnabled(e.target.checked)} />} label="Enable Live Real-Time Tracking" />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="info"
            startIcon={testingConnection ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
            disabled={testingConnection}
            onClick={handleTestConnection}
          >
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setConfigOpen(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={handleSaveConfig} sx={{ fontWeight: 700 }}>
              Save Configuration
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
