import React, { useState } from 'react';
import { Chip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetLocationsQuery } from '../../../api/endpoints/inventoryApi';

export const WarehouseLocationsPage: React.FC = () => {
  const [selectedWarehouse] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetLocationsQuery({ warehouseId: selectedWarehouse });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'code', headerName: 'Bin Code', width: 140 },
    { field: 'aisle', headerName: 'Aisle', width: 100 },
    { field: 'rack', headerName: 'Rack', width: 100 },
    { field: 'shelf', headerName: 'Shelf', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <Chip label={params.value || 'Active'} color="success" size="small" />,
    },
  ];

  const rows = data?.data?.locations || data?.data || [];

  return (
    <PageContainer title="Warehouse Bin Locations" subtitle="Manage bin locations, aisles, racks, and shelves">
      <DataTable rows={rows} columns={columns} loading={isLoading} />
    </PageContainer>
  );
};
