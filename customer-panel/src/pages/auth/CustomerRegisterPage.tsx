import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Grid, Alert } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../api/axiosInstance';

export const CustomerRegisterPage: React.FC = () => {
  const { storeSlug } = useParams<{ storeSlug?: string }>();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', storeSlug: storeSlug || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loginLink = storeSlug ? `/store/${storeSlug}/login` : '/login';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const activeSlug = formData.storeSlug || storeSlug;
      const headers: Record<string, string> = {};
      if (activeSlug) {
        headers['x-store-slug'] = activeSlug;
        localStorage.setItem('comzilo_active_store_slug', activeSlug);
      }

      await axiosInstance.post('/auth/register', formData, { headers });
      toast.success('Customer account registered successfully! Please sign in.');
      navigate(loginLink);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 3, textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#ECFDF5', borderRadius: '50%', mb: 2 }}>
          <UserPlus size={36} color="#10B981" />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Create Customer Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join Comzilo Store to enjoy fast checkout and order tracking
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleRegister}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Grid>
          </Grid>

          <TextField
            label="Store Code / Store ID (e.g. satish-traders)"
            fullWidth
            value={formData.storeSlug || storeSlug || ''}
            onChange={(e) => setFormData({ ...formData, storeSlug: e.target.value })}
            placeholder="satish-traders"
            sx={{ mb: 2 }}
            helperText="Enter the unique store code or merchant ID you wish to register under."
          />

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 3 }}
            required
          />

          <Button type="submit" variant="contained" color="success" fullWidth size="large" sx={{ py: 1.5, fontWeight: 800, borderRadius: 2, mb: 2 }}>
            Create Account
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Typography component={Link} to={loginLink} variant="body2" sx={{ fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
            Sign In
          </Typography>
        </Typography>
      </Paper>
    </Container>
  );
};
