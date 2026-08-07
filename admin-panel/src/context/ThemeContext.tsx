import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'comzilo_admin_theme_mode';

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const useCustomTheme = () => useContext(ThemeContext);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // fallback
    }
    return 'light';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {}
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        primary: { main: '#2563EB' },
        secondary: { main: '#8B5CF6' },
        error: { main: '#DC2626' },
        background: {
          default: mode === 'dark' ? '#0F172A' : '#F8FAFC',
          paper: mode === 'dark' ? '#1E293B' : '#FFFFFF',
        },
        text: {
          primary: mode === 'dark' ? '#F8FAFC' : '#0F172A',
          secondary: mode === 'dark' ? '#94A3B8' : '#64748B',
        },
      },
      typography: {
        fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === 'dark' ? '#1E293B' : '#FFFFFF',
              color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              backgroundColor: mode === 'dark' ? '#0B1329' : '#0F172A',
              color: '#FFFFFF',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
