/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { Users, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const CustomerSegmentsPage: React.FC = () => {
  const [segments, setSegments] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchSegments = async () => {
    try {
      const res = await axiosInstance.get('/marketing/segments');
      setSegments(res.data?.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load segments');
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Segment Name is required');
    try {
      await axiosInstance.post('/marketing/segments', formData);
      toast.success('Customer Segment created!');
      setModalOpen(false);
      fetchSegments();
    } catch {
      toast.error('Failed to create segment');
    }
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
          <Grid item xs={12} sm={6} md={4} key={seg.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{seg.name}</Typography>
                  <Chip label={`${seg.memberCount || 0} Members`} color="primary" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="body2" color="text.secondary">{seg.description || 'Dynamic segmentation rules'}</Typography>
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
