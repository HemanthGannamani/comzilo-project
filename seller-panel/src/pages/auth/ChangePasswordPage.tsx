import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { Lock, Key, ShieldCheck } from 'lucide-react';

export const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentPassword) {
      setErrorMsg('Please enter your current temporary password');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      toast.success('Password updated successfully! Welcome to Comzilo Seller Portal.');

      if (authState.user) {
        dispatch(
          setCredentials({
            ...authState,
            user: {
              ...authState.user,
              mustChangePassword: false,
            },
          })
        );
      }

      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update password';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 480, width: '100%', borderRadius: 3, boxShadow: 6, overflow: 'hidden' }}>
        <Box sx={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFF', p: 3, textAlign: 'center' }}>
          <ShieldCheck size={48} style={{ margin: '0 auto 12px auto' }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Change Password Required
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            You logged in with a temporary password. Please set a new password to continue.
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Temporary Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                startAdornment: <Key size={18} style={{ marginRight: 8, color: '#64748B' }} />,
              }}
            />

            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Minimum 8 characters with letters, numbers, and special symbols"
              InputProps={{
                startAdornment: <Lock size={18} style={{ marginRight: 8, color: '#64748B' }} />,
              }}
            />

            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: <Lock size={18} style={{ marginRight: 8, color: '#64748B' }} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, py: 1.4, fontWeight: 700, bgcolor: '#0284C7', '&:hover': { bgcolor: '#0369A1' } }}
            >
              {isLoading ? 'Updating Password...' : 'Update Password & Access Dashboard'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
