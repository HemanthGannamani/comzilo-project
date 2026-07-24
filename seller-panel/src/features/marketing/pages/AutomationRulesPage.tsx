/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip } from '@mui/material';
import { GitBranch, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const AutomationRulesPage: React.FC = () => {
  const [rules, setRules] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', triggerEvent: 'customer_registered', actionType: 'send_email' });

  const fetchRules = async () => {
    try {
      const res = await axiosInstance.get('/marketing/automation-rules');
      setRules(res.data?.data || []);
    } catch {
      toast.error('Failed to load automation rules');
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Rule Name is required');
    try {
      await axiosInstance.post('/marketing/automation-rules', formData);
      toast.success('Automation Rule created!');
      setModalOpen(false);
      fetchRules();
    } catch {
      toast.error('Failed to create rule');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Workflow Automation Rules</Typography>
          <Typography variant="body2" color="text.secondary">Automated triggers: Registration -&gt; Welcome Email, Order Placed -&gt; WhatsApp Alert, Order Delivered -&gt; Review Request.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700 }}>
          Create Rule
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rules.map((rl) => (
          <Grid item xs={12} sm={6} md={4} key={rl.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{rl.name}</Typography>
                  <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">Trigger: {rl.triggerEvent}</Typography>
                <Typography variant="caption" color="text.secondary" display="block">Action: {rl.actionType}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Automation Rule</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Rule Name" fullWidth required placeholder="Welcome Series Rule" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Trigger Event" fullWidth value={formData.triggerEvent} onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })}>
                <MenuItem value="customer_registered">Customer Registered</MenuItem>
                <MenuItem value="order_placed">Order Placed</MenuItem>
                <MenuItem value="order_delivered">Order Delivered</MenuItem>
                <MenuItem value="cart_abandoned">Cart Abandoned</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Rule</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
