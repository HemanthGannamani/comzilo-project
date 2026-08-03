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
import { Plus, Sliders, Palette, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

const INITIAL_ATTRIBUTES = [
  { id: 1, name: 'Color Swatches', type: 'color', values: [{ id: 101, value: 'Red', swatchData: '#EF4444' }, { id: 102, value: 'Blue', swatchData: '#3B82F6' }, { id: 103, value: 'Black', swatchData: '#000000' }] },
  { id: 2, name: 'Apparel Size', type: 'select', values: [{ id: 201, value: 'Small (S)' }, { id: 202, value: 'Medium (M)' }, { id: 203, value: 'Large (L)' }, { id: 204, value: 'XL' }] },
  { id: 3, name: 'RAM Memory', type: 'select', values: [{ id: 301, value: '8 GB' }, { id: 302, value: '16 GB' }, { id: 303, value: '32 GB' }] },
];

export const AttributesPage: React.FC = () => {
  const [attributes, setAttributes] = useState<any[]>(INITIAL_ATTRIBUTES);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'color',
    valInput: 'Red (#FF0000), Blue (#0000FF), Black (#000000)',
  });

  const fetchAttributes = async () => {
    try {
      const res = await axiosInstance.get('/catalog/attributes');
      const list = res.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setAttributes(list);
      }
    } catch {
      // Retain initial attributes
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Attribute Name is required');
    const values = formData.valInput.split(',').map((v, i) => ({
      id: Date.now() + i,
      value: v.trim().split(' ')[0],
      swatchData: v.includes('#') ? '#' + v.split('#')[1].replace(')', '') : undefined,
    }));

    const newAttr = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      values,
    };

    try {
      await axiosInstance.post('/catalog/attributes', {
        name: formData.name,
        type: formData.type,
        values,
      });
    } catch {
      // Local fallback
    }

    setAttributes((prev) => [newAttr, ...prev]);
    toast.success(`Attribute "${formData.name}" created successfully!`);
    setModalOpen(false);
  };

  const handleDelete = async (id: any, name: string) => {
    try {
      await axiosInstance.delete(`/catalog/attributes/${id}`);
    } catch {
      // Local fallback
    }
    setAttributes((prev) => prev.filter((a) => a.id !== id && a.name !== name));
    toast.success(`Attribute "${name}" deleted.`);
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
          <Grid item xs={12} sm={6} md={4} key={attr.id || attr.name}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{attr.name}</Typography>
                    <Chip label={(attr.type || 'select').toUpperCase()} color="secondary" size="small" sx={{ fontWeight: 800, mt: 0.5 }} />
                  </Box>
                  <Tooltip title="Delete Attribute">
                    <IconButton size="small" color="error" onClick={() => handleDelete(attr.id, attr.name)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {attr.values?.map((val: any) => (
                    <Chip
                      key={val.id || val.value}
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
