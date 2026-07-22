import React from 'react';
import { Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';

export const PlatformUsersPage: React.FC = () => {
  const users = [
    { id: 1, name: 'Super Admin', email: 'admin@comzilo.com', role: 'SUPER_ADMIN', status: 'Active' },
    { id: 2, name: 'Platform Operations', email: 'ops@comzilo.com', role: 'PLATFORM_OPERATOR', status: 'Active' },
  ];

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Administrator Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1.5 },
    { field: 'role', headerName: 'Platform Role', width: 180, renderCell: (params) => <Chip label={params.value} color="error" size="small" /> },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <Chip label={params.value} color="success" size="small" /> },
  ];

  return (
    <PageContainer title="Platform Administrators" subtitle="Manage global platform root administrators and system operators">
      <DataTable rows={users} columns={columns} />
    </PageContainer>
  );
};
