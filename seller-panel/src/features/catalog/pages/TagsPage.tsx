/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Plus, Tag as TagIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#2563EB',
  });

  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get('/catalog/tags');
      setTags(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load tags');
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Tag Name is required');
    try {
      await axiosInstance.post('/catalog/tags', formData);
      toast.success('Tag created successfully!');
      setModalOpen(false);
      fetchTags();
    } catch (err: any) {
      toast.error('Failed to save tag');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Product Tags & Badges
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage tags like New Arrival, Trending, Bestseller, Premium, and Clearance.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Add New Tag
        </Button>
      </Box>

      <Grid container spacing={2}>
        {tags.map((tag) => (
          <Grid item xs={6} sm={4} md={3} key={tag.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: tag.color || '#2563EB' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{tag.name}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Tag</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Tag Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Tag Color (Hex)" fullWidth value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Tag</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
