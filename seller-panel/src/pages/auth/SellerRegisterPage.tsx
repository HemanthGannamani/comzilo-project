/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    businessName: z.string().min(2, 'Business Name is required'),
    businessType: z.enum(['Retail', 'Wholesale', 'Manufacturer', 'Distributor', 'Other']),
    preferredStoreName: z.string().min(2, 'Preferred Store Name is required'),
    ownerName: z.string().min(2, 'Owner Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    gstNumber: z.string().optional(),
    panNumber: z.string().optional(),
    addressLine1: z.string().min(2, 'Address Line 1 is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().min(2, 'Country is required'),
    postalCode: z.string().min(2, 'Postal Code is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const SellerRegisterPage: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    applicationNumber: string;
    email: string;
  } | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessType: 'Retail',
      country: 'United States',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await axiosInstance.post('/seller-applications', data);
      const appData = res.data.data;
      setSuccessData({
        applicationNumber: appData.applicationNumber,
        email: data.email,
      });
      toast.success('Seller application submitted successfully!');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to submit seller application. Please check your information.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
          Seller Partner Application
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join the Comzilo Commerce Network. Submit your business details to apply for a seller store.
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 1 }}>
            1. Business Information
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              {...register('businessName')}
              label="Business / Company Name *"
              fullWidth
              error={!!errors.businessName}
              helperText={errors.businessName?.message}
            />
            <TextField
              {...register('businessType')}
              select
              label="Business Type *"
              fullWidth
              defaultValue="Retail"
              error={!!errors.businessType}
              helperText={errors.businessType?.message}
            >
              <MenuItem value="Retail">Retail</MenuItem>
              <MenuItem value="Wholesale">Wholesale</MenuItem>
              <MenuItem value="Manufacturer">Manufacturer</MenuItem>
              <MenuItem value="Distributor">Distributor</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              {...register('preferredStoreName')}
              label="Preferred Store Name *"
              fullWidth
              error={!!errors.preferredStoreName}
              helperText={errors.preferredStoreName?.message}
            />
            <TextField
              {...register('gstNumber')}
              label="GST / Tax ID Number"
              fullWidth
              error={!!errors.gstNumber}
              helperText={errors.gstNumber?.message}
            />
            <TextField
              {...register('panNumber')}
              label="PAN Number"
              fullWidth
              error={!!errors.panNumber}
              helperText={errors.panNumber?.message}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. Owner & Contact Details
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              {...register('ownerName')}
              label="Owner / Contact Person Full Name *"
              fullWidth
              error={!!errors.ownerName}
              helperText={errors.ownerName?.message}
            />
            <TextField
              {...register('email')}
              label="Email Address *"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('phone')}
              label="Phone Number *"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Business Address
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('addressLine1')}
              label="Address Line 1 *"
              fullWidth
              error={!!errors.addressLine1}
              helperText={errors.addressLine1?.message}
            />
            <TextField
              {...register('addressLine2')}
              label="Address Line 2"
              fullWidth
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
            />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <TextField
                {...register('city')}
                label="City *"
                fullWidth
                error={!!errors.city}
                helperText={errors.city?.message}
              />
              <TextField
                {...register('state')}
                label="State / Province *"
                fullWidth
                error={!!errors.state}
                helperText={errors.state?.message}
              />
              <TextField
                {...register('country')}
                label="Country *"
                fullWidth
                error={!!errors.country}
                helperText={errors.country?.message}
              />
              <TextField
                {...register('postalCode')}
                label="Postal / Zip Code *"
                fullWidth
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Security Setup
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              {...register('password')}
              label="Account Password *"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              {...register('confirmPassword')}
              label="Confirm Password *"
              type="password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </Box>

          <Box sx={{ mt: 3, mb: 2 }}>
            <FormControlLabel
              control={<Checkbox {...register('acceptTerms')} color="primary" />}
              label="I agree to Comzilo Platform Terms of Service and Partner Merchant Agreement *"
            />
            {errors.acceptTerms && (
              <Typography variant="caption" color="error" display="block">
                {errors.acceptTerms.message}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem', mt: 2 }}
          >
            {isLoading ? 'Submitting Application...' : 'Submit Seller Application'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <RouterLink to="/login" style={{ color: '#1976d2', fontWeight: 600 }}>
                Sign In
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Confirmation Modal */}
      <Dialog open={!!successData} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Application Submitted!</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your application has been received and is now pending Super Admin review.
          </Alert>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Application Number:</strong> {successData?.applicationNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A confirmation email has been dispatched to <strong>{successData?.email}</strong>. You will receive seller store access credentials upon administrative approval.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Return to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
