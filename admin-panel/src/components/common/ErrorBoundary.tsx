import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React Error Boundary Caught Render Exception]:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Paper sx={{ p: 4, maxWidth: 550, borderRadius: 3, border: '1px solid #FECACA', bgcolor: '#FEF2F2', textAlign: 'center' }}>
            <Box sx={{ color: '#DC2626', mb: 2 }}>
              <AlertTriangle size={48} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#991B1B', mb: 1 }}>
              Application Render Exception
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              An unexpected component error occurred while rendering this page.
            </Typography>

            {this.state.error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left', fontFamily: 'monospace', fontSize: 12 }}>
                {this.state.error.message}
              </Alert>
            )}

            <Button
              variant="contained"
              color="error"
              startIcon={<RefreshCw size={18} />}
              onClick={this.handleReload}
              sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
