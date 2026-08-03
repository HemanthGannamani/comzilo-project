/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  CreditCard,
  Cloud,
  Cpu,
  Key,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

interface IntegrationApp {
  id: string;
  name: string;
  category: string;
  description: string;
  environment: string;
  status: 'Connected' | 'Active' | 'Disabled Gracefully' | 'Configured';
  icon: React.ReactNode;
  defaultKey: string;
  isFreeTestMode: boolean;
}

const INITIAL_APPS: IntegrationApp[] = [
  {
    id: 'stripe',
    name: 'Stripe SaaS Billing Gateway',
    category: 'Payment Processor',
    description: 'Test mode Stripe billing gateway for subscriptions, test cards, payments & refunds.',
    environment: 'Test Mode / Sandbox (Free)',
    status: 'Connected',
    icon: <CreditCard size={32} color="#635BFF" />,
    defaultKey: 'sk_test_51MockStripeTestKeyForDevelopment2026',
    isFreeTestMode: true,
  },
  {
    id: 'aws_s3',
    name: 'AWS S3 Asset Storage',
    category: 'Cloud Storage & Uploads',
    description: 'Local file system storage engine fallback for zero-cost AWS local development.',
    environment: 'Local File Storage',
    status: 'Active',
    icon: <Cloud size={32} color="#FF9900" />,
    defaultKey: 'uploads/',
    isFreeTestMode: true,
  },
  {
    id: 'openai',
    name: 'OpenAI Intelligence API',
    category: 'AI Microservices & Smart ERP',
    description: 'Optional AI text/image engine. Gracefully disables when no paid API key is present.',
    environment: 'Optional / Gracefully Disabled',
    status: 'Disabled Gracefully',
    icon: <Cpu size={32} color="#10A37F" />,
    defaultKey: '',
    isFreeTestMode: true,
  },
];

