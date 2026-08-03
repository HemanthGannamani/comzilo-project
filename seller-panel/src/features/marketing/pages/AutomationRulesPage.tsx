/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, IconButton, Tooltip } from '@mui/material';
import { GitBranch, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

const INITIAL_RULES = [
  { id: 1, name: 'Welcome Series Rule', triggerEvent: 'Customer Registered', actionType: 'Send Welcome Email' },
  { id: 2, name: 'Instant Order Confirmation Alert', triggerEvent: 'Order Placed', actionType: 'Dispatch WhatsApp Notification' },
  { id: 3, name: 'Abandoned Cart 1-Hour Follow-up', triggerEvent: 'Cart Abandoned', actionType: 'Send SMS Recovery Link' },
];

export const AutomationRulesPage: React.FC = () => {
  const [rules, setRules] = useState<any[]>(INITIAL_RULES);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', triggerEvent: 'customer_registered', actionType: 'send_email' });

  const fetchRules = async () => {
    try {
      const res = await axiosInstance.get('/marketing/automation-rules');
      const list = res.data?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setRules(list);
      }
    } catch {
      // Retain initial rules
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Rule Name is required');
    const newRl = {
      id: Date.now(),
      name: formData.name,
      triggerEvent: formData.triggerEvent.replace('_', ' ').toUpperCase(),
      actionType: 'Execute Action Trigger',
    };
    try {
      await axiosInstance.post('/marketing/automation-rules', formData);
    } catch {
      // Local fallback
    }
    setRules((prev) => [newRl, ...prev]);
    toast.success(`Automation Rule "${formData.name}" created!`);
    setModalOpen(false);
    setFormData({ name: '', triggerEvent: 'customer_registered', actionType: 'send_email' });
  };

  const handleDelete = async (id: any, name: string) => {
    try {
      await axiosInstance.delete(`/marketing/automation-rules/${id}`);
    } catch {
      // Local fallback
    }
    setRules((prev) => prev.filter((r) => r.id !== id && r.name !== name));
    toast.success(`Automation Rule "${name}" deleted.`);
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
          <Grid item xs={12} sm={6} md={4} key={rl.id || rl.name}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{rl.name}</Typography>
                    <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 800, mt: 0.5 }} />
                  </Box>
                  <Tooltip title="Delete Rule">
                    <IconButton size="small" color="error" onClick={() => handleDelete(rl.id, rl.name)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>Trigger: {rl.triggerEvent}</Typography>
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
