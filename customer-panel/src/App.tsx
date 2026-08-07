import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { CustomThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <Provider store={store}>
      <CustomThemeProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </CustomThemeProvider>
    </Provider>
  );
}
