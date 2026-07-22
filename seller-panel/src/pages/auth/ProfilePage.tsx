import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Avatar, Grid, Divider, Chip } from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import { PageLoader } from '../../components/common/PageLoader';
import { UserCheck, Mail, Shield, Building } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile');
        setProfile(res.data.data);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <PageLoader message="Fetching profile..." />;

  return (
    <PageContainer title="User Profile" subtitle="Manage your account profile details and assigned roles">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar
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
              {profile?.user?.firstName?.[0] || 'U'}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {profile?.user?.firstName} {profile?.user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {profile?.user?.email}
            </Typography>
            <Chip
              label={profile?.user?.status || 'Active'}
              color="success"
              size="small"
              icon={<UserCheck size={14} />}
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Account Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Mail size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Building size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Organization Tenant
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {profile?.tenant?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Shield size={20} color="#64748B" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Assigned Permissions
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {(profile?.permissions || ['Full System Access']).map((perm: string) => (
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
