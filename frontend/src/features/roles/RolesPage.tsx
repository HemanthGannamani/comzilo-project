import React, { useState } from 'react';
import { Chip, Paper, Typography, Button } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Shield, Plus } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import { usePermission } from '../../hooks/usePermission';

export const RolesPage: React.FC = () => {
  const [roles] = useState([
    { id: 1, name: 'Tenant Super Admin', code: 'TENANT_ADMIN', permissionsCount: 45, status: 'active' },
    { id: 2, name: 'Store Manager', code: 'STORE_MANAGER', permissionsCount: 28, status: 'active' },
    { id: 3, name: 'POS Cashier', code: 'CASHIER', permissionsCount: 12, status: 'active' },
    { id: 4, name: 'Inventory Controller', code: 'INVENTORY_MANAGER', permissionsCount: 18, status: 'active' },
  ]);

  const canCreate = usePermission('role.create');

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Role Title', flex: 1, minWidth: 160 },
    { field: 'code', headerName: 'Role Code', width: 180 },
    {
      field: 'permissionsCount',
      headerName: 'Assigned Permissions',
      width: 180,
      renderCell: (params) => <Chip label={`${params.value} Permissions`} size="small" variant="outlined" />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      renderCell: () => (
        <Button size="small" variant="outlined" startIcon={<Shield size={14} />}>
          Permissions
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title="Roles Management"
      subtitle="Define access roles and assign RBAC permissions"
      actionText={canCreate ? 'Create Role' : undefined}
      actionIcon={<Plus size={18} />}
    >
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Role-Based Access Control (RBAC) allows fine-grained permission assignment across all 20 modules.
        </Typography>
      </Paper>
      <DataTable rows={roles} columns={columns} />
    </PageContainer>
  );
};
