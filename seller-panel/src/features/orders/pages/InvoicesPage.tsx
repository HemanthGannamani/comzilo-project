import React, { useState } from 'react';
import { Chip, Button } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Printer } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetInvoicesQuery } from '../../../api/endpoints/salesApi';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

export const InvoicesPage: React.FC = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetInvoicesQuery({ page: page + 1, limit: 10 });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Invoice ID', width: 100 },
    { field: 'invoiceNumber', headerName: 'Invoice #', width: 150 },
    { field: 'orderId', headerName: 'Order ID', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 130, renderCell: (params) => formatCurrency(params.value || 0) },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <Chip label={params.value || 'Issued'} color="success" size="small" />,
    },
    {
      field: 'createdAt',
      headerName: 'Issued Date',
      width: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: () => (
        <Button size="small" variant="outlined" startIcon={<Printer size={14} />} onClick={() => window.print()}>
          Print
        </Button>
      ),
    },
  ];

  const rows = data?.data?.invoices || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer title="Invoices Directory" subtitle="View and print sales order invoices and PDF billing statements">
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
