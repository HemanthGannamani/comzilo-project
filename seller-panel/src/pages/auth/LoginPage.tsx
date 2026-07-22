import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Link } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await axiosInstance.post('/auth/login', data);
      const authData = res.data.data;

      dispatch(
        setCredentials({
          user: authData.user,
          tenant: authData.tenant,
          stores: authData.stores || [],
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        })
      );

      toast.success(`Welcome back, ${authData.user.firstName}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Sign In
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your administrative credentials to access Comzilo ERP.
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <TextField
        {...register('email')}
        label="Email Address"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        {...register('password')}
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
        <Link component={RouterLink} to="/forgot-password" variant="body2" underline="hover">
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isLoading}
        sx={{ py: 1.2, fontWeight: 700 }}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Don't have a Seller Account?{' '}
          <Link component={RouterLink} to="/seller/register" variant="body2" sx={{ fontWeight: 700 }}>
            Apply as Seller
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
