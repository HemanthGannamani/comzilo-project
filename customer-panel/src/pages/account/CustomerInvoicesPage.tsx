import React, { useState } from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import { Download, Printer, CreditCard, RefreshCw } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useGetMyInvoicesQuery, useGetMyPaymentsQuery } from '../../api/customerPortalApi';
import { formatPrice } from '../../utils/currencyService';

export const CustomerInvoicesPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const { data: invoiceData, isLoading: loadingInvoices } = useGetMyInvoicesQuery();
  const { data: paymentData, isLoading: loadingPayments } = useGetMyPaymentsQuery();

  const invoices = invoiceData?.data?.rows || invoiceData?.data || [];
  const payments = paymentData?.data?.rows || paymentData?.data || [];

  const handlePrintDownload = (inv: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let html = `<html><head><title>Invoice ${inv.invoiceNumber}</title><style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #0F172A; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; }
      .title { font-size: 24px; font-weight: bold; color: #2563EB; }
      .details { margin-top: 30px; line-height: 1.6; }
      .table { width: 100%; margin-top: 30px; border-collapse: collapse; }
      .table th, .table td { border: 1px solid #CBD5E1; padding: 12px; text-align: left; }
      .table th { background: #F8FAFC; }
      .total-row { font-weight: bold; background: #EFF6FF; }
    </style></head><body>
      <div class="header">
        <div>
          <div class="title">COMZILO ENTERPRISE INVOICE</div>
          <div>Comzilo Global SaaS E-Commerce Platform</div>
        </div>
        <div style="text-align: right;">
          <div>Invoice #: ${inv.invoiceNumber}</div>
          <div>Date: ${new Date(inv.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
      <div class="details">
        <div>Status: <strong>${inv.invoiceStatus?.toUpperCase() || 'PAID'}</strong></div>
        <div>Order #: ${inv.orderId}</div>
      </div>
      <table class="table">
        <thead>
          <tr><th>Description</th><th>Amount</th></tr>
        </thead>
        <tbody>
          <tr><td>Order #${inv.orderId} Products Subtotal</td><td>${formatPrice(inv.subtotal || inv.total)}</td></tr>
          <tr><td>Tax Amount</td><td>${formatPrice(inv.taxTotal || 0)}</td></tr>
          <tr class="total-row"><td>Grand Total</td><td>${formatPrice(inv.total)}</td></tr>
        </tbody>
      </table>
    </body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <CustomerAccountLayout>
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
          Invoices & Payment History
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Access, view, print tax invoices and track payment gateway transaction histories.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label={`Tax Invoices (${invoices.length})`} sx={{ fontWeight: 700 }} />
            <Tab label={`Payment Transactions (${payments.length})`} sx={{ fontWeight: 700 }} />
          </Tabs>
        </Box>

        {tab === 0 && (
          loadingInvoices ? (
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
                      <TableCell sx={{ fontWeight: 800, color: '#2563EB' }}>{formatPrice(inv.total)}</TableCell>
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
          )
        )}

        {tab === 1 && (
          loadingPayments ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={36} />
            </Box>
          ) : payments.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
              No payment transactions recorded yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Payment #</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Gateway / Method</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((p: any) => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{p.paymentNumber}</TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ textTransform: 'uppercase', fontWeight: 600 }}>{p.paymentMethod || p.gateway}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: '#2563EB' }}>{formatPrice(p.amount)}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.paymentStatus?.toUpperCase()}
                          color={p.paymentStatus === 'paid' || p.paymentStatus === 'captured' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Paper>
    </CustomerAccountLayout>
  );
};
