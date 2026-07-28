import React from 'react';
import { Box, Paper, Typography, Chip, Button } from '@mui/material';
import { Truck, MapPin, Navigation, Phone, CheckCircle2 } from 'lucide-react';

interface OrderNavigationMapProps {
  orderNumber: string;
  status: string;
  destinationAddress?: string;
  latitude?: number;
  longitude?: number;
}

export const OrderNavigationMap: React.FC<OrderNavigationMapProps> = ({
  orderNumber,
  status,
  destinationAddress = 'Hyderabad, Telangana, India',
  latitude = 17.385044,
  longitude = 78.486671,
}) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#F8FAFC' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Truck size={22} color="#2563EB" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Live Order Location & Navigation Map
          </Typography>
        </Box>
        <Chip
          label={`Order #${orderNumber} • ${status.toUpperCase()}`}
          color={status === 'delivered' || status === 'completed' ? 'success' : 'primary'}
          sx={{ fontWeight: 700 }}
        />
      </Box>

      {/* Embedded Navigation Map Frame */}
      <Box
        sx={{
          height: 260,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #CBD5E1',
          position: 'relative',
          mb: 2,
        }}
      >
        <iframe
          title="Order Navigation Tracking Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`}
          style={{ border: 0 }}
        />

        {/* Live Status Overlay Badge */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            p: 1.5,
            bgcolor: 'rgba(15, 23, 42, 0.9)',
            color: '#FFFFFF',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Navigation size={18} color="#38BDF8" />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#38BDF8', display: 'block', lineHeight: 1 }}>
              LIVE COURIER NAVIGATION
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
              Est. Arrival: 25 Mins (3.8 km away)
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Delivery Details Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapPin size={18} color="#EF4444" />
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
            Destination: {destinationAddress}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<Phone size={14} />}
          sx={{ borderRadius: 2, fontWeight: 700 }}
          onClick={() => alert('Courier Partner Contact: +91 98765 43210')}
        >
          Call Delivery Agent
        </Button>
      </Box>
    </Paper>
  );
};
