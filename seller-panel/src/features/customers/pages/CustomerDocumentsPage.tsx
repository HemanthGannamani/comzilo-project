import React, { useState } from 'react';
import { Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetCustomerDocumentsQuery } from '../../../api/endpoints/salesApi';

export const CustomerDocumentsPage: React.FC = () => {
  const [selectedCustomerId] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetCustomerDocumentsQuery({ customerId: selectedCustomerId });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Document Title', flex: 1, minWidth: 160 },
    { field: 'documentType', headerName: 'Document Type', width: 140 },
    { field: 'fileName', headerName: 'File Name', width: 160 },
    {
      field: 'status',
      headerName: 'Verification Status',
      width: 150,
      renderCell: (params) => <Chip label={params.value || 'Verified'} color="success" size="small" />,
    },
  ];

  const rows = data?.data?.documents || data?.data || [];

  return (
    <PageContainer title="Customer Identity Documents" subtitle="Manage compliance files, contracts, and IDs">
      <DataTable rows={rows} columns={columns} loading={isLoading} />
    </PageContainer>
  );
};
