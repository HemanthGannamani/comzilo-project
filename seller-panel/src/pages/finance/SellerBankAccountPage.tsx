import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { ShieldCheck, Clock, AlertTriangle, XCircle, FileText, CheckCircle2, Save, Send, Edit3 } from 'lucide-react';

export const SellerBankAccountPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bankData, setBankData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    upiId: '',
    panNumber: '',
    gstNumber: '',
    cancelledChequeUrl: '',
    passbookUrl: '',
  });

  const fetchBankAccount = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/seller/bank-account');
      const data = res.data?.data || null;
      if (data) {
        setBankData(data);
        setFormData({
          accountHolderName: data.accountHolderName || '',
          bankName: data.bankName || '',
          accountNumber: data.accountNumber || '',
          confirmAccountNumber: data.accountNumber || '',
          ifscCode: data.ifscCode || '',
          upiId: data.upiId || '',
          panNumber: data.panNumber || '',
          gstNumber: data.gstNumber || '',
          cancelledChequeUrl: data.cancelledChequeUrl || '',
          passbookUrl: data.passbookUrl || '',
        });
        setIsEditing(data.status === 'REJECTED' || data.status === 'NEEDS_CHANGES');
      } else {
        setIsEditing(true);
      }
    } catch (err: any) {
      console.error('Failed to load bank account:', err);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountHolderName.trim()) return toast.error('Account Holder Name is required.');
    if (!formData.bankName.trim()) return toast.error('Bank Name is required.');
    if (!formData.accountNumber.trim()) return toast.error('Account Number is required.');
    if (formData.accountNumber.trim() !== formData.confirmAccountNumber.trim()) {
      return toast.error('Account Number and Confirm Account Number do not match.');
    }
    if (!formData.ifscCode.trim()) return toast.error('IFSC Code is required.');
    if (!formData.panNumber.trim()) return toast.error('PAN Number is required.');

    setSaving(true);
    try {
      const payload = {
        accountHolderName: (formData.accountHolderName || '').trim(),
        bankName: (formData.bankName || '').trim(),
        accountNumber: (formData.accountNumber || '').trim(),
        ifscCode: (formData.ifscCode || '').trim().toUpperCase(),
        upiId: (formData.upiId || '').trim() || null,
        panNumber: (formData.panNumber || '').trim().toUpperCase(),
        gstNumber: (formData.gstNumber || '').trim().toUpperCase() || null,
        cancelledChequeUrl: (formData.cancelledChequeUrl || '').trim() || null,
        passbookUrl: (formData.passbookUrl || '').trim() || null,
      };

      const res = await axiosInstance.post('/seller/bank-account/submit', payload);
      toast.success(res.data?.message || 'Bank details submitted successfully for verification!');
      setIsEditing(false);
      fetchBankAccount();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit bank account details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Seller Bank Account Verification" subtitle="Manage settlement bank details and KYC verification">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      </PageContainer>
    );
  }

  const status = bankData?.status || 'NOT_SUBMITTED';

  return (
    <PageContainer
      title="Bank Account & KYC Verification"
      subtitle="Configure settlement bank details, PAN/GST records, and verify payout account eligibility"
      actionText={bankData && bankData.status !== 'VERIFIED' && !isEditing ? 'Edit Details' : undefined}
      onAction={bankData && bankData.status !== 'VERIFIED' && !isEditing ? () => setIsEditing(true) : undefined}
      actionIcon={<Edit3 size={18} />}
    >
      {/* STATUS HEADER BANNER */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {status === 'VERIFIED' && <CheckCircle2 size={36} color="#10B981" />}
            {status === 'PENDING' && <Clock size={36} color="#F59E0B" />}
            {status === 'REJECTED' && <XCircle size={36} color="#EF4444" />}
            {status === 'NEEDS_CHANGES' && <AlertTriangle size={36} color="#D97706" />}
            {status === 'NOT_SUBMITTED' && <ShieldCheck size={36} color="#64748B" />}

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Verification Status:{' '}
                {status === 'VERIFIED' && <Chip label="VERIFIED" color="success" sx={{ fontWeight: 800 }} />}
                {status === 'PENDING' && <Chip label="PENDING VERIFICATION" color="warning" sx={{ fontWeight: 800 }} />}
                {status === 'REJECTED' && <Chip label="REJECTED" color="error" sx={{ fontWeight: 800 }} />}
                {status === 'NEEDS_CHANGES' && <Chip label="NEEDS CHANGES" color="warning" sx={{ fontWeight: 800 }} />}
                {status === 'NOT_SUBMITTED' && <Chip label="NOT SUBMITTED" color="default" sx={{ fontWeight: 800 }} />}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {status === 'VERIFIED' && 'Your bank account is verified. You can request wallet payouts & instant settlements.'}
                {status === 'PENDING' && 'Bank verification details submitted to Super Admin. Verification takes 1-2 business hours.'}
                {status === 'REJECTED' && 'Bank verification rejected by Super Admin. Please review admin remarks below.'}
                {status === 'NEEDS_CHANGES' && 'Super Admin requested updates to your submitted bank details.'}
                {status === 'NOT_SUBMITTED' && 'Please submit your bank details below to unlock merchant wallet settlements.'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ADMIN REMARKS ALERT */}
        {(status === 'REJECTED' || status === 'NEEDS_CHANGES') && bankData?.remarks && (
          <Alert severity="error" sx={{ mt: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Super Admin Remarks:
            </Typography>
            <Typography variant="body2">{bankData.remarks}</Typography>
          </Alert>
        )}
      </Paper>

      {/* BANK ACCOUNT FORM */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
            Settlement Bank Account Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Holder Name *"
                fullWidth
                disabled={!isEditing}
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                placeholder="As per bank passbook / cheque"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Bank Name *"
                fullWidth
                disabled={!isEditing}
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. HDFC Bank, ICICI Bank, State Bank of India"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number *"
                type="password"
                fullWidth
                disabled={!isEditing}
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Enter bank account number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Confirm Account Number *"
                fullWidth
                disabled={!isEditing}
                value={formData.confirmAccountNumber}
                onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
                placeholder="Re-enter bank account number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="IFSC Code *"
                fullWidth
                disabled={!isEditing}
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                placeholder="11-digit IFSC Code (e.g. HDFC0001234)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="UPI ID (Optional)"
                fullWidth
                disabled={!isEditing}
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="e.g. merchant@okhdfcbank"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="PAN Number *"
                fullWidth
                disabled={!isEditing}
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                placeholder="10-digit PAN (e.g. ABCDE1234F)"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="GST Number (Optional)"
                fullWidth
                disabled={!isEditing}
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                placeholder="15-digit GSTIN"
              />
            </Grid>

          </Grid>

          {isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Send size={18} />}
                sx={{ fontWeight: 700, px: 4, py: 1.2, borderRadius: 2 }}
              >
                Submit For Verification
              </Button>
            </Box>
          )}
        </form>
      </Paper>
    </PageContainer>
  );
};
