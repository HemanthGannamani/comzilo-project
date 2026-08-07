import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import { User, Save, Upload, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { updateUser } from '../../store/authSlice';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useGetCustomerProfileQuery, useUpdateCustomerProfileMutation } from '../../api/customerPortalApi';
import { UserAvatar } from '../../components/common/UserAvatar';
import toast from 'react-hot-toast';

export const CustomerProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: profileData, isLoading } = useGetCustomerProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateCustomerProfileMutation();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data;
      setFormData({
        firstName: p.firstName || '',
        lastName: p.lastName || '',
        email: p.email || '',
        phone: p.phone || '',
        gender: p.gender || '',
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
      });
      const img = p.avatarUrl || p.profileImage || null;
      if (img) {
        setAvatarPreview(img);
      }
      dispatch(updateUser({
        firstName: p.firstName,
        lastName: p.lastName,
        avatarUrl: img,
        profileImage: img,
      }));
    }
  }, [profileData, dispatch]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        setAvatarPreview(photoData);
        dispatch(updateUser({
          avatarUrl: photoData,
          profileImage: photoData,
        }));
        toast.success('Photo selected! Click Save Profile Changes to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('First name, last name, and email are required');
      return;
    }

    try {
      const payload = {
        ...formData,
        avatarUrl: avatarPreview || undefined,
        profileImage: avatarPreview || undefined,
      };
      const res = await updateProfile(payload).unwrap();
      const updated = res.data || res;
      const img = updated?.avatarUrl || updated?.profileImage || avatarPreview;
      dispatch(updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        avatarUrl: img,
        profileImage: img,
      }));
      toast.success('Profile details & photo updated successfully!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <CustomerAccountLayout>
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          My Profile Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage your personal contact information, gender, and date of birth settings.
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {/* Avatar & Photo Upload Block */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, pb: 3, borderBottom: '1px solid #F1F5F9' }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoSelect}
              />
              <UserAvatar
                src={avatarPreview}
                firstName={formData.firstName}
                lastName={formData.lastName}
                size={80}
                border="3px solid #38BDF8"
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Profile Avatar
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  JPG or PNG max size 2MB.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Upload size={14} />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New Photo
                </Button>
              </Box>
            </Box>

            {/* Profile Input Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Gender"
                  fullWidth
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other / Rather not say</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  label="Date of Birth"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save size={18} />}
                disabled={isUpdating}
                sx={{ borderRadius: 2, fontWeight: 700, px: 4 }}
              >
                {isUpdating ? 'Saving Changes...' : 'Save Profile Changes'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </CustomerAccountLayout>
  );
};
