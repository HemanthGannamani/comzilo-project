import React, { useState } from 'react';
import { Container, Paper, Typography, Box, TextField, Button, Alert } from '@mui/material';
import { KeyRound, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const CustomerForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setSubmitted(true);
      toast.success('Password reset instructions processed.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
      <Paper sx={{ p: 4, width: '100%', borderRadius: 3, textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: submitted ? '#ECFDF5' : '#EFF6FF', borderRadius: '50%', mb: 2 }}>
          {submitted ? <CheckCircle2 size={36} color="#10B981" /> : <KeyRound size={36} color="#2563EB" />}
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your registered email address to receive password reset instructions.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            {error}
          </Alert>
        )}

        {submitted ? (
          <Box sx={{ py: 1 }}>
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left', borderRadius: 2 }}>
              If an account exists for this email, a password reset link has been sent. Please check your inbox and spam folders (link valid for 15 minutes).
            </Alert>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<ArrowLeft size={18} />}
              sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
            >
              Return to Customer Login
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={<Send size={18} />}
              sx={{ py: 1.5, fontWeight: 800, borderRadius: 2, mb: 2 }}
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </Button>

            <Typography variant="body2" color="text.secondary">
              Remembered your password?{' '}
              <Typography component={Link} to="/login" variant="body2" sx={{ fontWeight: 700, color: '#2563EB', textDecoration: 'none' }}>
                Sign In
              </Typography>
            </Typography>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default CustomerForgotPasswordPage;
