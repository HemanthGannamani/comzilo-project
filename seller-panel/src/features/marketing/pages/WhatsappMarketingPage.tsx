/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { MessageSquare, CheckCircle2, QrCode } from 'lucide-react';

export const WhatsappMarketingPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
          WhatsApp Marketing & Automated Messaging
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Baileys / WhatsApp Business API integration for automated Order Confirmations, Shipping Alerts, and Abandoned Cart Reminders.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <MessageSquare size={24} color="#059669" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>WhatsApp Connection Session</Typography>
              </Box>
              <Chip label="ACTIVE & CONNECTED" color="success" sx={{ fontWeight: 800, mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Connected Phone Number: +91 9876543210
              </Typography>
              <Button variant="outlined" color="error" size="small" sx={{ fontWeight: 700 }}>
                Disconnect Session
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Automated Trigger Templates</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip label="✓ Order Confirmation (WhatsApp)" color="primary" variant="outlined" />
                <Chip label="✓ Order Shipped with Tracking Link" color="primary" variant="outlined" />
                <Chip label="✓ Abandoned Cart 2-Hour Reminder" color="primary" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
