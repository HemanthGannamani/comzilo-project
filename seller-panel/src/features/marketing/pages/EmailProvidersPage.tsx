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
import { Server, Settings2, Send, Power } from 'lucide-react';
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
    status: 'active',
  });

  const fetchProviders = async () => {
    try {
      const res = await axiosInstance.get('/marketing/email-providers');
      setProviders(res.data?.data || []);
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        toast.error(err?.response?.data?.message || 'Failed to load email providers');
      }
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
      status: prov.status === 'inactive' ? 'inactive' : 'active',
    });
    setModalOpen(true);
  };

  const handleQuickToggleStatus = async (prov: any) => {
    const isActiveCurrently = prov.status === 'active' || prov.status === 'configured';
    const newStatus = isActiveCurrently ? 'inactive' : 'active';
    const cfg = prov.configJson || {};

    try {
      await axiosInstance.post('/marketing/email-providers', {
        providerId: prov.id,
        providerName: prov.name,
        status: newStatus,
        isDefault: Boolean(prov.isDefault),
        smtpHost: cfg.smtpHost || (prov.id === 'smtp' ? 'smtp.mailtrap.io' : ''),
        smtpPort: cfg.smtpPort || '587',
        smtpUsername: cfg.smtpUsername || '',
        smtpPassword: cfg.smtpPassword || '',
        apiKey: cfg.apiKey || '',
        apiDomain: cfg.apiDomain || '',
        senderName: cfg.senderName || 'Comzilo Merchant',
        senderEmail: cfg.senderEmail || 'notifications@comzilo.com',
      });
      toast.success(`${prov.name} is now ${newStatus.toUpperCase()}!`);
      fetchProviders();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to toggle provider status');
    }
  };

  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testRecipientEmail, setTestRecipientEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await axiosInstance.post('/marketing/email-providers/test-connection', {
        providerId: selectedProvider?.id,
        ...formData,
      });
      toast.success(`Connection to ${selectedProvider?.name} verified successfully!`);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'SMTP Connection failed';
      toast.error(`SMTP Error: ${errMsg}`, { duration: 6000 });
    } finally {
      setIsTesting(false);
    }
  };

  const handleOpenSendTestModal = () => {
    setTestRecipientEmail(formData.senderEmail || 'admin@comzilo.com');
    setTestEmailModalOpen(true);
  };

  const handleSendTestEmailSubmit = async () => {
    if (!testRecipientEmail) {
      toast.error('Recipient Email Address is required');
      return;
    }
    setIsSendingTest(true);
    try {
      await axiosInstance.post('/marketing/email-providers/send-test-email', {
        providerId: selectedProvider?.id,
        recipientEmail: testRecipientEmail,
        config: formData,
      });
      toast.success('Test Email Sent Successfully');
      setTestEmailModalOpen(false);
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to send test email';
      toast.error(`SMTP Error: ${errMsg}`, { duration: 7000 });
    } finally {
      setIsSendingTest(false);
    }
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
          Configure SMTP servers, Amazon SES, Mailgun, Brevo, ZeptoMail, or Mailchimp APIs per tenant. Test connection & send real test emails directly to your inbox.
        </Typography>
      </Box>

      {/* PROVIDERS GRID */}
      <Grid container spacing={3}>
        {providers.map((prov) => {
          const isActive = prov.status === 'active' || prov.status === 'configured';

          return (
            <Grid item xs={12} sm={6} md={4} key={prov.id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderLeft: isActive ? '4px solid #059669' : '4px solid #94A3B8',
                  backgroundColor: isActive ? '#FFFFFF' : '#F8FAFC',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Server size={22} color={isActive ? '#0284C7' : '#64748B'} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isActive ? '#0F172A' : '#64748B' }}>
                        {prov.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={prov.status.toUpperCase()}
                      color={isActive ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                    Type: {prov.type ? prov.type.toUpperCase() : 'API'} Provider Integration
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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

                    <Button
                      variant={isActive ? 'contained' : 'outlined'}
                      color={isActive ? 'error' : 'success'}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickToggleStatus(prov);
                      }}
                      startIcon={<Power size={14} />}
                      sx={{ fontWeight: 700, borderRadius: 2, whiteSpace: 'nowrap', minWidth: '105px' }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* CONFIGURATION MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Server size={22} color="#0284C7" />
          Configure {selectedProvider?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* STATUS TOGGLE */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: formData.status === 'active' ? '#F0FDF4' : '#FEF2F2',
                  border: formData.status === 'active' ? '1px solid #BBF7D0' : '1px solid #FECACA',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: formData.status === 'active' ? '#166534' : '#991B1B' }}>
                    Integration Status: {formData.status.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Turn provider status ON to allow sending emails through {selectedProvider?.name}
                  </Typography>
                </Box>
                <Switch
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                  color="success"
                />
              </Box>
            </Grid>

            {/* SENDER SETTINGS */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284C7', mb: 1, mt: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="info" onClick={handleTestConnection} disabled={isTesting} startIcon={<Server size={16} />}>
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button variant="outlined" color="success" onClick={handleOpenSendTestModal} startIcon={<Send size={16} />}>
              Send Test Email
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveSettings} sx={{ fontWeight: 700 }}>
              Save Settings
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* RECIPIENT POPUP MODAL FOR SEND TEST EMAIL */}
      <Dialog open={testEmailModalOpen} onClose={() => setTestEmailModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Send size={20} color="#059669" />
          Send Test Email
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a recipient email address to send a real test message via <strong>{selectedProvider?.name}</strong>.
          </Typography>
          <TextField
            label="Recipient Email Address"
            type="email"
            fullWidth
            required
            autoFocus
            value={testRecipientEmail}
            onChange={(e) => setTestRecipientEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setTestEmailModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleSendTestEmailSubmit} disabled={isSendingTest} sx={{ fontWeight: 700 }}>
            {isSendingTest ? 'Sending...' : 'Send Test Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
