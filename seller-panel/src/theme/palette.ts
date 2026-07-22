import type { PaletteOptions } from '@mui/material';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0F172A',
    light: '#1E293B',
    dark: '#020617',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#64748B',
  },
  success: {
    main: '#10B981',
  },
  error: {
    main: '#EF4444',
  },
  warning: {
    main: '#F59E0B',
  },
  info: {
    main: '#06B6D4',
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#38BDF8',
    light: '#7DD3FC',
    dark: '#0284C7',
    contrastText: '#0F172A',
  },
  secondary: {
    main: '#818CF8',
    light: '#A5B4FC',
    dark: '#4F46E5',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0B0F19',
    paper: '#111827',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
  },
  success: {
    main: '#34D399',
  },
  error: {
    main: '#F87171',
  },
  warning: {
    main: '#FBBF24',
  },
  info: {
    main: '#22D3EE',
  },
};
