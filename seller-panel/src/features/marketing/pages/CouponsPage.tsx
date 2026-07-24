/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import { Ticket, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', type: 'percentage', value: 15, minOrderAmount: 500 });

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get('/marketing/coupons');
      setCoupons(res.data?.data || []);
    } catch {
      toast.error('Failed to load coupons');
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    if (!formData.code.trim()) return toast.error('Coupon Code is required');
    try {
      await axiosInstance.post('/marketing/coupons', formData);
      toast.success('Coupon created successfully!');
      setModalOpen(false);
      fetchCoupons();
    } catch {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Coupon Management</Typography>
          <Typography variant="body2" color="text.secondary">Create percentage, fixed amount, BOGO, or free shipping discount coupons.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700 }}>
          Add Coupon
        </Button>
      </Box>

      <Grid container spacing={3}>
        {coupons.map((cpn) => (
          <Grid item xs={12} sm={6} md={4} key={cpn.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '4px solid #0284C7' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em', color: '#0284C7' }}>{cpn.code}</Typography>
                  <Chip label={cpn.status.toUpperCase()} color="success" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Discount: {cpn.type === 'percentage' ? `${cpn.value}% OFF` : `₹${cpn.value} OFF`}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">Min Order: ₹{cpn.minOrderAmount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Coupon</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Coupon Code" fullWidth required placeholder="SAVE20" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select label="Discount Type" fullWidth value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <MenuItem value="percentage">Percentage (%)</MenuItem>
                <MenuItem value="fixed_amount">Fixed Amount (₹)</MenuItem>
                <MenuItem value="free_shipping">Free Shipping</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Discount Value" type="number" fullWidth value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Coupon</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
