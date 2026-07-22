import React from 'react';
import { Box, Paper, Typography, Button, Grid, Chip } from '@mui/material';
import { Webhook, ShoppingBag, CreditCard, RefreshCw } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useGetIntegrationsQuery } from '../../../api/endpoints/platformApi';
import toast from 'react-hot-toast';

export const IntegrationsPage: React.FC = () => {
  const { data } = useGetIntegrationsQuery();

  const handleSync = (name: string) => {
    toast.success(`Data synchronization triggered for ${name}`);
  };

  const apps = data?.data?.integrations || [
    { id: 1, name: 'Shopify Storefront Connector', category: 'Marketplace', status: 'Connected', icon: <ShoppingBag size={28} color="#95BF47" /> },
    { id: 2, name: 'Stripe Payments Gateway', category: 'Payment Processor', status: 'Connected', icon: <CreditCard size={28} color="#635BFF" /> },
    { id: 3, name: 'WooCommerce Sync App', category: 'Marketplace', status: 'Available', icon: <Webhook size={28} color="#96588A" /> },
  ];

  return (
    <PageContainer title="Marketplace Integrations" subtitle="Connect external channels, marketplaces, and payment processors">
      <Grid container spacing={3}>
        {apps.map((app: any) => (
          <Grid key={app.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {app.icon || <Webhook size={28} />}
                <Chip label={app.status} color={app.status === 'Connected' ? 'success' : 'default'} size="small" />
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
                startIcon={<RefreshCw size={14} />}
                onClick={() => handleSync(app.name)}
                sx={{ mt: 1 }}
              >
                Sync Now
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};
