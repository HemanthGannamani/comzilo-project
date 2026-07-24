/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ShoppingCart, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const AbandonedCartPage: React.FC = () => {
  const [carts, setCarts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await axiosInstance.get('/marketing/abandoned-carts');
        setCarts(res.data?.data || []);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load abandoned carts');
      }
    };
    fetchCarts();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Abandoned Cart Recovery Workflows</Typography>
        <Typography variant="body2" color="text.secondary">Automated multi-touch recovery: 30m Email -&gt; 2h WhatsApp -&gt; 24h Coupon -&gt; 48h Final Reminder.</Typography>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total Value</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Workflow Step</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carts.map((cart) => (
              <TableRow key={cart.id}>
                <TableCell sx={{ fontWeight: 700 }}>{cart.customerName}</TableCell>
                <TableCell>{cart.customerEmail}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₹{cart.totalAmount}</TableCell>
                <TableCell><Chip label={cart.workflowStep} color="primary" size="small" sx={{ fontWeight: 800 }} /></TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" startIcon={<Send size={14} />} onClick={() => toast.success(`Recovery reminder sent to ${cart.customerEmail}!`)}>
                    Send Manual Reminder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
