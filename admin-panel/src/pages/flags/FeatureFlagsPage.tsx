import React, { useState } from 'react';
import { Box, Paper, Typography, Switch } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import toast from 'react-hot-toast';

export const FeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    ENABLE_TENANT_ONBOARDING_WIZARD: true,
    ENABLE_GLOBAL_PAYMENT_GATEWAY_STRIPE: true,
    ENABLE_WEBHOOK_HMAC_VERIFICATION: true,
    ENABLE_EXPERIMENTAL_AI_ANALYTICS: false,
  });

  const handleToggle = (key: string) => {
    setFlags((prev) => {
      const next = !prev[key];
      toast.success(`Platform Feature Flag '${key}' set to ${next ? 'ENABLED' : 'DISABLED'}`);
      return { ...prev, [key]: next };
    });
  };

  return (
    <PageContainer title="Global Feature Flags" subtitle="Toggle platform features and control runtime rollouts across all tenants">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.keys(flags).map((key) => (
          <Paper key={key} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {key}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control dynamic runtime availability for all tenant organizations.
              </Typography>
            </Box>
            <Switch checked={flags[key]} onChange={() => handleToggle(key)} color="primary" />
          </Paper>
        ))}
      </Box>
    </PageContainer>
  );
};
