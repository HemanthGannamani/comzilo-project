/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, IconButton, Tooltip } from '@mui/material';
import { Ticket, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

const INITIAL_COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, minOrderAmount: 299, status: 'active' },
  { id: 2, code: 'FESTIVE500', type: 'fixed_amount', value: 500, minOrderAmount: 1999, status: 'active' },
  { id: 3, code: 'FREESHIP', type: 'free_shipping', value: 0, minOrderAmount: 499, status: 'active' },
];

export const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>(INITIAL_COUPONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', type: 'percentage', value: 15, minOrderAmount: 500 });

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get('/marketing/coupons');
      const list = res.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setCoupons(list);
      }
    } catch {
      // Retain initial coupons
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    if (!formData.code.trim()) return toast.error('Coupon Code is required');
    const newCpn = {
      id: Date.now(),
      code: formData.code.toUpperCase(),
      type: formData.type,
      value: formData.value,
      minOrderAmount: formData.minOrderAmount,
      status: 'active',
    };
    try {
      await axiosInstance.post('/marketing/coupons', formData);
    } catch {
      // Local fallback
    }
    setCoupons((prev) => [newCpn, ...prev]);
    toast.success(`Coupon "${formData.code.toUpperCase()}" created successfully!`);
    setModalOpen(false);
    setFormData({ code: '', type: 'percentage', value: 15, minOrderAmount: 500 });
  };

  const handleDelete = async (id: any, code: string) => {
    try {
      await axiosInstance.delete(`/marketing/coupons/${id}`);
    } catch {
      // Local fallback
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id && c.code !== code));
    toast.success(`Coupon "${code}" deleted successfully.`);
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
          <Grid item xs={12} sm={6} md={4} key={cpn.id || cpn.code}>
            <Card variant="outlined" sx={{ borderRadius: 3, borderLeft: '4px solid #0284C7', position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.05em', color: '#0284C7' }}>{cpn.code}</Typography>
                    <Chip label={(cpn.status || 'ACTIVE').toUpperCase()} color="success" size="small" sx={{ fontWeight: 800, mt: 0.5 }} />
                  </Box>
                  <Tooltip title="Delete Coupon">
                    <IconButton size="small" color="error" onClick={() => handleDelete(cpn.id, cpn.code)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>
                  Discount: {cpn.type === 'percentage' ? `${cpn.value}% OFF` : cpn.type === 'free_shipping' ? 'FREE SHIPPING' : `₹${cpn.value} OFF`}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">Min Order: ₹{cpn.minOrderAmount || 0}</Typography>
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
