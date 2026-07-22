import React, { useState } from 'react';
import { Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetCustomerAddressesQuery } from '../../../api/endpoints/salesApi';

export const CustomerAddressesPage: React.FC = () => {
  const [selectedCustomerId] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetCustomerAddressesQuery({ customerId: selectedCustomerId });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'addressLine1', headerName: 'Address Line 1', flex: 1, minWidth: 160 },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'state', headerName: 'State / Region', width: 130 },
    { field: 'postalCode', headerName: 'Postal Code', width: 110 },
    { field: 'country', headerName: 'Country', width: 120 },
    {
      field: 'isDefaultBilling',
      headerName: 'Default Billing',
      width: 140,
      renderCell: (params) => (params.value ? <Chip label="Billing" color="primary" size="small" /> : '-'),
    },
    {
      field: 'isDefaultShipping',
      headerName: 'Default Shipping',
      width: 140,
      renderCell: (params) => (params.value ? <Chip label="Shipping" color="secondary" size="small" /> : '-'),
    },
  ];

  const rows = data?.data?.addresses || data?.data || [];

  return (
    <PageContainer title="Customer Address Book" subtitle="Manage billing and shipping addresses">
      <DataTable rows={rows} columns={columns} loading={isLoading} />
    </PageContainer>
  );
};
