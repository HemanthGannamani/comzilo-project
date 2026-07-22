import React from 'react';
import { Box, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import toast from 'react-hot-toast';

export const SystemSettingsPage: React.FC = () => {
  const handleSave = () => {
    toast.success('Global System Settings saved successfully');
  };

  return (
    <PageContainer title="Global System Settings" subtitle="Configure platform SMTP, storage buckets, payment gateways, and security policies">
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Platform Master Infrastructure Settings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="SaaS Platform Name" fullWidth defaultValue="Comzilo Enterprise ERP" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Super Admin Email" fullWidth defaultValue="admin@comzilo.com" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="SMTP Host" fullWidth defaultValue="smtp.sendgrid.net" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="SMTP Port" fullWidth defaultValue="587" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="AWS S3 Bucket Name" fullWidth defaultValue="comzilo-tenant-assets" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="AWS S3 Region" fullWidth defaultValue="us-east-1" />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontWeight: 700 }}>
            Save Global Settings
          </Button>
        </Box>
      </Paper>
    </PageContainer>
  );
};
