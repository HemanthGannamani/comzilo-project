import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole?: string;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user?.role || 'SUPER_ADMIN').toUpperCase();
  const currentPath = location.pathname;

  // Restricted routes for non-Super Admins
  const restrictedForStoreManager = [
    '/users',
    '/roles',
    '/tenants',
    '/subscriptions',
    '/settings',
    '/feature-flags',
    '/reports',
    '/seller-applications',
  ];

  const isRestricted =
    userRole !== 'SUPER_ADMIN' &&
    userRole !== 'PLATFORM_ADMIN' &&
    restrictedForStoreManager.some((r) => currentPath.startsWith(r));

  if (isRestricted) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 5,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid #FECDD3',
            bgcolor: '#FFF1F2',
          }}
        >
          <ShieldAlert size={64} color="#E11D48" style={{ marginBottom: 16 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#9F1239', mb: 1 }}>
            403 - Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You do not have the required RBAC security entitlements to view this page ({currentPath}). Your current role is <strong>{userRole}</strong>.
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => (window.location.href = '/dashboard')}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Return to Safety Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return <Outlet />;
};
