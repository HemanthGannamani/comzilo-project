import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Server, Database, ShieldCheck, Clock, FileDown, PlusCircle, Trash, RotateCcw } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  useGetSystemHealthQuery,
  useGetBackupsQuery,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
} from '../../api/adminApi';
import toast from 'react-hot-toast';

export const SystemHealthPage: React.FC = () => {
  const { data: healthData, isLoading: loadingHealth } = useGetSystemHealthQuery();
  const { data: backupsData, isLoading: loadingBackups } = useGetBackupsQuery();

  const [createBackup] = useCreateBackupMutation();
  const [deleteBackup] = useDeleteBackupMutation();
  const [restoreBackup] = useRestoreBackupMutation();

  const [confirmRestoreFile, setConfirmRestoreFile] = useState<string | null>(null);

  const health = healthData?.data || {
    apiStatus: 'UP',
    databaseStatus: 'CONNECTED',
    storageUsage: 'N/A',
    appVersion: '1.0.0',
    buildVersion: '2026.07.22',
    serverTime: '',
    environment: 'development',
    timezone: '',
    databaseDriver: 'MySQL/Sequelize',
    storageDriver: 'LocalDiskFileSystem',
  };

  const backups = backupsData?.data || [];

  const handleCreateBackup = async () => {
    try {
      await createBackup().unwrap();
      toast.success('System backup created successfully');
    } catch {
      toast.error('Failed to create backup');
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    try {
      await deleteBackup(filename).unwrap();
      toast.success('Backup deleted successfully');
    } catch {
      toast.error('Failed to delete backup');
    }
  };

  const handleRestoreBackup = async () => {
    if (!confirmRestoreFile) return;
    try {
      await restoreBackup({ filename: confirmRestoreFile, confirm: true }).unwrap();
      toast.success('Database restored successfully from backup!');
      setConfirmRestoreFile(null);
    } catch {
      toast.error('Failed to restore backup');
    }
  };

  if (loadingHealth || loadingBackups) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <PageContainer
      title="System Health & Infrastructure Management"
      subtitle="Real-time monitoring of Node.js services, database connections, environment specs, and backup actions"
    >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* API Server Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #2563EB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Server color="#2563EB" size={24} />
              <Chip label={health.apiStatus} color="success" size="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Node.js Server</Typography>
            <Typography variant="caption" color="text.secondary">Driver: Express v4.x</Typography>
          </Paper>
        </Grid>

        {/* Database Connection Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #10B981' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Database color="#10B981" size={24} />
              <Chip label={health.databaseStatus} color="success" size="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>MySQL Database</Typography>
            <Typography variant="caption" color="text.secondary">Driver: {health.databaseDriver}</Typography>
          </Paper>
        </Grid>

        {/* Storage Engine Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #F59E0B' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <ShieldCheck color="#F59E0B" size={24} />
              <Chip label={health.storageUsage} color="warning" size="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Storage Volume</Typography>
            <Typography variant="caption" color="text.secondary">Driver: {health.storageDriver}</Typography>
          </Paper>
        </Grid>

        {/* Server Time Zone Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #8B5CF6' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Clock color="#8B5CF6" size={24} />
              <Chip label="UTC" size="small" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Timezone Specs</Typography>
            <Typography variant="caption" color="text.secondary">{health.timezone}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Environment Config Info Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>Environment Configuration</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Application Version</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{health.appVersion}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Build Identifier</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{health.buildVersion}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Runtime Environment</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>
                      <Chip label={health.environment.toUpperCase()} size="small" color="primary" />
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Database Driver</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{health.databaseDriver}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Storage Driver</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{health.storageDriver}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Backups Management */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>System Backups</Typography>
              <Button variant="contained" startIcon={<PlusCircle size={16} />} onClick={handleCreateBackup} sx={{ fontWeight: 700 }}>
                Trigger Backup
              </Button>
            </Box>

            <TableContainer sx={{ border: '1px solid #F1F5F9', borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Filename</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Size</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Created Date</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {backups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No system backup files archived yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    backups.map((b: any) => (
                      <TableRow key={b.filename} hover>
                        <TableCell sx={{ fontWeight: 700, color: '#334155' }}>{b.filename}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{b.size}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{new Date(b.createdAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<FileDown size={14} />}
                              onClick={() => {
                                window.open(`/api/v1/admin/backups/${b.filename}`);
                              }}
                            >
                              Download
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="warning"
                              startIcon={<RotateCcw size={14} />}
                              onClick={() => setConfirmRestoreFile(b.filename)}
                            >
                              Restore
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Trash size={14} />}
                              onClick={() => handleDeleteBackup(b.filename)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Restore Dialog */}
      <Dialog open={!!confirmRestoreFile} onClose={() => setConfirmRestoreFile(null)}>
        <DialogTitle sx={{ fontWeight: 850 }}>Confirm Database Restoration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>WARNING:</strong> Restoring the system database using <strong>{confirmRestoreFile}</strong> will wipe out all current sellers, tenants, and store updates. This action is irreversible. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmRestoreFile(null)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleRestoreBackup} variant="contained" color="error" sx={{ fontWeight: 700 }}>
            Yes, Overwrite & Restore
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
