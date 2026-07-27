/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Switch,
  Divider,
} from '@mui/material';
import { Server, Settings2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const EmailProvidersPage: React.FC = () => {
  const [provider, setProvider] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    senderName: 'Comzilo Store',
    senderEmail: '',
    encryption: 'tls',
    status: 'active',
  });

  const [testRecipientEmail, setTestRecipientEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProvider = async () => {
    try {
      const res = await axiosInstance.get('/marketing/email-providers');
      const list = res.data?.data || [];
      const prov = list[0] || {
        id: 'smtp',
        name: 'Gmail SMTP',
        type: 'smtp',
        status: 'active',
        configJson: {},
      };
      setProvider(prov);
      const cfg = prov.configJson || {};
      setFormData({
        smtpHost: cfg.smtpHost || cfg.host || 'smtp.gmail.com',
        smtpPort: String(cfg.smtpPort || cfg.port || '587'),
        smtpUsername: cfg.smtpUsername || cfg.username || '',
        smtpPassword: (cfg.smtpPassword || cfg.password) ? '******' : '',
        senderName: cfg.senderName || cfg.fromName || 'Comzilo Store',
        senderEmail: cfg.senderEmail || cfg.fromEmail || '',
        encryption: cfg.encryption || 'tls',
        status: prov.status === 'inactive' ? 'inactive' : 'active',
      });
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        toast.error(err?.response?.data?.message || 'Failed to load Gmail SMTP settings');
      }
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  const handleOpenConfigure = () => {
    setModalOpen(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post('/marketing/email-providers', {
        providerId: 'smtp',
        providerName: 'Gmail SMTP',
        isDefault: true,
        ...formData,
      });

      toast.success('Gmail SMTP settings saved successfully!');
      setModalOpen(false);
      fetchProvider();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save Gmail SMTP settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await axiosInstance.post('/marketing/email-providers/test-connection', {
        providerId: 'smtp',
        ...formData,
      });
      toast.success('Connection to Gmail SMTP verified successfully!');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'SMTP Connection failed';
      toast.error(`SMTP Connection Error: ${errMsg}`, { duration: 7000 });
    } finally {
      setIsTesting(false);
    }
  };

  const handleOpenSendTestModal = () => {
    setTestRecipientEmail(formData.senderEmail || 'customer@example.com');
    setTestEmailModalOpen(true);
  };

  const handleSendTestEmailSubmit = async () => {
    if (!testRecipientEmail.trim()) {
      toast.error('Recipient Email Address is required');
      return;
    }
    setIsSendingTest(true);
    try {
      await axiosInstance.post('/marketing/email-providers/send-test-email', {
        providerId: 'smtp',
        recipientEmail: testRecipientEmail,
        config: formData,
      });
      toast.success('Test Email Sent Successfully via Gmail SMTP!');
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to send test email';
      toast.error(`SMTP Sending Error: ${errMsg}`, { duration: 8000 });
    } finally {
      setIsSendingTest(false);
      setTestEmailModalOpen(false);
    }
  };

  const isActive = formData.status === 'active';

  return (
    <Box sx={{ p: 3, maxWidth: 850, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Gmail SMTP Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure Gmail SMTP for dispatching automated transactional, marketing, and order notification emails to customers.
        </Typography>
      </Box>

      {/* GMAIL SMTP SINGLE CARD */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderLeft: isActive ? '5px solid #059669' : '5px solid #94A3B8',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Server size={26} color="#0284C7" />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Gmail SMTP
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Host: {formData.smtpHost || 'smtp.gmail.com'} | Port: {formData.smtpPort} ({formData.encryption.toUpperCase()})
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={isActive ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              label={isActive ? 'ACTIVE' : 'INACTIVE'}
              color={isActive ? 'success' : 'default'}
              sx={{ fontWeight: 800, px: 1 }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            All transactional emails (Welcome, Order Confirmations, Shipping Updates, Abandoned Cart Reminders) are automatically routed through Gmail SMTP.
          </Typography>

          <Divider sx={{ mb: 2.5 }} />

          {/* ACTION BUTTONS */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Settings2 size={16} />}
              onClick={handleOpenConfigure}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Configure Settings
            </Button>

            <Button
              variant="outlined"
              color="info"
              onClick={handleTestConnection}
              disabled={isTesting}
              startIcon={<Server size={16} />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {isTesting ? 'Testing Connection...' : 'Test Connection'}
            </Button>

            <Button
              variant="outlined"
              color="success"
              onClick={handleOpenSendTestModal}
              startIcon={<Send size={16} />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Send Test Email
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* CONFIGURE SETTINGS MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Server size={22} color="#0284C7" />
          Configure Gmail SMTP Settings
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* STATUS SWITCH */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: formData.status === 'active' ? '#F0FDF4' : '#FEF2F2',
                border: formData.status === 'active' ? '1px solid #BBF7D0' : '1px solid #FECACA',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: formData.status === 'active' ? '#166534' : '#991B1B' }}>
                  Gmail SMTP Status: {formData.status.toUpperCase()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Turn ON to allow automated customer email delivery via Gmail SMTP
                </Typography>
              </Box>
              <Switch
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                color="success"
              />
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284C7', mt: 1 }}>
              Sender Profile
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Sender Name"
                fullWidth
                required
                placeholder="e.g. Comzilo Store"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              />
              <TextField
                label="Sender Email Address"
                fullWidth
                required
                type="email"
                placeholder="e.g. store@gmail.com"
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
              />
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0284C7' }}>
              Gmail Server Credentials
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="SMTP Host"
                fullWidth
                required
                value={formData.smtpHost}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              />
              <TextField
                select
                label="SMTP Port"
                sx={{ width: 180 }}
                value={formData.smtpPort}
                onChange={(e) => {
                  const p = e.target.value;
                  setFormData({
                    ...formData,
                    smtpPort: p,
                    encryption: p === '465' ? 'ssl' : 'tls',
                  });
                }}
              >
                <MenuItem value="587">587 (TLS)</MenuItem>
                <MenuItem value="465">465 (SSL)</MenuItem>
                <MenuItem value="25">25 (Standard)</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Username / Gmail Address"
                fullWidth
                required
                placeholder="yourname@gmail.com"
                value={formData.smtpUsername}
                onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
              />
              <TextField
                label="App Password"
                type="password"
                fullWidth
                required
                placeholder="16-character App Password"
                value={formData.smtpPassword}
                onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                helperText="Requires 16-char App Password from myaccount.google.com/apppasswords"
              />
            </Box>

            <TextField
              select
              label="Encryption Security"
              fullWidth
              value={formData.encryption}
              onChange={(e) => {
                const enc = e.target.value;
                setFormData({
                  ...formData,
                  encryption: enc,
                  smtpPort: enc === 'ssl' ? '465' : '587',
                });
              }}
            >
              <MenuItem value="tls">TLS (STARTTLS - Port 587)</MenuItem>
              <MenuItem value="ssl">SSL (Port 465)</MenuItem>
              <MenuItem value="none">None</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={isSaving}
            sx={{ fontWeight: 700 }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* RECIPIENT POPUP MODAL FOR SEND TEST EMAIL */}
      <Dialog open={testEmailModalOpen} onClose={() => setTestEmailModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Send size={20} color="#059669" />
          Send Test Email
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a recipient email address to send a real test email via <strong>Gmail SMTP</strong>.
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
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setTestEmailModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSendTestEmailSubmit}
            disabled={isSendingTest}
            sx={{ fontWeight: 700 }}
          >
            {isSendingTest ? 'Sending...' : 'Send Test Email'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
