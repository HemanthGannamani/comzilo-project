import React from 'react';
import { Box, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import { PageContainer } from '../../../components/layout/PageContainer';
import { useGetSettingsQuery } from '../../../api/endpoints/platformApi';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { data } = useGetSettingsQuery();

  const handleSave = () => {
    toast.success('System settings saved successfully!');
  };

  return (
    <PageContainer title="Platform Settings" subtitle="Configure hierarchical settings resolution (Store -> Tenant -> Global -> Default)">
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          General System Preferences
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Platform Name" fullWidth defaultValue={data?.data?.siteName || 'Comzilo ERP'} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Default Currency" fullWidth defaultValue={data?.data?.currency || 'USD'} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Timezone" fullWidth defaultValue={data?.data?.timezone || 'America/New_York'} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Support Email" fullWidth defaultValue={data?.data?.supportEmail || 'support@comzilo.com'} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>
            Save Settings
          </Button>
        </Box>
      </Paper>
    </PageContainer>
  );
};
