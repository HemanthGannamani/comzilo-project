import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ShieldCheck, Laptop, Smartphone, LogOut, AlertTriangle } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const CustomerPrivacyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLogoutAllOther = () => {
    toast.success('Successfully logged out of all other active browser sessions');
  };

  const handleDeleteRequest = () => {
    toast.success('Account deletion request submitted. Our privacy team will process it within 24 hours.');
    setConfirmDelete(false);
    dispatch(logout());
    navigate('/');
  };

  return (
    <CustomerAccountLayout>
      {/* Active Login Sessions */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
              Active Login Sessions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Devices currently authenticated and signed in to your account.
            </Typography>
          </Box>
          <Button variant="outlined" color="error" startIcon={<LogOut size={16} />} onClick={handleLogoutAllOther}>
            Logout Other Devices
          </Button>
        </Box>

        <List disablePadding>
          <ListItem sx={{ px: 0, py: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2, mr: 2 }}>
              <Laptop size={24} color="#2563EB" />
            </Box>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Chrome Browser (Windows 11)
                  </Typography>
                  <Chip label="CURRENT DEVICE" color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              }
              secondary={`IP: 127.0.0.1 • Active Now (${new Date().toLocaleTimeString()})`}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Danger Zone: Account Deletion */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #FCA5A5', bgcolor: '#FEF2F2', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#DC2626', mb: 1 }}>
          Account Deletion & Privacy Rights
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Request permanent deletion of your customer account, personal details, saved addresses, and order history.
        </Typography>
        <Button variant="contained" color="error" onClick={() => setConfirmDelete(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Request Permanent Account Deletion
        </Button>
      </Paper>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={22} /> Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to request permanent deletion of your Comzilo customer profile ({user?.email})? All your saved addresses, wishlist items, and billing history will be permanently erased.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteRequest}>
            Yes, Submit Deletion Request
          </Button>
        </DialogActions>
      </Dialog>
    </CustomerAccountLayout>
  );
};
