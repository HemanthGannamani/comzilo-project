import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Grid, Divider, Chip } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import { PageLoader } from '../../components/common/PageLoader';
import { UserCheck, Mail, Shield, Building, Store as StoreIcon, Badge } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';

export const ProfilePage: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile');
        setProfile(res.data.data);
      } catch {
        // Fallback to auth state if network error occurs
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <PageLoader message="Fetching profile..." />;

  // Extract user details with full fallback hierarchy (profile API response -> Redux Auth state)
  const userObj = profile?.user || profile || authState.user;
  const firstName = userObj?.firstName || authState.user?.firstName || 'User';
  const lastName = userObj?.lastName || authState.user?.lastName || '';
  const fullName =
    profile?.fullName ||
    userObj?.fullName ||
    `${firstName} ${lastName}`.trim() ||
    'Seller Admin';

  const email = userObj?.email || profile?.email || authState.user?.email || 'N/A';
  const tenantName =
    profile?.tenantName ||
    profile?.tenant?.name ||
    authState.tenant?.name ||
    'Comzilo Merchant';

  const storeName =
    profile?.storeName ||
    profile?.store?.name ||
    authState.stores?.[0]?.name ||
    'Main Store';

  const userRole =
    profile?.role ||
    userObj?.role ||
    userObj?.roles?.[0] ||
    'Seller Owner';

  const status = userObj?.status || profile?.status || authState.user?.status || 'active';
  const avatarUrl = profile?.avatar || profile?.profile?.avatarUrl || userObj?.avatar;

  // Generate Initials from First & Last Name
  const initials =
    (firstName?.[0] || '') + (lastName?.[0] || '') || 'S';

  return (
    <PageContainer title="User Profile" subtitle="Manage your account profile details and assigned roles">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                fontWeight: 800,
              }}
            >
              {!avatarUrl && initials.toUpperCase()}
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {fullName}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {email}
            </Typography>

            <Chip
              label={status.toUpperCase()}
              color="success"
              size="small"
              icon={<UserCheck size={14} />}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Account Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Mail size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Building size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Organization Tenant
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {tenantName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <StoreIcon size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Assigned Store
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {storeName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Badge size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        User Role
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {userRole}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Shield size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Assigned Permissions
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {(profile?.permissions || ['Full System Access', 'Tenant Management']).map((perm: string) => (
                          <Chip key={perm} label={perm} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
