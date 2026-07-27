/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
} from '@mui/material';
import { Plus, Sparkles, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

export const EmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<any>(null);

  const [formData, setFormData] = useState({ name: '', code: '', subject: '', bodyHtml: '' });
  const [aiInput, setAiInput] = useState({
    purpose: 'Abandoned Cart Reminder',
    tone: 'Friendly & Persuasive',
    language: 'English',
    brand: 'Comzilo Store',
    offer: '10% OFF with code SAVE10',
    targetAudience: 'Registered Online Customers',
  });
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const res = await axiosInstance.post('/marketing/email-templates/ai-generate', aiInput);
      const generated = res.data?.data || {};
      setFormData({
        name: `AI - ${aiInput.purpose}`,
        code: `ai_${aiInput.purpose.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
        subject: generated.subject || `Special update from ${aiInput.brand}`,
        bodyHtml: generated.bodyHtml || '<p>Hi {{customer_name}}, check out our latest offers!</p>',
      });
      toast.success('AI Email Template Generated!');
      setAiModalOpen(false);
      setModalOpen(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate AI email template');
    } finally {
      setIsGenerating(false);
    }
  };

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
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Email Templates & AI Generator</Typography>
          <Typography variant="body2" color="text.secondary">Create, customize, or AI-generate HTML templates with placeholders for automatic email dispatch.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Sparkles size={18} color="#9333EA" />}
            onClick={() => setAiModalOpen(true)}
            sx={{ fontWeight: 700, borderColor: '#C084FC', color: '#7E22CE' }}
          >
            AI Template Generator
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700 }}>
            Create Template
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {templates.map((tpl) => (
          <Grid item xs={12} sm={6} md={4} key={tpl.id}>
            <Card variant="outlined" sx={{ borderRadius: 3, '&:hover': { boxShadow: 3 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{tpl.name}</Typography>
                  <Chip label={(tpl.channel || 'email').toUpperCase()} color="primary" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  Subject: {tpl.subject || tpl.subjectTemplate || tpl.name}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  startIcon={<Eye size={14} />}
                  onClick={() => {
                    setSelectedTemplateForPreview(tpl);
                    setPreviewModalOpen(true);
                  }}
                  sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                  Preview HTML
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* AI TEMPLATE GENERATOR MODAL */}
      <Dialog open={aiModalOpen} onClose={() => setAiModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, color: '#7E22CE' }}>
          <Sparkles size={22} color="#9333EA" />
          AI Email Template Generator
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Email Purpose / Category"
                fullWidth
                value={aiInput.purpose}
                onChange={(e) => setAiInput({ ...aiInput, purpose: e.target.value })}
              >
                <MenuItem value="Abandoned Cart Reminder">Abandoned Cart Reminder</MenuItem>
                <MenuItem value="Welcome Email">Welcome Email</MenuItem>
                <MenuItem value="Order Confirmation">Order Confirmation</MenuItem>
                <MenuItem value="Order Shipped">Order Shipped</MenuItem>
                <MenuItem value="Review Request">Review Request</MenuItem>
                <MenuItem value="Promotion & Deals">Promotion & Deals</MenuItem>
                <MenuItem value="Newsletter">Newsletter</MenuItem>
                <MenuItem value="Birthday Wishes">Birthday Wishes</MenuItem>
                <MenuItem value="Festival Greetings">Festival Greetings</MenuItem>
                <MenuItem value="Payment Reminder">Payment Reminder</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Brand Tone"
                fullWidth
                value={aiInput.tone}
                onChange={(e) => setAiInput({ ...aiInput, tone: e.target.value })}
              >
                <MenuItem value="Friendly & Persuasive">Friendly & Persuasive</MenuItem>
                <MenuItem value="Professional & Formal">Professional & Formal</MenuItem>
                <MenuItem value="Urgent & Exclusive">Urgent & Exclusive</MenuItem>
                <MenuItem value="Playful & Fun">Playful & Fun</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand / Store Name"
                fullWidth
                value={aiInput.brand}
                onChange={(e) => setAiInput({ ...aiInput, brand: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Special Offer / Perk"
                fullWidth
                value={aiInput.offer}
                onChange={(e) => setAiInput({ ...aiInput, offer: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Target Audience"
                fullWidth
                value={aiInput.targetAudience}
                onChange={(e) => setAiInput({ ...aiInput, targetAudience: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAiModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleGenerateAi}
            disabled={isGenerating}
            sx={{ fontWeight: 700, bgcolor: '#7E22CE', '&:hover': { bgcolor: '#6B21A8' } }}
          >
            {isGenerating ? 'Generating HTML...' : '✨ Generate AI Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* CREATE / EDIT TEMPLATE MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create / Edit Email Template</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Template Name" fullWidth required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Subject Line" fullWidth value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="HTML Email Content"
                multiline
                rows={10}
                fullWidth
                value={formData.bodyHtml}
                onChange={(e) => setFormData({ ...formData, bodyHtml: e.target.value })}
                slotProps={{
                  input: {
                    style: { fontFamily: 'monospace', fontSize: '13px' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 700 }}>Save Template</Button>
        </DialogActions>
      </Dialog>

      {/* PREVIEW HTML MODAL */}
      <Dialog open={previewModalOpen} onClose={() => setPreviewModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Preview Template: {selectedTemplateForPreview?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#F8FAFC', p: 3 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedTemplateForPreview?.bodyHtml || selectedTemplateForPreview?.body || '<p>No HTML preview available.</p>',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewModalOpen(false)}>Close Preview</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
