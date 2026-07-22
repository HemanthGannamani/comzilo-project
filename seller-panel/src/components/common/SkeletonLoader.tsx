import React from 'react';
import { Skeleton, Box, Stack } from '@mui/material';

interface SkeletonLoaderProps {
  rows?: number;
  height?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5, height = 40 }) => {
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
      {Array.from({ length: rows }).map((_, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width="30%" height={height} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="40%" height={height} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="30%" height={height} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Stack>
  );
};
