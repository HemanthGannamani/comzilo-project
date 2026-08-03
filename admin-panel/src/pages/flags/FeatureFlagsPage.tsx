/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import toast from 'react-hot-toast';

export const FeatureFlagsPage: React.FC = () => {
  const [flags, setFlags] = useState<{ [key: string]: boolean }>({
    ENABLE_TENANT_ONBOARDING_WIZARD: true,
    ENABLE_GLOBAL_PAYMENT_GATEWAY_STRIPE: true,
    ENABLE_WEBHOOK_HMAC_VERIFICATION: true,
    ENABLE_EXPERIMENTAL_AI_ANALYTICS: false,
    ENABLE_ADVANCED_DISCOUNT_COUPONS: true,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [newFlagName, setNewFlagName] = useState('');

  const handleToggle = (key: string) => {
    setFlags((prev) => {
      const next = !prev[key];
      toast.success(`Platform Feature Flag '${key}' set to ${next ? 'ENABLED' : 'DISABLED'}`);
      return { ...prev, [key]: next };
    });
  };

  const handleAddFlag = () => {
    if (!newFlagName.trim()) return toast.error('Feature Flag Name is required');
    const formattedKey = newFlagName.trim().toUpperCase().replace(/\s+/g, '_');
    setFlags((prev) => ({ ...prev, [formattedKey]: true }));
    toast.success(`Feature Flag '${formattedKey}' added successfully!`);
    setModalOpen(false);
    setNewFlagName('');
  };

  const handleDeleteFlag = (key: string) => {
    setFlags((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    toast.success(`Feature Flag '${key}' deleted.`);
  };

  return (
    <PageContainer title="Global Feature Flags" subtitle="Toggle platform features and control runtime rollouts across all tenants">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Add Feature Flag
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.keys(flags).map((key) => (
          <Paper key={key} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                {key}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control dynamic runtime availability for all tenant organizations.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Switch checked={flags[key]} onChange={() => handleToggle(key)} color="primary" />
              <Tooltip title="Delete Feature Flag">
                <IconButton size="small" color="error" onClick={() => handleDeleteFlag(key)}>
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        ))}
      </Box>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Feature Flag</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Feature Flag Key"
            fullWidth
            required
            placeholder="ENABLE_MULTI_VENDOR_CHECKOUT"
            value={newFlagName}
            onChange={(e) => setNewFlagName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddFlag} sx={{ fontWeight: 700 }}>
            Save Flag
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
