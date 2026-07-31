import React, { useState } from 'react';
import { Chip, Button, Stack } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Printer, Download } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { useGetInvoicesQuery } from '../../../api/endpoints/salesApi';
import { formatCurrency, formatDateTime } from '../../../utils/formatters';

export const InvoicesPage: React.FC = () => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useGetInvoicesQuery({ page: page + 1, limit: 10 });

  const handlePrint = (inv: any) => {
    window.print();
  };

  const handleDownloadPdf = (inv: any) => {
    const invNumber = inv.invoiceNumber || `INV-${inv.id || 'DOC'}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${invNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; background: #ffffff; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: bold; color: #0f172a; }
          .subtitle { color: #64748b; font-size: 14px; margin-top: 4px; }
          .details-box { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .label { font-weight: bold; color: #475569; }
          .value { font-weight: 600; color: #0f172a; }
          .amount { font-size: 20px; color: #2563eb; font-weight: bold; }
          .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Comzilo Store Sales Invoice</div>
            <div class="subtitle">Official Merchant Statement & Tax Document</div>
          </div>
          <div>
            <div class="title" style="text-align: right; color: #2563eb;">#${invNumber}</div>
            <div class="subtitle" style="text-align: right;">Status: ${inv.status || 'Issued'}</div>
          </div>
        </div>

        <div class="details-box">
          <div class="row"><span class="label">Invoice ID:</span><span class="value">${inv.id || 'N/A'}</span></div>
          <div class="row"><span class="label">Invoice Number:</span><span class="value">${invNumber}</span></div>
          <div class="row"><span class="label">Associated Order ID:</span><span class="value">#${inv.orderId || 'N/A'}</span></div>
          <div class="row"><span class="label">Issued Date:</span><span class="value">${inv.createdAt ? new Date(inv.createdAt).toLocaleString() : 'N/A'}</span></div>
          <div class="row" style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #cbd5e1;">
            <span class="label" style="font-size: 16px;">Total Amount:</span>
            <span class="amount">${formatCurrency(inv.amount || 0)}</span>
          </div>
        </div>

        <div class="footer">
          Thank you for conducting business with Comzilo Enterprise Store. Keep this PDF document for your tax & transaction records.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Invoice ID', width: 100 },
    { field: 'invoiceNumber', headerName: 'Invoice #', width: 180 },
    { field: 'orderId', headerName: 'Order ID', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 130, renderCell: (params) => formatCurrency(params.value || 0) },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => <Chip label={params.value || 'Issued'} color="success" size="small" />,
    },
    {
      field: 'createdAt',
      headerName: 'Issued Date',
      width: 170,
      renderCell: (params) => formatDateTime(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Printer size={14} />}
            onClick={() => handlePrint(params.row)}
            sx={{ fontWeight: 600, px: 1.5 }}
          >
            Print
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<Download size={14} />}
            onClick={() => handleDownloadPdf(params.row)}
            sx={{ fontWeight: 600, px: 1.5 }}
          >
            Download PDF
          </Button>
        </Stack>
      ),
    },
  ];

  const rows = data?.data?.rows || data?.data?.invoices || (Array.isArray(data?.data) ? data.data : []);
  const totalCount = data?.data?.count || data?.data?.total || rows.length;

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
