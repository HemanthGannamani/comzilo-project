import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Grid } from '@mui/material';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useChangeMyPasswordMutation } from '../../api/customerPortalApi';
import toast from 'react-hot-toast';

export const CustomerChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [changePassword, { isLoading }] = useChangeMyPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword, confirmPassword }).unwrap();
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
  };

  return (
    <CustomerAccountLayout>
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Change Account Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Ensure your account is using a strong, unique password for maximum security.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="New Password"
                type="password"
                fullWidth
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Must be at least 8 characters with letters, numbers & symbols."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<KeyRound size={18} />}
              disabled={isLoading}
              sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </CustomerAccountLayout>
  );
};
