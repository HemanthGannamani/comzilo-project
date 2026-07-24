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
import { Plus, Sliders, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const AttributesPage: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'color',
    valInput: 'Red (#FF0000), Blue (#0000FF), Black (#000000)',
  });

  const fetchAttributes = async () => {
    try {
      const res = await axiosInstance.get('/catalog/attributes');
      setAttributes(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load attributes');
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Attribute Name is required');
    const values = formData.valInput.split(',').map((v) => ({
      value: v.trim().split(' ')[0],
      colorCode: v.includes('#') ? '#' + v.split('#')[1].replace(')', '') : undefined,
    }));

    try {
      await axiosInstance.post('/catalog/attributes', {
        name: formData.name,
        type: formData.type,
        values,
      });
      toast.success('Attribute created successfully!');
      setModalOpen(false);
      fetchAttributes();
    } catch (err: any) {
      toast.error('Failed to save attribute');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Product Attributes & Swatches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage product specifications (Color, Size, Material, RAM, Storage) and swatch values.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Add Attribute
        </Button>
      </Box>

      <Grid container spacing={3}>
        {attributes.map((attr) => (
          <Grid item xs={12} sm={6} md={4} key={attr.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{attr.name}</Typography>
                  <Chip label={attr.type.toUpperCase()} color="secondary" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {attr.values?.map((val: any) => (
                    <Chip
                      key={val.id}
                      label={val.value}
                      size="small"
                      avatar={val.swatchData ? <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: val.swatchData, ml: 1 }} /> : undefined}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Product Attribute</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Attribute Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Attribute Type" fullWidth value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <MenuItem value="color">Color Swatch</MenuItem>
                <MenuItem value="select">Dropdown Select</MenuItem>
                <MenuItem value="text">Text Specification</MenuItem>
                <MenuItem value="number">Numeric Range</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Attribute Values (Comma-separated)" multiline rows={2} fullWidth value={formData.valInput} onChange={(e) => setFormData({ ...formData, valInput: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Attribute</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
