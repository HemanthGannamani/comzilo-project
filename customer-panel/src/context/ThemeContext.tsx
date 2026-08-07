import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setMode: () => {},
});

export const useCustomTheme = () => useContext(ThemeContext);

const STORAGE_KEY = 'comzilo_customer_theme_mode';

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563EB',
            light: '#60A5FA',
            dark: '#1D4ED8',
          },
          secondary: {
            main: '#8B5CF6',
          },
          success: {
            main: '#10B981',
          },
          error: {
            main: '#DC2626',
          },
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
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                borderColor: mode === 'dark' ? '#334155' : '#E2E8F0',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'dark' ? '#1E293B' : '#FFFFFF',
                color: mode === 'dark' ? '#F8FAFC' : '#0F172A',
                borderBottom: mode === 'dark' ? '1px solid #334155' : '1px solid #E2E8F0',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: mode === 'dark' ? '#334155' : '#E2E8F0',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
