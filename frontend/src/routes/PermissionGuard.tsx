import React from 'react';
import { usePermission } from '../hooks/usePermission';
import { Box, Typography, Button } from '@mui/material';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, children }) => {
  const hasAccess = usePermission(permission);
  const navigate = useNavigate();

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          px: 2,
        }}
      >
        <ShieldAlert size={56} color="#EF4444" style={{ marginBottom: 16 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
          You do not have permission (`{permission}`) to access this module. Please contact your administrator.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
};
