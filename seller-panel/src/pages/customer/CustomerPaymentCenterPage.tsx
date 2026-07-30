import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CreditCard,
  Download,
  Mail,
  MessageSquare,
  RotateCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  DollarSign,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const CustomerPaymentCenterPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentsData, setPaymentsData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const fetchCustomerPaymentData = async () => {
    setLoading(true);
    try {
      const [pmRes, invRes, rfdRes] = await Promise.all([
        axiosInstance.get('/customer/payments'),
        axiosInstance.get('/customer/invoices'),
        axiosInstance.get('/customer/refunds'),
      ]);

      setPaymentsData(pmRes.data?.data || null);
      setInvoices(invRes.data?.data || []);
      setRefunds(rfdRes.data?.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load customer payment center');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerPaymentData();
  }, []);

  const handleRetryPayment = async (orderId: number) => {
    try {
      const res = await axiosInstance.post(`/customer/payments/retry/${orderId}`);
      toast.success(`Retry session initialized for Order #${res.data?.data?.orderNumber}! Amount: INR ${res.data?.data?.amount}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment retry session');
    }
  };

  const handleSendEmailReceipt = async (orderId: number) => {
    try {
      const res = await axiosInstance.post(`/customer/payments/email-receipt/${orderId}`);
      toast.success(`Receipt email sent to ${res.data?.data?.sentTo}!`);
    } catch {
      toast.error('Failed to send email receipt');
    }
  };

  const handleSendWhatsAppReceipt = async (orderId: number) => {
    try {
      const res = await axiosInstance.post(`/customer/payments/whatsapp-receipt/${orderId}`);
      toast.success(`WhatsApp receipt dispatched to ${res.data?.data?.sentTo}!`);
    } catch {
      toast.error('Failed to send WhatsApp receipt');
    }
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    toast.success(`Downloading PDF Invoice for Order #${orderNumber}...`);
    window.print();
  };

  if (loading) {
    return (
      <PageContainer title="Customer Payment & Receipt Center" subtitle="Loading payment history & invoices...">
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  const summary = paymentsData?.summary || {};
  const paymentsList = paymentsData?.payments || [];

  return (
    <PageContainer
      title="Customer Payment & Receipt Center"
      subtitle="View payment history, download invoices, track refunds, retry payments, and manage receipts"
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={18} />}
          onClick={fetchCustomerPaymentData}
          sx={{ fontWeight: 700 }}
        >
          Refresh
        </Button>
      </Box>

      {/* 4 STAT CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#EFF6FF' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, color: '#1E40AF' }}>
              TOTAL TRANSACTIONS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1D4ED8', mt: 0.5 }}>
              {summary?.totalPayments || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Orders & Payment Attempts
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#F0FDF4' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, color: '#166534' }}>
              SUCCESSFUL PAYMENTS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#15803D', mt: 0.5 }}>
              INR {summary?.successfulAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Completed Order Payments
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#FFFBEB' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, color: '#92400E' }}>
              FAILED / PENDING
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#B45309', mt: 0.5 }}>
              INR {summary?.failedAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Retryable Unpaid Orders
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', bgcolor: '#FFF1F2' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, color: '#9F1239' }}>
              REFUNDED TOTAL
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#BE123C', mt: 0.5 }}>
              INR {summary?.refundedAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Returned & Cancelled Refunds
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* TABS & LEDGERS */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
            <Tab label={`Payment History (${paymentsList.length})`} sx={{ fontWeight: 800 }} />
            <Tab label={`Invoices & Receipts (${invoices.length})`} sx={{ fontWeight: 800 }} />
            <Tab label={`Refund History (${refunds.length})`} sx={{ fontWeight: 800 }} />
          </Tabs>
        </Box>

        {/* TAB 0: PAYMENT HISTORY */}
        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>No payment history recorded.</TableCell>
                  </TableRow>
                ) : (
                  paymentsList.map((p: any) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{new Date(p.created_at || p.createdAt).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{p.order_number}</TableCell>
                      <TableCell><Chip label={p.payment_method || 'RAZORPAY'} size="small" variant="outlined" /></TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#2563EB' }}>
                        INR {Number(p.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={(p.payment_status || 'paid').toUpperCase()}
                          size="small"
                          color={p.payment_status === 'paid' ? 'success' : p.payment_status === 'failed' ? 'error' : 'warning'}
                          sx={{ fontWeight: 800 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Eye size={14} />}
                            onClick={() => setSelectedTx(p)}
                            sx={{ fontWeight: 700 }}
                          >
                            Details
                          </Button>
                          {p.payment_status !== 'paid' && (
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              startIcon={<RotateCw size={14} />}
                              onClick={() => handleRetryPayment(p.id)}
                              sx={{ fontWeight: 800 }}
                            >
                              Retry Payment
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* TAB 1: INVOICES */}
        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Invoice #</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>No invoices found.</TableCell>
                  </TableRow>
                ) : (
                  invoices.map((inv: any) => (
                    <TableRow key={inv.id} hover>
                      <TableCell>{new Date(inv.created_at || inv.createdAt).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{inv.invoice_number}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#2563EB' }}>
                        INR {Number(inv.amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip label={(inv.status || 'PAID').toUpperCase()} size="small" color="success" sx={{ fontWeight: 800 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Download size={14} />}
                            onClick={() => handleDownloadInvoice(inv.order_number)}
                            sx={{ fontWeight: 700 }}
                          >
                            PDF Invoice
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Mail size={14} />}
                            onClick={() => handleSendEmailReceipt(inv.id)}
                            sx={{ fontWeight: 700 }}
                          >
                            Email
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            startIcon={<MessageSquare size={14} />}
                            onClick={() => handleSendWhatsAppReceipt(inv.id)}
                            sx={{ fontWeight: 700 }}
                          >
                            WhatsApp
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* TAB 2: REFUND HISTORY */}
        {activeTab === 2 && (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Refund ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Order #</TableCell>
                  <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Refund Amount</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {refunds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>No refund transactions recorded.</TableCell>
                  </TableRow>
                ) : (
                  refunds.map((r: any) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{new Date(r.created_at || r.createdAt).toLocaleString()}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{r.refund_id}</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{r.order_number}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, color: '#DC2626' }}>
                        + INR {Number(r.refund_amount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip label={(r.status || 'REFUNDED').toUpperCase()} size="small" color="success" sx={{ fontWeight: 800 }} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* TRANSACTION DETAILS MODAL */}
      <Dialog open={!!selectedTx} onClose={() => setSelectedTx(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Transaction Details: Order #{selectedTx?.order_number}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">PAYMENT ID / TRANSACTION UUID</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
              {selectedTx?.uuid || `tx_${selectedTx?.id}`}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">GATEWAY & METHOD</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Razorpay X Payment Gateway ({selectedTx?.payment_method || 'UPI/Card'})
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">PAYMENT AMOUNT</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB' }}>
              INR {Number(selectedTx?.amount || 0).toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">PAYMENT STATUS</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={(selectedTx?.payment_status || 'paid').toUpperCase()}
                color={selectedTx?.payment_status === 'paid' ? 'success' : 'warning'}
                sx={{ fontWeight: 800 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedTx(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default CustomerPaymentCenterPage;
