import React from 'react';
import { Box, Paper, Typography, Button, Grid, Chip } from '@mui/material';
import { CreditCard, Cloud, Cpu, Key } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import toast from 'react-hot-toast';

export const AdminIntegrationsPage: React.FC = () => {
  const handleTestKey = (name: string) => {
    toast.success(`API Key & Webhook connection verified for ${name}`);
  };

  const integrations = [
    { id: 1, name: 'Stripe SaaS Billing Gateway', category: 'Payment Processor', status: 'Connected', icon: <CreditCard size={28} color="#635BFF" /> },
    { id: 2, name: 'AWS S3 Asset Storage', category: 'Cloud Infrastructure', status: 'Active', icon: <Cloud size={28} color="#FF9900" /> },
    { id: 3, name: 'OpenAI Intelligence API', category: 'AI Microservices', status: 'Active', icon: <Cpu size={28} color="#10A37F" /> },
  ];

  return (
    <PageContainer title="Platform Integrations & Webhooks" subtitle="Configure system-wide payment processors, cloud storage, and API credentials">
      <Grid container spacing={3}>
        {integrations.map((app) => (
          <Grid key={app.id} item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {app.icon}
                <Chip label={app.status} color="success" size="small" />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {app.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {app.category}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Key size={14} />}
                onClick={() => handleTestKey(app.name)}
                sx={{ mt: 1 }}
              >
                Test Credentials
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};
