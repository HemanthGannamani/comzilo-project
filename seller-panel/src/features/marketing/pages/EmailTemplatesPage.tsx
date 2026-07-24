/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { FileText, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const EmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', subject: '', bodyHtml: '' });

  const fetchTemplates = async () => {
    try {
      const res = await axiosInstance.get('/marketing/email-templates');
      setTemplates(res.data?.data || []);
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        toast.error(err?.response?.data?.message || 'Failed to load email templates');
      }
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return toast.error('Template name required');
    try {
      await axiosInstance.post('/marketing/email-templates', formData);
      toast.success('Email template created!');
      setModalOpen(false);
      fetchTemplates();
    } catch {
      toast.error('Failed to create email template');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Email Templates</Typography>
          <Typography variant="body2" color="text.secondary">Manage HTML & Text email templates for Welcome, Orders, Abandoned Cart, and Promotions.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700 }}>
          Create Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {templates.map((tpl) => (
          <Grid item xs={12} sm={6} md={4} key={tpl.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{tpl.name}</Typography>
                  <Chip label={(tpl.channel || 'email').toUpperCase()} color="primary" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">Subject: {tpl.subject || tpl.subjectTemplate || tpl.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create Email Template</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Template Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Subject Line" fullWidth value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="HTML Content" multiline rows={4} fullWidth value={formData.bodyHtml} onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Template</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
