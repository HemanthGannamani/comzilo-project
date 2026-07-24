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
} from '@mui/material';
import { Plus, Layers, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);
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
      setCollections(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load collections');
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Collection Name is required');
    try {
      await axiosInstance.post('/catalog/collections', formData);
      toast.success('Collection created successfully!');
      setModalOpen(false);
      fetchCollections();
    } catch (err: any) {
      toast.error('Failed to save collection');
    }
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
          <Grid item xs={12} sm={6} md={4} key={col.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{col.name}</Typography>
                  <Chip label={col.type.toUpperCase()} color="primary" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="body2" color="text.secondary">{col.description || 'No description'}</Typography>
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
                <MenuItem value="manual">Manual Collection</MenuItem>
                <MenuItem value="smart">Smart Rule Collection</MenuItem>
                <MenuItem value="seasonal">Seasonal Collection</MenuItem>
                <MenuItem value="flash_sale">Flash Sale Collection</MenuItem>
                <MenuItem value="homepage">Homepage Collection</MenuItem>
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
