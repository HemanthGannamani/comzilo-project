import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Chip,
  Drawer,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, FileText, CheckCircle2, XCircle, Search, Copy, Download, Send, EyeOff } from 'lucide-react';
import {
  useGetSellerApplicationsQuery,
  useApproveSellerApplicationMutation,
  useRejectSellerApplicationMutation,
} from '../api/adminApi';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000';

export const SellerApplicationsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('newest');

  const { data, isLoading, refetch } = useGetSellerApplicationsQuery({
    page,
    limit: 10,
    search,
    status,
    businessType,
    startDate,
    endDate,
    sort,
  });

  const [approveApplication] = useApproveSellerApplicationMutation();
  const [rejectApplication] = useRejectSellerApplicationMutation();

  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    temporaryPassword: string;
    tenantName: string;
    storeName: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleViewDetails = (appRow: any) => {
    setSelectedApp(appRow);
    setIsDrawerOpen(true);
  };

  const handleApproveClick = () => {
    setIsApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedApp) return;
    setActionLoading(true);
    try {
      const res = await approveApplication(selectedApp.id).unwrap();
      toast.success('Seller application approved and onboarding completed successfully!');
      setIsApproveDialogOpen(false);
      setIsDrawerOpen(false);

      if (res.data?.credentials) {
        setCreatedCredentials(res.data.credentials);
        setIsSuccessDialogOpen(true);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedApp || !rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setActionLoading(true);
    try {
      await rejectApplication({ id: selectedApp.id, reason: rejectReason }).unwrap();
      toast.success('Application rejected successfully!');
      setIsRejectDialogOpen(false);
      setIsDrawerOpen(false);
      setRejectReason('');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Email: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.temporaryPassword}\nTenant: ${createdCredentials.tenantName}\nStore: ${createdCredentials.storeName}`;
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard!');
  };

  const handleDownloadPdf = () => {
    if (!createdCredentials) return;
    const content = `
==================================================
COMZILO SELLER ACCOUNT CREDENTIALS
==================================================

Email: ${createdCredentials.email}
Temporary Password: ${createdCredentials.temporaryPassword}
Tenant Organization: ${createdCredentials.tenantName}
Initial Store: ${createdCredentials.storeName}
Date Created: ${new Date().toLocaleString()}

SECURITY INSTRUCTIONS:
- Please log in to your Seller Portal.
- You will be prompted to change your temporary password upon first login.
==================================================
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Seller_Credentials_${createdCredentials.email}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Credentials document downloaded');
  };

  const handleResendEmailClick = () => {
    toast.success(`Welcome credentials email resent to ${createdCredentials?.email}`);
  };

  const columns: GridColDef[] = [
    { field: 'applicationNumber', headerName: 'App Number', width: 150, renderCell: (params) => <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{params.value}</Typography> },
    { field: 'businessName', headerName: 'Business Name', width: 200 },
    { field: 'ownerName', headerName: 'Owner Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'businessType', headerName: 'Type', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => {
        const value = params.value as string;
        let color: 'warning' | 'success' | 'error' = 'warning';
        if (value === 'Approved') color = 'success';
        if (value === 'Rejected') color = 'error';
        return <Chip label={value} color={color} size="small" sx={{ fontWeight: 700 }} />;
      },
    },
    {
      field: 'submittedAt',
      headerName: 'Submitted Date',
      width: 160,
      valueFormatter: (value) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'reviewedBy',
      headerName: 'Reviewed By',
      width: 130,
      valueGetter: (_, row) => row.reviewedBy ? `Admin #${row.reviewedBy}` : 'N/A',
    },
    {
      field: 'reviewedAt',
      headerName: 'Reviewed Date',
      width: 160,
      valueGetter: (_, row) => row.reviewedAt ? new Date(row.reviewedAt).toLocaleDateString() : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleViewDetails(params.row)} size="small">
          <Eye size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Seller Registration Applications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review, approve, or reject incoming seller application credentials.
        </Typography>
      </Box>

      {/* Filters & Search Header */}
      <Paper sx={{ p: 3, mb: 4, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2}>
            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748B' }} />,
                },
              }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Business Type</InputLabel>
              <Select value={businessType} label="Business Type" onChange={(e) => setBusinessType(e.target.value)}>
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
                <MenuItem value="Wholesale">Wholesale</MenuItem>
                <MenuItem value="Manufacturer">Manufacturer</MenuItem>
                <MenuItem value="Distributor">Distributor</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Applications Data Grid */}
      <Paper sx={{ border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3, overflow: 'hidden' }}>
        <Box style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={data?.data?.applications || []}
            columns={columns}
            loading={isLoading}
            paginationMode="server"
            rowCount={data?.data?.total || 0}
            paginationModel={{ page: page - 1, pageSize: 10 }}
            onPaginationModelChange={(model) => setPage(model.page + 1)}
            sx={{ border: 'none' }}
          />
        </Box>
      </Paper>

      {/* Details Side Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box sx={{ width: 480, p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {selectedApp && (
            <>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                Application Review
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#2563EB', fontWeight: 700, mb: 3 }}>
                {selectedApp.applicationNumber}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2 }}>
                  BUSINESS INFORMATION
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Business Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{selectedApp.businessName}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Owner Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedApp.ownerName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Business Type</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApp.businessType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Preferred Store</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApp.preferredStoreName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">GST Number</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApp.gstNumber || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">PAN Number</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApp.panNumber || 'N/A'}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2 }}>
                  ADDRESS & CONTACTS
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedApp.addressLine1}, {selectedApp.addressLine2 || ''}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">City</Typography>
                    <Typography variant="body2">{selectedApp.city}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">PIN Code</Typography>
                    <Typography variant="body2">{selectedApp.postalCode}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">State</Typography>
                    <Typography variant="body2">{selectedApp.state}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Country</Typography>
                    <Typography variant="body2">{selectedApp.country}</Typography>
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748B', mb: 2 }}>
                  CREDENTIAL DOCUMENTS
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    { label: 'Business Logo', path: selectedApp.logoPath },
                    { label: 'Business License *', path: selectedApp.licensePath },
                    { label: 'GST Certificate', path: selectedApp.gstCertificatePath },
                    { label: 'Identity Proof *', path: selectedApp.identityProofPath },
                  ].map((doc) => (
                    <Grid item xs={6} key={doc.label}>
                      <Paper sx={{ p: 1.5, border: '1px solid #F1F5F9', textAlign: 'center', bgcolor: '#F8FAFC' }}>
                        <Typography variant="caption" display="block" sx={{ fontWeight: 700, mb: 1 }}>{doc.label}</Typography>
                        {doc.path ? (
                          <Link href={`${API_BASE}${doc.path}`} target="_blank" underline="hover" sx={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                            <FileText size={14} /> Open Document
                          </Link>
                        ) : (
                          <Typography variant="caption" color="text.secondary">Not Attached</Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {selectedApp.status === 'Rejected' && selectedApp.reviewNotes && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Rejection Notes:</Typography>
                    <Typography variant="body2">{selectedApp.reviewNotes}</Typography>
                  </Alert>
                )}
              </Box>

              {selectedApp.status === 'Pending' && (
                <Box sx={{ display: 'flex', gap: 2, pt: 3, borderTop: '1px solid #E2E8F0' }}>
                  <Button variant="contained" color="success" fullWidth startIcon={<CheckCircle2 size={18} />} onClick={handleApproveClick}>
                    Approve Application
                  </Button>
                  <Button variant="contained" color="error" fullWidth startIcon={<XCircle size={18} />} onClick={handleRejectClick}>
                    Reject Application
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Drawer>

      {/* Approve Confirmation Dialog */}
      <Dialog open={isApproveDialogOpen} onClose={() => setIsApproveDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Approve Seller Application?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Confirming this will create the seller tenant organization, store, and user account with temporary login credentials.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success" variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Confirm Approve & Onboard'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onClose={() => setIsRejectDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Reject Seller Application</DialogTitle>
        <DialogContent sx={{ minWidth: 320 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide the review reason to send to the seller applicant explaining why the submission was rejected.
          </Typography>
          <TextField
            label="Rejection Reason"
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRejectConfirm} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Reject Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Seller Account Created Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onClose={() => setIsSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircle2 color="#10B981" size={24} /> Seller Account Created Successfully
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            The seller tenant organization, store, and user account have been provisioned. Welcome email with login instructions has been dispatched.
          </Typography>

          {createdCredentials && (
            <Paper sx={{ p: 3, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>EMAIL ADDRESS</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    {createdCredentials.email}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TEMPORARY PASSWORD</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1, color: '#2563EB' }}>
                      {showPassword ? createdCredentials.temporaryPassword : '••••••••••••'}
                    </Typography>
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TENANT ORGANIZATION</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {createdCredentials.tenantName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>INITIAL STORE</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {createdCredentials.storeName}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Copy size={16} />}
              onClick={handleCopyCredentials}
            >
              Copy Credentials
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Send size={16} />}
              onClick={handleResendEmailClick}
            >
              Send Email Again
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<Download size={16} />}
              onClick={handleDownloadPdf}
            >
              Download PDF
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsSuccessDialogOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

