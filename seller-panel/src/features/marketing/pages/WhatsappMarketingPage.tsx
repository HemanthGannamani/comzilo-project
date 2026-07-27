/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  MessageSquare,
  CheckCircle2,
  Send,
  RefreshCw,
  Plus,
  Bot,
  Sparkles,
  ListFilter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const WhatsappMarketingPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  // Settings State
  const [settings, setSettings] = useState({
    businessName: 'Comzilo Official Store',
    phoneNumberId: '109283746501',
    whatsappNumber: '+1 555 019 2831',
    accessToken: 'eaag_mock_whatsapp_cloud_api_token_xyz987',
    verifyToken: 'comzilo_verify_token_2026',
    webhookSecret: 'whsec_comzilo_meta_2026',
    businessAccountId: 'bacc_9928174625',
    enabled: true,
  });

  const [testPhone, setTestPhone] = useState('+15550192831');
  const [openTemplateModal, setOpenTemplateModal] = useState(false);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState({
    topic: 'Cart Abandonment Offer',
    tone: 'Persuasive & Friendly',
    discount: '15% OFF',
    emoji: true,
  });
  const [aiGeneratedText, setAiGeneratedText] = useState('');

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'Order Confirmation',
    body: '',
  });

  const templates = [
    { id: 1, name: 'welcome_customer', category: 'Welcome', status: 'APPROVED', body: 'Hello {{customer_name}}, welcome to {{store_name}}!' },
    { id: 2, name: 'order_confirmation', category: 'Order Confirmation', status: 'APPROVED', body: 'Hi {{customer_name}}, your order #{{order_number}} of {{payment_amount}} is confirmed!' },
    { id: 3, name: 'order_shipped', category: 'Order Shipped', status: 'APPROVED', body: 'Your order #{{order_number}} is shipped! Track here: {{tracking_link}}' },
    { id: 4, name: 'abandoned_cart_reminder', category: 'Abandoned Cart', status: 'APPROVED', body: 'Hi {{customer_name}}, you left items in your cart. Use coupon {{coupon_code}} for 10% OFF!' },
  ];

  const commLogs = [
    { id: 'COMM-101', channel: 'WhatsApp', recipient: '+1 555 0192', event: 'Order Confirmation', status: 'DELIVERED', time: '10:42 AM' },
    { id: 'COMM-102', channel: 'Email', recipient: 'customer@example.com', event: 'Invoice Receipt', status: 'SENT', time: '10:30 AM' },
    { id: 'COMM-103', channel: 'WhatsApp', recipient: '+1 555 9812', event: 'Abandoned Cart Reminder', status: 'READ', time: '09:15 AM' },
  ];

  const handleSaveSettings = () => {
    toast.success('WhatsApp Business Cloud API settings saved successfully');
  };

  const handleTestConnection = () => {
    toast.success('Meta WhatsApp Cloud API Connection verified! Status: 200 OK');
  };

  const handleSendTestMessage = () => {
    if (!testPhone) {
      toast.error('Enter recipient phone number');
      return;
    }
    toast.success(`Test WhatsApp message dispatched to ${testPhone}`);
  };

  const handleGenerateAiMessage = () => {
    const gen = `🔥 Hi {{customer_name}}! Don't miss out! Use code {{coupon_code}} to get ${aiPrompt.discount} on your cart items at {{store_name}}. Click to finish checkout! 🛒✨`;
    setAiGeneratedText(gen);
    toast.success('AI WhatsApp Message Generated!');
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name) {
      toast.error('Template name required');
      return;
    }
    toast.success(`Template ${newTemplate.name} submitted for Meta approval`);
    setOpenTemplateModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Enterprise WhatsApp Automation & Communication Center
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Meta WhatsApp Cloud API integration, message templates, AI copy generator, and unified customer communication logs.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="API Settings & Connection" sx={{ fontWeight: 700 }} />
          <Tab label="Message Templates" sx={{ fontWeight: 700 }} />
          <Tab label="AI Message Generator" sx={{ fontWeight: 700 }} />
          <Tab label="Communication History" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Box>

      {/* TAB 0: SETTINGS */}
      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Meta WhatsApp Business API Credentials</Typography>
                <Divider />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Business Display Name" fullWidth value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="WhatsApp Business Number" fullWidth value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField label="Phone Number ID" fullWidth value={settings.phoneNumberId} onChange={(e) => setSettings({ ...settings, phoneNumberId: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Business Account ID" fullWidth value={settings.businessAccountId} onChange={(e) => setSettings({ ...settings, businessAccountId: e.target.value })} />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField label="Permanent Access Token" type="password" fullWidth value={settings.accessToken} onChange={(e) => setSettings({ ...settings, accessToken: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Webhook Verify Token" fullWidth value={settings.verifyToken} onChange={(e) => setSettings({ ...settings, verifyToken: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Webhook Secret" type="password" fullWidth value={settings.webhookSecret} onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })} />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={handleSaveSettings} sx={{ fontWeight: 700 }}>
                    Save Credentials
                  </Button>
                  <Button variant="outlined" onClick={handleTestConnection} startIcon={<RefreshCw size={16} />} sx={{ fontWeight: 700 }}>
                    Verify Connection
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Connection Status & Test Sandbox */}
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MessageSquare size={24} color="#059669" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Connection Status</Typography>
                </Box>
                <Chip label="ONLINE & CONNECTED" color="success" sx={{ fontWeight: 800, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Meta Cloud API Gateway is operating normally. Webhooks active.
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Send Sandbox Test Message</Typography>
                <TextField label="Recipient Phone Number" fullWidth value={testPhone} onChange={(e) => setTestPhone(e.target.value)} />
                <Button variant="contained" color="success" startIcon={<Send size={16} />} onClick={handleSendTestMessage} sx={{ fontWeight: 700 }}>
                  Send Test WhatsApp
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* TAB 1: TEMPLATES */}
      {tab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Message Templates ({templates.length})</Typography>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setOpenTemplateModal(true)} sx={{ fontWeight: 700 }}>
              Create Template
            </Button>
          </Box>

          <Grid container spacing={3}>
            {templates.map((tpl) => (
              <Grid key={tpl.id} item xs={12} sm={6}>
                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{tpl.name}</Typography>
                      <Chip label={tpl.status} color="success" size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <Chip label={tpl.category} size="small" variant="outlined" sx={{ mb: 2 }} />
                    <Paper sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{tpl.body}</Typography>
                    </Paper>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* TAB 2: AI GENERATOR */}
      {tab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Sparkles size={22} color="#2563EB" />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>AI WhatsApp Content Generator</Typography>
                </Box>
                <TextField label="Offer / Topic" fullWidth value={aiPrompt.topic} onChange={(e) => setAiPrompt({ ...aiPrompt, topic: e.target.value })} />
                <TextField label="Discount Value" fullWidth value={aiPrompt.discount} onChange={(e) => setAiPrompt({ ...aiPrompt, discount: e.target.value })} />
                <Button variant="contained" startIcon={<Bot size={18} />} onClick={handleGenerateAiMessage} sx={{ fontWeight: 700 }}>
                  Generate Message
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Generated Copy Preview</Typography>
                <Paper sx={{ p: 3, bgcolor: '#EFF6FF', borderRadius: 3, border: '1px solid #BFDBFE' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {aiGeneratedText || 'Click "Generate Message" to view AI generated WhatsApp campaign text.'}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* TAB 3: COMMUNICATION LOGS */}
      {tab === 3 && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Comm ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Channel</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Trigger Event</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{log.id}</TableCell>
                    <TableCell><Chip label={log.channel} size="small" color={log.channel === 'WhatsApp' ? 'success' : 'primary'} sx={{ fontWeight: 700 }} /></TableCell>
                    <TableCell>{log.recipient}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{log.event}</TableCell>
                    <TableCell><Chip label={log.status} color="success" size="small" sx={{ fontWeight: 700 }} /></TableCell>
                    <TableCell>{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Modal to Create WhatsApp Template */}
      <Dialog open={openTemplateModal} onClose={() => setOpenTemplateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New WhatsApp Template</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Template Name" fullWidth value={newTemplate.name} onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} />
          <TextField label="Category" fullWidth value={newTemplate.category} onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })} />
          <TextField multiline rows={3} label="Message Body with {{placeholders}}" fullWidth value={newTemplate.body} onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenTemplateModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTemplate}>Submit Template</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
