import React from 'react';
import { Box, Paper, Typography, Button, Grid, Chip } from '@mui/material';
import { Check } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';

export const SubscriptionPlansPage: React.FC = () => {
  const plans = [
    {
      id: 1,
      name: 'Starter Plan',
      price: '$49/mo',
      stores: '1 Store Location',
      users: 'Up to 5 Users',
      features: ['Basic Catalog', 'POS Terminal', 'Standard Email Support'],
    },
    {
      id: 2,
      name: 'Professional Plan',
      price: '$149/mo',
      stores: '5 Store Locations',
      users: 'Up to 25 Users',
      features: ['Multi-Warehouse Inventory', 'POS Split Payments', 'CSV Reports & Export', 'Priority Support'],
      popular: true,
    },
    {
      id: 3,
      name: 'Enterprise Monolith',
      price: '$499/mo',
      stores: 'Unlimited Stores',
      users: 'Unlimited Staff',
      features: ['Unlimited Warehouses', 'Webhooks & HMAC', 'Custom Integrations', '24/7 SLA Support'],
    },
  ];

  return (
    <PageContainer title="SaaS Subscription Plans" subtitle="Manage pricing tiers, feature limits, and subscription entitlements">
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid key={plan.id} item xs={12} md={4}>
            <Paper
              sx={{
                p: 3.5,
                borderRadius: 3,
                border: plan.popular ? '2px solid #2563EB' : '1px solid #E2E8F0',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <Chip label="MOST POPULAR" color="primary" size="small" sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 700 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                {plan.name}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                {plan.price}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {plan.stores}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {plan.users}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {plan.features.map((feat, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={18} color="#10B981" />
                    <Typography variant="body2">{feat}</Typography>
                  </Box>
                ))}
              </Box>

              <Button variant={plan.popular ? 'contained' : 'outlined'} fullWidth sx={{ fontWeight: 700, py: 1 }}>
                Edit Plan Tier
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};
