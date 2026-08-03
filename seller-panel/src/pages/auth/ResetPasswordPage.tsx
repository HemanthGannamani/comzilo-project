import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Alert, Link, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must contain an uppercase letter, lowercase letter, number, and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "New Password and Confirm Password must match",
    path: ['confirmPassword'],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setIsValidToken(false);
      setInvalidMessage('This password reset link is invalid or has expired.');
      return;
    }

    const validateToken = async () => {
      try {
        const res = await axiosInstance.get(`/auth/validate-reset-token?token=${encodeURIComponent(token)}`);
        if (res.data?.success) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setInvalidMessage(res.data?.message || 'This password reset link is invalid or has expired.');
        }
      } catch (err: any) {
        setIsValidToken(false);
        setInvalidMessage(err.response?.data?.message || 'This password reset link is invalid or has expired.');
      } finally {
        setValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    if (!token || !isValidToken) {
      toast.error('This password reset link is invalid or has expired.');
      return;
    }
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', {
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Password updated successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (validating) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={32} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Validating reset token...
        </Typography>
      </Box>
    );
  }

  if (!isValidToken) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#DC2626' }}>
          Invalid or Expired Link
        </Typography>
        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          {invalidMessage || 'This password reset link is invalid or has expired.'}
        </Alert>
        <Button
          component={RouterLink}
          to="/forgot-password"
          variant="contained"
          fullWidth
          sx={{ mb: 2, py: 1.2, fontWeight: 700 }}
        >
          Request New Reset Link
        </Button>
        <Link component={RouterLink} to="/login" variant="body2" underline="hover">
          Back to Login
        </Link>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Reset Password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create a new password for your Comzilo account.
      </Typography>

      <TextField
        {...register('password')}
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        {...register('confirmPassword')}
        label="Confirm New Password"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ mt: 2, mb: 2, py: 1.2, fontWeight: 700 }}
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link component={RouterLink} to="/login" variant="body2" underline="hover">
          Back to Login
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
