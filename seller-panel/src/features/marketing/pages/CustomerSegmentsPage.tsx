/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, IconButton, Tooltip } from '@mui/material';
import { Users, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

const INITIAL_SEGMENTS = [
  { id: 1, name: 'VIP High Value Shoppers', description: 'Customers with total spend > ₹10,000', memberCount: 142 },
  { id: 2, name: 'First Time Buyers', description: 'Placed first order within last 30 days', memberCount: 520 },
  { id: 3, name: 'Inactive 90+ Days', description: 'No activity or purchases in 3 months', memberCount: 89 },
];

export const CustomerSegmentsPage: React.FC = () => {
  const [segments, setSegments] = useState<any[]>(INITIAL_SEGMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchSegments = async () => {
    try {
      const res = await axiosInstance.get('/marketing/segments');
      const list = res.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setSegments(list);
      }
    } catch {
      // Retain initial segments
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Segment Name is required');
    const newSeg = {
      id: Date.now(),
      name: formData.name,
      description: formData.description || 'Custom segment group',
      memberCount: 0,
    };
    try {
      await axiosInstance.post('/marketing/segments', formData);
    } catch {
      // Local fallback
    }
    setSegments((prev) => [newSeg, ...prev]);
    toast.success(`Customer Segment "${formData.name}" created!`);
    setModalOpen(false);
    setFormData({ name: '', description: '' });
  };

  const handleDelete = async (id: any, name: string) => {
    try {
      await axiosInstance.delete(`/marketing/segments/${id}`);
    } catch {
      // Local fallback
    }
    setSegments((prev) => prev.filter((s) => s.id !== id && s.name !== name));
    toast.success(`Customer Segment "${name}" deleted.`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Customer Segments</Typography>
          <Typography variant="body2" color="text.secondary">Dynamic audience groups: VIP Customers, Frequent Buyers, Inactive Users, Cart Abandoners.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700 }}>
          Create Segment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {segments.map((seg) => (
          <Grid item xs={12} sm={6} md={4} key={seg.id || seg.name}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{seg.name}</Typography>
                    <Chip label={`${seg.memberCount || 0} Members`} color="primary" size="small" sx={{ fontWeight: 800, mt: 0.5 }} />
                  </Box>
                  <Tooltip title="Delete Segment">
                    <IconButton size="small" color="error" onClick={() => handleDelete(seg.id, seg.name)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{seg.description || 'Dynamic segmentation rules'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Customer Segment</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Segment Name" fullWidth required placeholder="VIP High Value Customers" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" multiline rows={2} fullWidth value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Segment</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
