import React from 'react';
import { Container, Paper, Typography, Box, Chip, List, ListItem, ListItemText, Button, Divider } from '@mui/material';
import { Package, Truck } from 'lucide-react';
import { useGetOrdersQuery } from '../../api/catalogApi';

export const CustomerOrdersPage: React.FC = () => {
  const { data } = useGetOrdersQuery();

  const orders = data?.data?.orders || [
    { id: 'ORD-849201', date: '2026-07-20', total: 389.00, items: '2 Items (Executive Chair, Smart Watch)', status: 'In Transit' },
    { id: 'ORD-739105', date: '2026-07-14', total: 249.99, items: '1 Item (Wireless Headphones)', status: 'Delivered' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        My Order History & Live Tracking
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <List disablePadding>
          {orders.map((ord: any, idx: number) => (
            <React.Fragment key={ord.id}>
              {idx > 0 && <Divider sx={{ my: 2 }} />}
              <ListItem sx={{ px: 0, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2 }}>
                  <Package size={24} color="#2563EB" />
                </Box>
                <ListItemText
                  primary={<Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{ord.id}</Typography>}
                  secondary={`Placed on ${ord.date} • ${ord.items}`}
                />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB' }}>
                  ${ord.total}
                </Typography>
                <Chip label={ord.status} color={ord.status === 'Delivered' ? 'success' : 'primary'} size="small" sx={{ fontWeight: 700 }} />
                <Button variant="outlined" size="small" startIcon={<Truck size={14} />}>
                  Track Package
                </Button>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};
