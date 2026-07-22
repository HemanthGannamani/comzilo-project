import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';

export const createAppTheme = (mode: 'light' | 'dark') => {
  return createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' ? '0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px rgba(0,0,0,0.06)' : 'none',
            border: mode === 'light' ? '1px solid #E2E8F0' : '1px solid #1E293B',
          },
        },
      },
    },
  });
};
