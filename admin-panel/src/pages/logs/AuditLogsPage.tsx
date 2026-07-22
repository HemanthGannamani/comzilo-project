import React, { useState } from 'react';
import {
  Chip,
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { useGetAuditLogsQuery } from '../../api/adminApi';
import { Search, FileText } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [userId, setUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, _setPageSize] = useState(10);

  const { data: auditData, isLoading } = useGetAuditLogsQuery({
    search,
    action,
    userId,
    startDate,
    endDate,
    page,
    limit: pageSize,
  });

  const logs = auditData?.data?.logs || [];
  const total = auditData?.data?.total || 0;

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'action',
      headerName: 'Audit Event',
      width: 180,
      renderCell: (params) => (
        <Chip label={String(params.value).toUpperCase()} color="primary" size="small" sx={{ fontWeight: 700 }} />
      ),
    },
    { field: 'userId', headerName: 'User ID', width: 90, valueGetter: (_, row) => row.user_id || 'N/A' },
    {
      field: 'entity_type',
      headerName: 'Entity Type',
      width: 120,
    },
    {
      field: 'entity_id',
      headerName: 'Entity ID',
      width: 100,
    },
    { field: 'ip_address', headerName: 'IP Address', width: 120 },
    { field: 'user_agent', headerName: 'User Agent', flex: 1 },
    {
      field: 'created_at',
      headerName: 'Timestamp',
      width: 180,
      valueGetter: (_, row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  const exportCSV = () => {
    const headers = ['ID', 'Action', 'User ID', 'Entity Type', 'Entity ID', 'IP Address', 'Timestamp'];
    const csvContent =
      [headers.join(',')] +
      '\n' +
      logs
        .map((l: any) =>
          [
            l.id,
            l.action,
            l.user_id || 'N/A',
            l.entity_type || 'N/A',
            l.entity_id || 'N/A',
            l.ip_address || 'N/A',
            new Date(l.created_at).toISOString(),
          ]
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\n');

    const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = `audit_logs_${Date.now()}.csv`;
    a.click();
  };

  return (
    <PageContainer
      title="System Audit Logs"
      subtitle="Immutable security audit trail of administrative actions and tenant events"
    >
      <Paper sx={{ p: 3, mb: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94A3B8' }} />,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Action</InputLabel>
              <Select value={action} label="Action" onChange={(e) => setAction(e.target.value)}>
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value="seller.created">seller.created</MenuItem>
                <MenuItem value="seller.updated">seller.updated</MenuItem>
                <MenuItem value="seller.suspended">seller.suspended</MenuItem>
                <MenuItem value="seller.activated">seller.activated</MenuItem>
                <MenuItem value="password.reset">password.reset</MenuItem>
                <MenuItem value="seller.deleted">seller.deleted</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              size="small"
              fullWidth
              label="User ID"
              placeholder="Filter by User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              size="small"
              type="date"
              label="Start Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField
              size="small"
              type="date"
              label="End Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" startIcon={<FileText size={16} />} onClick={exportCSV} fullWidth>
              Export CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid #E2E8F0', p: 1 }}>
        <DataTable
          rows={logs}
          columns={columns}
          loading={isLoading}
          rowCount={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Box>
    </PageContainer>
  );
};
