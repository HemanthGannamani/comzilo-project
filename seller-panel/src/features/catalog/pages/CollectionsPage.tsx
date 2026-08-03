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
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Plus, Layers, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

const INITIAL_COLLECTIONS = [
  { id: 1, name: 'Summer Essentials 2026', type: 'manual', description: 'Curated apparel & accessories for summer.', isFeatured: true, productsCount: 24 },
  { id: 2, name: 'Trending Best Sellers', type: 'smart', description: 'Auto-grouped items with sales count > 100.', isFeatured: true, productsCount: 58 },
  { id: 3, name: 'New Arrivals Drop', type: 'manual', description: 'Latest additions released this week.', isFeatured: false, productsCount: 12 },
];

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<any[]>(INITIAL_COLLECTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'manual',
    description: '',
    bannerUrl: '',
    isFeatured: true,
  });

  const fetchCollections = async () => {
    try {
      const res = await axiosInstance.get('/catalog/collections');
      const list = res.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setCollections(list);
      }
    } catch {
      // Retain initial collections
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Collection Name is required');
    const newCol = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      description: formData.description || 'Curated collection group',
      isFeatured: formData.isFeatured,
      productsCount: 0,
    };
    try {
      await axiosInstance.post('/catalog/collections', formData);
    } catch {
      // Local fallback
    }
    setCollections((prev) => [newCol, ...prev]);
    toast.success(`Collection "${formData.name}" created successfully!`);
    setModalOpen(false);
  };

  const handleDelete = async (id: any, name: string) => {
    try {
      await axiosInstance.delete(`/catalog/collections/${id}`);
    } catch {
      // Local fallback
    }
    setCollections((prev) => prev.filter((c) => c.id !== id && c.name !== name));
    toast.success(`Collection "${name}" deleted.`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Product Collections & Grouping
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage manual collections, smart rule-based groups, flash sales, and homepage sections.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Add Collection
        </Button>
      </Box>

      <Grid container spacing={3}>
        {collections.map((col) => (
          <Grid item xs={12} sm={6} md={4} key={col.id || col.name}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{col.name}</Typography>
                    <Chip label={(col.type || 'manual').toUpperCase()} color="primary" size="small" sx={{ fontWeight: 800, mt: 0.5 }} />
                  </Box>
                  <Tooltip title="Delete Collection">
                    <IconButton size="small" color="error" onClick={() => handleDelete(col.id, col.name)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{col.description || 'Product collection group'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Collection</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Collection Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Collection Type" fullWidth value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <MenuItem value="manual">Manual Selection</MenuItem>
                <MenuItem value="smart">Smart Rule-Based</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" multiline rows={2} fullWidth value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Collection</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
