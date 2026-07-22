import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft, MonitorCheck } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

export const PosLayout: React.FC = () => {
  const navigate = useNavigate();
  const { tenant } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard')} color="inherit" sx={{ mr: 2 }}>
            Exit POS
          </Button>
          <MonitorCheck size={24} style={{ marginRight: 8 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>
            Comzilo POS Kiosk Terminal - {tenant?.name || 'Store'}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
            <MonitorCheck size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
