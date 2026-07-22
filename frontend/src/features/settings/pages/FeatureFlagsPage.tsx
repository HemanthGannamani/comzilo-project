import React, { useState } from 'react';
import { Box, Paper, Typography, Switch } from '@mui/material';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useGetFeatureFlagsQuery } from '../../../api/endpoints/platformApi';
import toast from 'react-hot-toast';

export const FeatureFlagsPage: React.FC = () => {
  useGetFeatureFlagsQuery();
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    ENABLE_POS_SPLIT_PAYMENT: true,
    ENABLE_MULTI_WAREHOUSE_TRANSFER: true,
    ENABLE_WEBHOOK_HMAC_VERIFICATION: true,
    ENABLE_MARKETPLACE_SHOPIFY_SYNC: true,
  });

  const handleToggle = (key: string) => {
    setFlags((prev) => {
      const next = !prev[key];
      toast.success(`Feature flag '${key}' set to ${next ? 'ENABLED' : 'DISABLED'}`);
      return { ...prev, [key]: next };
    });
  };

  return (
    <PageContainer title="Global Feature Flags" subtitle="Manage dynamic feature toggles and experimental rollouts">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.keys(flags).map((key) => (
          <Paper key={key} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {key}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control runtime evaluation state across all active store locations.
              </Typography>
            </Box>
            <Switch checked={flags[key]} onChange={() => handleToggle(key)} color="primary" />
          </Paper>
        ))}
      </Box>
    </PageContainer>
  );
};
