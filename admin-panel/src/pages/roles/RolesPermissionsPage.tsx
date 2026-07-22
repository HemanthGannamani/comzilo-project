import React from 'react';
import { Box, Paper, Typography, Chip, Grid } from '@mui/material';
import { ShieldCheck } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';

export const RolesPermissionsPage: React.FC = () => {
  const roles = [
    { title: 'SUPER_ADMIN', permissions: ['*'], description: 'Full unconstrained platform control' },
    { title: 'TENANT_ADMIN', permissions: ['tenant.*', 'store.*', 'user.*', 'product.*'], description: 'Tenant organization administrator' },
    { title: 'STORE_MANAGER', permissions: ['store.read', 'product.*', 'inventory.*', 'pos.access'], description: 'Single store manager' },
    { title: 'POS_CASHIER', permissions: ['pos.access', 'order.read', 'receipt.read'], description: 'POS kiosk operator' },
  ];

  return (
    <PageContainer title="Enterprise RBAC Matrix" subtitle="Global role definitions and security permission mappings">
      <Grid container spacing={3}>
        {roles.map((r, idx) => (
          <Grid key={idx} item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <ShieldCheck size={22} color="#2563EB" />
                <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                  {r.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {r.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {r.permissions.map((p, i) => (
                  <Chip key={i} label={p} size="small" variant="outlined" />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};
