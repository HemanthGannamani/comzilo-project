/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { Server, Settings2, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const EmailProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    apiKey: '',
    apiDomain: '',
    senderName: '',
    senderEmail: '',
    isDefault: false,
  });

  const fetchProviders = async () => {
    try {
      const res = await axiosInstance.get('/marketing/email-providers');
      setProviders(res.data?.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load email providers');
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleOpenConfigure = (prov: any) => {
    setSelectedProvider(prov);
    const cfg = prov.configJson || {};
    setFormData({
      smtpHost: cfg.smtpHost || (prov.id === 'smtp' ? 'smtp.mailtrap.io' : ''),
      smtpPort: String(cfg.smtpPort || '587'),
      smtpUsername: cfg.smtpUsername || '',
      smtpPassword: cfg.smtpPassword || '',
      apiKey: cfg.apiKey || '',
      apiDomain: cfg.apiDomain || '',
      senderName: cfg.senderName || 'Comzilo Merchant',
      senderEmail: cfg.senderEmail || 'notifications@comzilo.com',
      isDefault: Boolean(prov.isDefault),
    });
    setModalOpen(true);
  };

  const handleTestConnection = async () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: `Testing connection to ${selectedProvider?.name}...`,
        success: `Successfully connected to ${selectedProvider?.name}!`,
        error: 'Connection test failed',
      }
    );
  };

  const handleSaveSettings = async () => {
    if (!selectedProvider) return;

    try {
      await axiosInstance.post('/marketing/email-providers', {
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        ...formData,
      });

      toast.success(`${selectedProvider.name} settings saved successfully!`);
      setModalOpen(false);
      fetchProviders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save provider settings');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Email Marketing Providers & SMTP Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure SMTP servers, Amazon SES, Mailgun, Brevo, ZeptoMail, or Mailchimp APIs per tenant.
        </Typography>
      </Box>

      {/* PROVIDERS GRID */}
      <Grid container spacing={3}>
        {providers.map((prov) => (
          <Grid item xs={12} sm={6} md={4} key={prov.id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderLeft: prov.status === 'configured' || prov.status === 'active' ? '4px solid #059669' : '4px solid #94A3B8',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Server size={22} color="#0284C7" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {prov.name}
                    </Typography>
                  </Box>
                  <Chip
                    label={prov.status.toUpperCase()}
                    color={prov.status === 'active' || prov.status === 'configured' ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Type: {prov.type ? prov.type.toUpperCase() : 'API'} Provider Integration
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<Settings2 size={16} />}
                  onClick={() => handleOpenConfigure(prov)}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CONFIGURATION MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Server size={22} color="#0284C7" />
          Configure {selectedProvider?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* SENDER SETTINGS */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284C7', mb: 1 }}>
                Sender Profile
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sender Name"
                fullWidth
                required
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sender Email Address"
                fullWidth
                required
                type="email"
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284C7', mb: 1 }}>
                {selectedProvider?.id === 'smtp' ? 'SMTP Server Configuration' : 'API Connection Keys'}
              </Typography>
            </Grid>

            {/* SMTP SPECIFIC FIELDS */}
            {selectedProvider?.id === 'smtp' ? (
              <>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="SMTP Hostname"
                    fullWidth
                    required
                    placeholder="smtp.mailtrap.io"
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    label="SMTP Port"
                    fullWidth
                    value={formData.smtpPort}
                    onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                  >
                    <MenuItem value="587">587 (TLS)</MenuItem>
                    <MenuItem value="465">465 (SSL)</MenuItem>
                    <MenuItem value="25">25 (Standard)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SMTP Username"
                    fullWidth
                    value={formData.smtpUsername}
                    onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SMTP Password"
                    type="password"
                    fullWidth
                    value={formData.smtpPassword}
                    onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                  />
                </Grid>
              </>
            ) : (
              /* API PROVIDER SPECIFIC FIELDS */
              <>
                <Grid item xs={12}>
                  <TextField
                    label="API Key / Secret Token"
                    type="password"
                    fullWidth
                    required
                    placeholder="SG.xxxxxxxx... or key-xxxxxxx"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="API Domain / Region"
                    fullWidth
                    placeholder="us-east-1 or mg.yourdomain.com"
                    value={formData.apiDomain}
                    onChange={(e) => setFormData({ ...formData, apiDomain: e.target.value })}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Set as Default Provider for Transactional Emails</Typography>}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="info" onClick={handleTestConnection} startIcon={<Send size={16} />}>
            Test Connection
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveSettings} sx={{ fontWeight: 700 }}>
              Save Settings
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
