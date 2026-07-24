/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Server, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const EmailProvidersPage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axiosInstance.get('/marketing/email-providers');
        setProviders(res.data?.data || []);
      } catch {
        toast.error('Failed to load email providers');
      }
    };
    fetchProviders();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
          Email Marketing Providers & SMTP Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure SMTP servers, Amazon SES, Mailgun, Brevo, ZeptoMail, or Mailchimp APIs per tenant.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {providers.map((prov) => (
          <Grid item xs={12} sm={6} md={4} key={prov.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: prov.status === 'configured' || prov.status === 'active' ? '4px solid #059669' : '4px solid #94A3B8' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Server size={22} color="#0284C7" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{prov.name}</Typography>
                  </Box>
                  <Chip
                    label={prov.status.toUpperCase()}
                    color={prov.status === 'active' || prov.status === 'configured' ? 'success' : 'default'}
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Type: {prov.type.toUpperCase()} Provider Integration
                </Typography>
                <Button variant="outlined" size="small" fullWidth sx={{ fontWeight: 700 }}>
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
