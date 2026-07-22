import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Grid } from '@mui/material';
import { UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const CustomerRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Registration successful! Please sign in.');
    navigate('/login');
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
          <Typography component={Link} to="/login" variant="body2" sx={{ fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
            Sign In
          </Typography>
        </Typography>
      </Paper>
    </Container>
  );
};
