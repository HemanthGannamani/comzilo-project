import React from 'react';
import { Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';

export const AuditLogsPage: React.FC = () => {
  const logs = [
    { id: 1, action: 'TENANT_PROVISIONED', user: 'admin@comzilo.com', details: 'Created tenant "Default Organization"', ip: '127.0.0.1', status: 'SUCCESS', timestamp: '2026-07-21 14:15:42' },
    { id: 2, action: 'SUPER_ADMIN_LOGIN', user: 'admin@comzilo.com', details: 'Successful session authentication', ip: '127.0.0.1', status: 'SUCCESS', timestamp: '2026-07-21 14:15:40' },
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'action', headerName: 'Audit Event', width: 200, renderCell: (params) => <Chip label={params.value} color="primary" size="small" /> },
    { field: 'user', headerName: 'User Email', flex: 1 },
    { field: 'details', headerName: 'Event Details', flex: 1.5 },
    { field: 'ip', headerName: 'IP Address', width: 120 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <Chip label={params.value} color="success" size="small" /> },
    { field: 'timestamp', headerName: 'Timestamp', width: 170 },
  ];

  return (
    <PageContainer title="System Audit Logs" subtitle="Immutable security audit trail of administrative actions and tenant events">
      <DataTable rows={logs} columns={columns} />
    </PageContainer>
  );
};
