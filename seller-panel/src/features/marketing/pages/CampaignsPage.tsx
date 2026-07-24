/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import { Send, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'email', status: 'scheduled' });

  const fetchCampaigns = async () => {
    try {
      const res = await axiosInstance.get('/marketing/campaigns');
      setCampaigns(res.data?.data || []);
    } catch {
      toast.error('Failed to load campaigns');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Campaign Name is required');
    try {
      await axiosInstance.post('/marketing/campaigns', formData);
      toast.success('Campaign created and scheduled!');
      setModalOpen(false);
      fetchCampaigns();
    } catch {
      toast.error('Failed to create campaign');
    }
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
          <Grid item xs={12} sm={6} md={4} key={cmp.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{cmp.name}</Typography>
                  <Chip label={cmp.status.toUpperCase()} color="success" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">Channel: {cmp.type.toUpperCase()}</Typography>
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
