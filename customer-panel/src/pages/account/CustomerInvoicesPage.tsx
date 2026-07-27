import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Download, FileText, Printer, Eye } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useGetMyInvoicesQuery } from '../../api/customerPortalApi';

export const CustomerInvoicesPage: React.FC = () => {
  const { data: invoiceData, isLoading } = useGetMyInvoicesQuery();
  const invoices = invoiceData?.data?.rows || invoiceData?.data || [];

  const handlePrintDownload = (inv: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `<html><head><title>Invoice ${inv.invoiceNumber}</title><style>
      body { font-family: sans-serif; padding: 40px; color: #0F172A; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; }
      .title { font-size: 24px; font-weight: bold; color: #2563EB; }
      table { width: 100%; border-collapse: collapse; margin-top: 30px; }
      th, td { border: 1px solid #E2E8F0; padding: 12px; text-align: left; }
      th { background-color: #F8FAFC; }
      .total-row { font-weight: bold; font-size: 18px; }
    </style></head><body>`;

    html += `<div class="header">
      <div>
        <div class="title">Comzilo Store Official Invoice</div>
        <div>Invoice #: ${inv.invoiceNumber}</div>
        <div>Date: ${new Date(inv.createdAt).toLocaleDateString()}</div>
      </div>
      <div>
        <div>Status: <strong>${inv.invoiceStatus?.toUpperCase() || 'PAID'}</strong></div>
        <div>Order #: ${inv.orderId}</div>
      </div>
    </div>`;

    html += `<table>
      <thead>
        <tr><th>Description</th><th>Amount</th></tr>
      </thead>
      <tbody>
        <tr><td>Order #${inv.orderId} Products Subtotal</td><td>$${inv.subtotal || inv.total}</td></tr>
        <tr><td>Tax Amount</td><td>$${inv.taxTotal || 0}</td></tr>
        <tr class="total-row"><td>Grand Total</td><td>$${inv.total}</td></tr>
      </tbody>
    </table></body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <CustomerAccountLayout>
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Download Billing Invoices
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Access, view, print, or download PDF tax invoices for your completed purchases.
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        ) : invoices.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
            No billing invoices found. Invoices are generated automatically upon order placement.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((inv: any) => (
                  <TableRow key={inv.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{inv.invoiceNumber}</TableCell>
                    <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#2563EB' }}>${inv.total}</TableCell>
                    <TableCell>
                      <Chip label={inv.invoiceStatus?.toUpperCase() || 'PAID'} color="success" size="small" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Printer size={14} />}
                        onClick={() => handlePrintDownload(inv)}
                        sx={{ borderRadius: 2 }}
                      >
                        Print / Download PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </CustomerAccountLayout>
  );
};
