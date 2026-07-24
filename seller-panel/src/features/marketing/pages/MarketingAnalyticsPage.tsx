/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export const MarketingAnalyticsPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Marketing Analytics & Attribution</Typography>
        <Typography variant="body2" color="text.secondary">Deep performance reports, ROI revenue attribution, campaign conversion rates, and email/WhatsApp stats.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Top Performing Campaigns</Typography>
              <Typography variant="body2" color="text.secondary">1. Summer Festival Sale 2026 (₹49,900 generated)</Typography>
              <Typography variant="body2" color="text.secondary">2. VIP Customer Exclusive 20% OFF (₹34,500 generated)</Typography>
              <Typography variant="body2" color="text.secondary">3. Abandoned Cart Recovery Series (₹18,200 generated)</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Channel Conversion Breakdown</Typography>
              <Typography variant="body2" color="text.secondary">• Email Broadcasts: 4.8% CTR (₹62,400 Total Revenue)</Typography>
              <Typography variant="body2" color="text.secondary">• WhatsApp Broadcasts: 14.2% CTR (₹40,200 Total Revenue)</Typography>
              <Typography variant="body2" color="text.secondary">• Abandoned Cart Reminders: 18.4% Recovery Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