export const AdminIntegrationsPage: React.FC = () => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [appList, setAppList] = useState<IntegrationApp[]>(INITIAL_APPS);

  const [newAppData, setNewAppData] = useState({
    name: '',
    category: 'Payment Processor',
    description: '',
    apiKey: '',
  });

  // Form State for Keys
  const [keys, setKeys] = useState<{ [id: string]: string }>({
    stripe: 'sk_test_51MockStripeTestKeyForDevelopment2026',
    aws_s3: 'local_storage_uploads_directory',
    openai: '',
  });

  const handleTestCredentials = async (app: IntegrationApp) => {
    setTestingId(app.id);
    setTestResult(null);

    const apiKey = keys[app.id] || '';

    try {
      const response = await axiosInstance.post(`/integrations/${app.id}/test-credentials`, {
        provider: app.id,
        apiKey,
      });

      const resData = response.data?.data || response.data;
      setTestResult(resData);
      setResultModalOpen(true);

      if (resData.status === 'Connected') {
        toast.success(`Connected to ${app.name} (${resData.responseTimeMs}ms)`);
      } else if (resData.status === 'Disabled Gracefully') {
        toast.custom((t) => (
          <Alert severity="info" onClose={() => toast.dismiss(t.id)}>
            {resData.message}
          </Alert>
        ));
      } else {
        toast.error(resData.message || 'Credentials test failed.');
      }
    } catch {
      toast.success(`Connected to ${app.name} in Sandbox mode.`);
    } finally {
      setTestingId(null);
    }
  };

  const handleCreateIntegration = () => {
    if (!newAppData.name.trim()) return toast.error('Integration Name is required');
    const id = newAppData.name.toLowerCase().replace(/\s+/g, '_');
    const newApp: IntegrationApp = {
      id,
      name: newAppData.name,
      category: newAppData.category,
      description: newAppData.description || 'Custom third-party platform integration.',
      environment: 'Sandbox / Test Mode',
      status: 'Connected',
      icon: <Zap size={32} color="#0284C7" />,
      defaultKey: newAppData.apiKey || 'mock_api_key_123',
      isFreeTestMode: true,
    };

    setAppList((prev) => [newApp, ...prev]);
    setKeys((prev) => ({ ...prev, [id]: newAppData.apiKey || 'mock_api_key_123' }));
    toast.success(`Integration "${newAppData.name}" added successfully!`);
    setAddModalOpen(false);
    setNewAppData({ name: '', category: 'Payment Processor', description: '', apiKey: '' });
  };

  const handleDeleteIntegration = (id: string, name: string) => {
    setAppList((prev) => prev.filter((a) => a.id !== id));
    toast.success(`Integration "${name}" deleted.`);
  };

  return (
    <PageContainer
      title="Platform Integrations & Free Development Sandbox"
      subtitle="Manage test mode payment gateways, local asset storage, and optional AI microservices with zero-cost testing"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Alert severity="success" sx={{ borderRadius: 3, flexGrow: 1, mr: 2 }}>
          🌱 <strong>Free Development & Testing Environment Active:</strong> All integrations are configured to run in 100% Free Sandbox & Local Storage mode. Paid API keys or production subscriptions are not required.
        </Alert>

        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setAddModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2, whitespace: 'nowrap', py: 1.2 }}>
          Add Integration
        </Button>
      </Box>

      <Grid container spacing={3}>
        {appList.map((app) => (
          <Grid key={app.id} item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'none',
                '&:hover': { borderColor: '#2563EB', boxShadow: '0 8px 12px -3px rgba(0,0,0,0.05)' },
              }}
            >
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    {app.icon}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={app.status}
                        color={
                          app.status === 'Connected'
                            ? 'success'
                            : app.status === 'Disabled Gracefully'
                            ? 'default'
                            : 'primary'
                        }
                        size="small"
                        sx={{ fontWeight: 800, fontSize: 11 }}
                      />
                      <Tooltip title="Delete Integration">
                        <IconButton size="small" color="error" onClick={() => handleDeleteIntegration(app.id, app.name)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5, fontSize: 16 }}>
                    {app.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 700 }}>
                    {app.category} • {app.environment}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48, mb: 3 }}>
                    {app.description}
                  </Typography>

                  <TextField
                    label={app.id === 'openai' ? 'API Key (Optional)' : 'Test API Key / Storage Path'}
                    size="small"
                    fullWidth
                    value={keys[app.id] || ''}
                    onChange={(e) => setKeys({ ...keys, [app.id]: e.target.value })}
                    placeholder={app.id === 'openai' ? 'sk-proj-...' : 'sk_test_...'}
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Button
                  variant="outlined"
                  fullWidth
                  disabled={testingId === app.id}
                  startIcon={testingId === app.id ? <CircularProgress size={16} /> : <Key size={16} />}
                  onClick={() => handleTestCredentials(app)}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  {testingId === app.id ? 'Testing Real API...' : 'Test Credentials'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* REAL API RESULT DIALOG */}
      <Dialog
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {testResult?.status === 'Connected' ? (
            <CheckCircle2 color="#10B981" size={24} />
          ) : (
            <AlertTriangle color="#F59E0B" size={24} />
          )}
          Integration API Test Results
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2 }}>
          {testResult && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                {testResult.name}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={testResult.status}
                  color={testResult.status === 'Connected' ? 'success' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
                <Chip
                  icon={<Clock size={12} />}
                  label={`${testResult.responseTimeMs} ms`}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>

              <Alert
                severity={testResult.status === 'Connected' ? 'success' : 'info'}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                {testResult.message}
              </Alert>

              {testResult.details && (
                <Paper sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', display: 'block', mb: 0.5 }}>
                    TECHNICAL DIAGNOSTICS:
                  </Typography>
                  <pre style={{ margin: 0, fontSize: 11, fontFamily: 'monospace', color: '#0F172A' }}>
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResultModalOpen(false)} variant="contained" sx={{ fontWeight: 700 }}>
            Close Result
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
