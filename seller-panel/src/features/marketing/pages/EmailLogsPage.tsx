/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Button,
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Mail, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { axiosInstance } from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

export const EmailLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/marketing/email-logs');
      setLogs(res.data?.data || []);
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        toast.error(err?.response?.data?.message || 'Failed to load email logs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'recipient',
      headerName: 'Recipient Email',
      flex: 1.2,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Mail size={16} color="#0284C7" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    { field: 'subject', headerName: 'Email Subject', flex: 1.5 },
    { field: 'template_name', headerName: 'Trigger / Template', width: 160 },
    { field: 'provider_type', headerName: 'SMTP Provider', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const val = String(params.value || '').toLowerCase();
        let color: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default';
        let icon = <Clock size={14} />;

        if (val === 'sent' || val === 'completed') {
          color = 'success';
          icon = <CheckCircle2 size={14} />;
        } else if (val === 'failed') {
          color = 'error';
          icon = <AlertCircle size={14} />;
        } else if (val === 'processing' || val === 'queued') {
          color = 'warning';
        }

        return (
          <Chip
            icon={icon}
            label={val.toUpperCase()}
            color={color}
            size="small"
            sx={{ fontWeight: 800 }}
          />
        );
      },
    },
    {
      field: 'failure_reason',
      headerName: 'Failure Reason / SMTP Response',
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="caption" color={params.row.status === 'failed' ? 'error.main' : 'text.secondary'} noWrap>
          {params.value || params.row.message_id || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Sent Time',
      width: 170,
      valueGetter: (_value, row) => (row.sent_at || row.created_at ? new Date(row.sent_at || row.created_at).toLocaleString() : 'N/A'),
    },
  ];

  return (
    <PageContainer
      title="Enterprise Email History & Logs"
      subtitle="Complete audit trail of all automated transactional, marketing, and abandoned cart emails sent via Nodemailer SMTP"
    >
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Live Email Log Stream ({logs.length} Total Dispatched)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Logs store recipient, provider, status, retry counts, exact SMTP error details, and delivery timestamps.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshCw size={16} />}
          onClick={fetchLogs}
          disabled={loading}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          {loading ? 'Refreshing...' : 'Refresh Logs'}
        </Button>
      </Paper>

      <DataTable
        rows={logs}
        columns={columns}
        loading={loading}
        pageSize={10}
      />
    </PageContainer>
  );
};
