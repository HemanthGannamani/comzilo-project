import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { ShoppingBag, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.data?.data?.accessToken) {
        const { user, accessToken } = res.data.data;

        // Role Routing Verification
        const userRole = user?.role || 'CUSTOMER';
        if (userRole === 'SUPER_ADMIN') {
          window.location.href = 'http://localhost:4200';
          return;
        } else if (userRole === 'SELLER' || userRole === 'STORE_MANAGER' || userRole === 'TENANT_ADMIN') {
          window.location.href = 'http://localhost:5173';
          return;
        }

        dispatch(setCredentials({ user, accessToken }));
        toast.success('Welcome back to Comzilo Store!');
        navigate('/account');
      } else {
        setError('Authentication failed');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed: Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 3, textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#EFF6FF', borderRadius: '50%', mb: 2 }}>
          <ShoppingBag size={36} color="#2563EB" />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Customer Account Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to track active orders, save addresses, and manage wishlist
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email Address"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={<Lock size={18} />}
            sx={{ py: 1.5, fontWeight: 800, borderRadius: 2, mb: 2 }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary">
          Don't have a customer account?{' '}
          <Typography component={Link} to="/register" variant="body2" sx={{ fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
            Register Now
          </Typography>
        </Typography>
      </Paper>
    </Container>
  );
};
