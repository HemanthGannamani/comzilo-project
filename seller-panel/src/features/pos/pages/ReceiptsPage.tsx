import React, { useState } from 'react';
import { Chip, Button } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Printer } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetReceiptsQuery } from '../../../api/endpoints/platformApi';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

export const ReceiptsPage: React.FC = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetReceiptsQuery({ page: page + 1, limit: 10 });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Receipt ID', width: 100 },
    { field: 'receiptNumber', headerName: 'Receipt #', width: 160 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 130, renderCell: (params) => formatCurrency(params.value || 0) },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 140 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <Chip label={params.value || 'Completed'} color="success" size="small" />,
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: () => (
        <Button size="small" variant="outlined" startIcon={<Printer size={14} />} onClick={() => window.print()}>
          Reprint
        </Button>
      ),
    },
  ];

  const rows = data?.data?.receipts || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer title="POS Receipts Archive" subtitle="View and reprint point of sale customer checkout receipts">
      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={totalCount}
        page={page}
        onPageChange={(p) => setPage(p)}
      />
    </PageContainer>
  );
};
