import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { CustomerHeader } from './CustomerHeader';
import { CustomerFooter } from './CustomerFooter';

export const CustomerLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <CustomerHeader />
      <Box component="main" sx={{ flexGrow: 1, pb: 6 }}>
        <Outlet />
      </Box>
      <CustomerFooter />
    </Box>
  );
};
