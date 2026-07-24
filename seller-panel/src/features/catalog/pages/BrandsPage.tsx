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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
} from '@mui/material';
import { Plus, Edit2, Trash2, Globe, Award, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

export const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    bannerUrl: '',
    description: '',
    isFeatured: true,
    metaTitle: '',
    metaDescription: '',
  });

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/catalog/brands');
      setBrands(res.data?.data || []);
    } catch (err: any) {
      toast.error('Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      logoUrl: '',
      bannerUrl: '',
      description: '',
      isFeatured: true,
      metaTitle: '',
      metaDescription: '',
    });
    setModalOpen(true);
  };

  const handleSaveBrand = async () => {
    if (!formData.name.trim()) {
      toast.error('Brand Name is required');
      return;
    }

    try {
      await axiosInstance.post('/catalog/brands', formData);
      toast.success('Brand created successfully!');
      setModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save brand');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Brand Master Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage manufacturer & merchant brand profiles, logos, banners, and SEO metadata.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenModal} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Add New Brand
        </Button>
      </Box>

      <Grid container spacing={3}>
        {brands.map((brand) => (
          <Grid item xs={12} sm={6} md={4} key={brand.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
              {brand.bannerUrl && (
                <Box sx={{ height: 90, bgcolor: '#F1F5F9' }}>
                  <img src={brand.bannerUrl} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              )}
              <CardContent sx={{ pt: brand.bannerUrl ? 2 : 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Avatar src={brand.logoUrl} sx={{ width: 48, height: 48, bgcolor: '#0284C7', fontWeight: 800 }}>
                    {brand.name?.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {brand.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Slug: /{brand.slug}
                    </Typography>
                  </Box>
                  {brand.isFeatured && <Chip label="FEATURED" color="primary" size="small" sx={{ fontWeight: 800, height: 20 }} />}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {brand.description || 'No description provided.'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CREATE BRAND MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Brand</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Brand Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Brand Logo URL" fullWidth placeholder="https://..." value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Brand Banner URL" fullWidth placeholder="https://..." value={formData.bannerUrl} onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description" multiline rows={2} fullWidth value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveBrand} sx={{ fontWeight: 700 }}>Save Brand</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
