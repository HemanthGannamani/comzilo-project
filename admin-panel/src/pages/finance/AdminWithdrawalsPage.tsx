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
  TextField,
  Alert,
} from '@mui/material';
import {
  Clock,
  CheckCircle2,
  XCircle,
  CheckCheck,
  Building2,
  DollarSign,
  RefreshCw,
  Send,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const AdminWithdrawalsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Dialog States
  const [paidModalOpen, setPaidModalOpen] = useState<boolean>(false);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [payoutRef, setPayoutRef] = useState<string>('');
  const [rejectReason, setRejectReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchWithdrawalsAndReports = async () => {
    setLoading(true);
    try {
      const [wthRes, repRes] = await Promise.all([
        axiosInstance.get('/admin/withdrawals/all-withdrawals'),
        axiosInstance.get('/admin/withdrawals/withdrawal-reports'),
      ]);
      setWithdrawals(wthRes.data?.data || []);
      setReports(repRes.data?.data || null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load seller withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalsAndReports();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axiosInstance.post(`/admin/withdrawals/withdrawals/${id}/approve`);
      toast.success('Withdrawal request approved successfully!');
      fetchWithdrawalsAndReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve withdrawal');
    }
  };

  const handleMarkPaidSubmit = async () => {
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      await axiosInstance.post(`/admin/withdrawals/withdrawals/${selectedRequest.id}/mark-paid`, {
        payoutReference: payoutRef || `SETTLE-${Date.now()}`,
      });
      toast.success(`Withdrawal marked as Paid with reference ${payoutRef || 'SETTLE'}!`);
      setPaidModalOpen(false);
      setPayoutRef('');
      fetchWithdrawalsAndReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to mark withdrawal as paid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      await axiosInstance.post(`/admin/withdrawals/withdrawals/${selectedRequest.id}/reject`, {
        reason: rejectReason || 'Administrative rejection',
      });
      toast.success(`Withdrawal rejected. INR ${selectedRequest.amount} refunded to seller balance.`);
      setRejectModalOpen(false);
      setRejectReason('');
      fetchWithdrawalsAndReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWithdrawals = selectedStatus === 'all'
    ? withdrawals
    : withdrawals.filter((w) => w.status?.toLowerCase() === selectedStatus.toLowerCase());

  if (loading) {
    return (
      <PageContainer title="Seller Withdrawal & Payout Management" subtitle="Loading requests...">
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Seller Withdrawal & Payout Management"
      subtitle="Review, approve, reject, and mark bank settlements paid for all platform merchants"
      action={
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={18} />}
          onClick={fetchWithdrawalsAndReports}
          sx={{ fontWeight: 700 }}
        >
          Refresh
        </Button>
      }
    >
      {/* 4 OVERVIEW STAT CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              PENDING REVIEW ({reports?.pendingCount || 0})
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B', mt: 0.5 }}>
              INR {reports?.pendingAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Awaiting Admin Approval
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              APPROVED PAYOUTS ({reports?.approvedCount || 0})
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5 }}>
              INR {reports?.approvedAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ready for Bank Transfer
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              SETTLED & PAID ({reports?.paidCount || 0})
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
              INR {reports?.paidAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Completed Bank Transactions
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              REJECTED / REFUNDED ({reports?.rejectedCount || 0})
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444', mt: 0.5 }}>
              INR {reports?.rejectedAmount?.toLocaleString() || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Returned to Available Balance
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* WITHDRAWAL MANAGEMENT TABLE */}
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedStatus} onChange={(_e, v) => setSelectedStatus(v)}>
            <Tab label={`All (${withdrawals.length})`} value="all" sx={{ fontWeight: 800 }} />
            <Tab label={`Pending (${reports?.pendingCount || 0})`} value="pending" sx={{ fontWeight: 800, color: '#F59E0B' }} />
            <Tab label={`Approved (${reports?.approvedCount || 0})`} value="approved" sx={{ fontWeight: 800, color: '#2563EB' }} />
            <Tab label={`Paid (${reports?.paidCount || 0})`} value="paid" sx={{ fontWeight: 800, color: '#10B981' }} />
            <Tab label={`Rejected (${reports?.rejectedCount || 0})`} value="rejected" sx={{ fontWeight: 800, color: '#EF4444' }} />
          </Tabs>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Requested Date</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Withdrawal #</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Seller / Merchant</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Bank Account Details</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: 'right' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Payout Ref / Notes</TableCell>
                <TableCell sx={{ fontWeight: 800, textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWithdrawals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No withdrawal requests found for selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWithdrawals.map((w) => (
                  <TableRow key={w.id} hover>
                    <TableCell>{new Date(w.requested_at || w.requestedAt || w.createdAt).toLocaleString()}</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{w.withdrawal_number || w.withdrawalNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {w.seller_name || `Tenant #${w.tenant_id}`}
                      <Typography variant="caption" color="text.secondary" display="block">{w.seller_email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{w.bank_name}</Typography>
                      <Typography variant="caption" color="text.secondary">Acc: {w.account_number} | IFSC: {w.ifsc_code}</Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#2563EB' }}>
                      INR {Number(w.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={w.status?.toUpperCase()}
                        size="small"
                        color={
                          w.status === 'paid'
                            ? 'success'
                            : w.status === 'approved'
                            ? 'primary'
                            : w.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{w.payout_reference || w.admin_notes || '-'}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {w.status === 'pending' && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleApprove(w.id)}
                            sx={{ fontWeight: 700 }}
                          >
                            Approve
                          </Button>
                        )}
                        {(w.status === 'pending' || w.status === 'approved') && (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => {
                              setSelectedRequest(w);
                              setPaidModalOpen(true);
                            }}
                            sx={{ fontWeight: 700 }}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {w.status !== 'paid' && w.status !== 'rejected' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => {
                              setSelectedRequest(w);
                              setRejectModalOpen(true);
                            }}
                            sx={{ fontWeight: 700 }}
                          >
                            Reject
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
      </Paper>

      {/* MARK AS PAID DIALOG */}
      <Dialog open={paidModalOpen} onClose={() => setPaidModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Mark Withdrawal as Paid</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter transaction / bank payout reference for <strong>Withdrawal #{selectedRequest?.withdrawal_number}</strong> (INR {Number(selectedRequest?.amount || 0).toFixed(2)}):
          </Typography>
          <TextField
            label="Payout Transaction Reference / UTR *"
            fullWidth
            value={payoutRef}
            onChange={(e) => setPayoutRef(e.target.value)}
            placeholder="e.g. UTR99812488192"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setPaidModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" disabled={submitting} onClick={handleMarkPaidSubmit} sx={{ fontWeight: 800 }}>
            {submitting ? 'Updating...' : 'Confirm Paid'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* REJECT DIALOG */}
      <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Withdrawal Request</DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Rejecting this request will automatically refund <strong>INR {Number(selectedRequest?.amount || 0).toFixed(2)}</strong> back to the seller's Available Wallet Balance.
          </Alert>
          <TextField
            label="Rejection Reason *"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Invalid bank account details or IFSC code mismatch."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRejectModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" disabled={submitting} onClick={handleRejectSubmit} sx={{ fontWeight: 800 }}>
            {submitting ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AdminWithdrawalsPage;
