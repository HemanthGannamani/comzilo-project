import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const PageLoader: React.FC = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress size={40} />
  </Box>
);
