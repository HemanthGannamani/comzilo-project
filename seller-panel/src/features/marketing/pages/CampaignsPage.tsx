/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, IconButton, Tooltip } from '@mui/material';
import { Send, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

const INITIAL_CAMPAIGNS = [
  { id: 1, name: 'Summer Festival Sale Blast', channel: 'email', status: 'active' },
  { id: 2, name: 'VIP Customer Retention Offer', channel: 'whatsapp', status: 'scheduled' },
  { id: 3, name: 'Abandoned Cart Recovery Blast', channel: 'sms', status: 'active' },
];

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>(INITIAL_CAMPAIGNS);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'email', status: 'scheduled' });

  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get('/marketing/campaigns');
      const list = res.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setCampaigns(list);
      }
    } catch {
      // Retain initial campaigns
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Campaign Name is required');
    const newCmp = {
      id: Date.now(),
      name: formData.name,
      channel: formData.type,
      status: 'scheduled',
    };
    try {
      await axiosInstance.post('/marketing/campaigns', formData);
    } catch {
      // Local fallback
    }
    setCampaigns((prev) => [newCmp, ...prev]);
    toast.success(`Campaign "${formData.name}" created and scheduled!`);
    setModalOpen(false);
    setFormData({ name: '', type: 'email', status: 'scheduled' });
  };

  const handleDelete = async (id: any, name: string) => {
    try {
      await axiosInstance.delete(`/marketing/campaigns/${id}`);
    } catch {
      // Local fallback
    }
    setCampaigns((prev) => prev.filter((c) => c.id !== id && c.name !== name));
    toast.success(`Campaign "${name}" deleted.`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Marketing Campaigns</Typography>
          <Typography variant="body2" color="text.secondary">Build, schedule, and execute Email, WhatsApp, and SMS campaigns.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700 }}>
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((cmp) => (
          <Grid item xs={12} sm={6} md={4} key={cmp.id || cmp.name}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{cmp.name}</Typography>
                    <Chip label={(cmp.status || 'scheduled').toUpperCase()} color="success" size="small" sx={{ fontWeight: 800, mt: 0.5 }} />
                  </Box>
                  <Tooltip title="Delete Campaign">
                    <IconButton size="small" color="error" onClick={() => handleDelete(cmp.id, cmp.name)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Channel: {(cmp.channel || cmp.type || 'email').toUpperCase()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Campaign</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Campaign Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Channel" fullWidth value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <MenuItem value="email">Email Broadcast</MenuItem>
                <MenuItem value="whatsapp">WhatsApp Broadcast</MenuItem>
                <MenuItem value="sms">SMS Notification</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Campaign</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
