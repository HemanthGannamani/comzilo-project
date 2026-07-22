import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

interface PageContainerProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  actionIcon,
  children,
}) => {
  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 3 }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800, mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actionText && onAction && (
          <Button variant="contained" startIcon={actionIcon} onClick={onAction} sx={{ fontWeight: 700 }}>
            {actionText}
          </Button>
        )}
      </Stack>
      {children}
    </Box>
  );
};
