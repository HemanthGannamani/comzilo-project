import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  ShieldAlert,
  CheckCircle2,
  KeyRound,
  Trash2,
  Building2,
  Store,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import {
  useGetSellerByIdQuery,
  useUpdateSellerMutation,
  useSuspendSellerMutation,
  useActivateSellerMutation,
  useResetSellerPasswordMutation,
  useResendSellerCredentialsMutation,
  useImpersonateSellerMutation,
  useDeleteSellerMutation,
  useGetStoresQuery,
} from '../api/adminApi';
import toast from 'react-hot-toast';

export const SellerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: sellerData, isLoading, refetch } = useGetSellerByIdQuery(id || '');
  const { data: storesData } = useGetStoresQuery({ limit: 100 });

  const [updateSeller] = useUpdateSellerMutation();
  const [suspendSeller] = useSuspendSellerMutation();
  const [activateSeller] = useActivateSellerMutation();
  const [resetPassword] = useResetSellerPasswordMutation();
  const [resendCredentials] = useResendSellerCredentialsMutation();
  const [impersonateSeller] = useImpersonateSellerMutation();
  const [deleteSeller] = useDeleteSellerMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [suspendReason, setSuspendReason] = useState('');
  const [tempPassword, setTempPassword] = useState('');

  const [editForm, setEditForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    storeId: '',
    roleCode: '',
    status: '',
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  const seller = sellerData?.data;
  if (!seller) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error">Seller profile not found.</Typography>
      </Container>
    );
  }

  const handleEditClick = () => {
    setEditForm({
      ownerName: `${seller.firstName || ''} ${seller.lastName || ''}`.trim(),
      email: seller.email || '',
      phone: seller.mobile || '',
      businessName: seller.profile?.metadata?.businessName || '',
      businessType: seller.profile?.metadata?.businessType || 'Retail',
      gstNumber: seller.profile?.metadata?.gstNumber || '',
      panNumber: seller.profile?.metadata?.panNumber || '',
      addressLine1: seller.profile?.addressLine1 || '',
      addressLine2: seller.profile?.addressLine2 || '',
      city: seller.profile?.city || '',
      state: seller.profile?.state || '',
      country: seller.profile?.country || '',
      postalCode: seller.profile?.postalCode || '',
      storeId: seller.userRoles?.[0]?.storeId || '',
      roleCode: seller.userRoles?.[0]?.role?.code || 'tenant_owner',
      status: seller.status || 'active',
    });
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await updateSeller({
        id: seller.id,
        data: {
          ...editForm,
          storeId: editForm.storeId ? Number(editForm.storeId) : null,
        },
      }).unwrap();
      toast.success('Seller profile updated successfully');
      setIsEditOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update seller');
    }
  };

  const handleSuspendConfirm = async () => {
    if (!suspendReason.trim()) {
      toast.error('Reason is required');
      return;
    }
    try {
      await suspendSeller({ id: seller.id, reason: suspendReason }).unwrap();
      toast.success('Seller suspended successfully');
      setIsSuspendOpen(false);
      setSuspendReason('');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to suspend seller');
    }
  };

  const handleActivateClick = async () => {
    try {
      await activateSeller(seller.id).unwrap();
      toast.success('Seller account activated');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to activate seller');
    }
  };

  const handleResetPasswordClick = async () => {
    try {
      const res = await resetPassword(seller.id).unwrap();
      setTempPassword(res.data?.temporaryPassword);
      setIsResetOpen(true);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reset password');
    }
  };

  const handleResendCredentialsClick = async () => {
    try {
      const res = await resendCredentials(seller.id).unwrap();
      setTempPassword(res.data?.temporaryPassword);
      setIsResetOpen(true);
      toast.success('Credentials resent successfully to seller email');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to resend credentials');
    }
  };

  const handleImpersonateClick = async () => {
    try {
      const res = await impersonateSeller(seller.id).unwrap();
      toast.success(res.data?.message || 'Impersonation token created. Placeholder active.');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to impersonate seller');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSeller(seller.id).unwrap();
      toast.success('Seller account soft-deleted successfully');
      setIsDeleteOpen(false);
      navigate('/sellers');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete seller');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/sellers')} color="primary">
            <ArrowLeft />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 850, color: '#0F172A' }}>
              {seller.profile?.metadata?.businessName || 'Seller Details'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {seller.uuid}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={seller.status}
          color={seller.status === 'active' ? 'success' : 'error'}
          sx={{ fontWeight: 700, textTransform: 'capitalize' }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <User size={20} color="#3B82F6" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Owner Information</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{seller.firstName} {seller.lastName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{seller.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{seller.mobile || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Verification State</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {seller.emailVerifiedAt ? 'Email Verified' : 'Unverified'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Building2 size={20} color="#10B981" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Business Credentials</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">GST Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{seller.profile?.metadata?.gstNumber || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">PAN Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{seller.profile?.metadata?.panNumber || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Business Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{seller.profile?.metadata?.businessType || 'Retail'}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <MapPin size={20} color="#F59E0B" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Registered Address</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {seller.profile?.addressLine1 || 'N/A'}{seller.profile?.addressLine2 ? `, ${seller.profile.addressLine2}` : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">City & State</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {seller.profile?.city || 'N/A'}, {seller.profile?.state || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Postal Code & Country</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {seller.profile?.postalCode || 'N/A'}, {seller.profile?.country || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Info Mapping Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Store size={20} color="#8B5CF6" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Mappings</Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Tenant Name</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{seller.tenant?.name || 'N/A'}</Typography>
                  <Button size="small" onClick={() => navigate('/tenants')}>View Tenant</Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Store Assignment</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{seller.userRoles?.[0]?.store?.name || 'N/A'}</Typography>
                  <Button size="small" onClick={() => navigate('/stores')}>View Store</Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Role Code</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {seller.userRoles?.[0]?.role?.name || 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 2 }}>
              <Calendar size={20} color="#64748B" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>System Info</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Onboarded Date</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {new Date(seller.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">Last Login</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {seller.lastLoginAt ? new Date(seller.lastLoginAt).toLocaleString() : 'Never'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Quick Actions Panel */}
          <Paper sx={{ p: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>Lifecycle Controls</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" color="primary" fullWidth startIcon={<Edit size={16} />} onClick={handleEditClick}>
                Edit Profile
              </Button>
              {seller.status !== 'suspended' ? (
                <Button variant="outlined" color="error" fullWidth startIcon={<ShieldAlert size={16} />} onClick={() => setIsSuspendOpen(true)}>
                  Suspend Seller
                </Button>
              ) : (
                <Button variant="outlined" color="success" fullWidth startIcon={<CheckCircle2 size={16} />} onClick={handleActivateClick}>
                  Activate Seller
                </Button>
              )}
              <Button variant="outlined" color="warning" fullWidth startIcon={<KeyRound size={16} />} onClick={handleResetPasswordClick}>
                Reset Password
              </Button>
              <Button variant="outlined" color="info" fullWidth onClick={handleResendCredentialsClick}>
                Resend Credentials
              </Button>
              <Button variant="outlined" color="secondary" fullWidth onClick={handleImpersonateClick}>
                Login as Seller (Impersonation)
              </Button>
              <Button variant="outlined" color="error" fullWidth startIcon={<Trash2 size={16} />} onClick={() => setIsDeleteOpen(true)}>
                Delete Account
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Seller Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Edit Seller Profile</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Owner Name"
            fullWidth
            value={editForm.ownerName}
            onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
          />
          <TextField
            label="Email Address"
            fullWidth
            disabled={!!seller.emailVerifiedAt}
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            helperText={seller.emailVerifiedAt ? "Cannot change email as it is already verified" : ""}
          />
          <TextField
            label="Phone Mobile"
            fullWidth
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <TextField
            label="Business Name"
            fullWidth
            value={editForm.businessName}
            onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Business Type</InputLabel>
            <Select
              value={editForm.businessType}
              label="Business Type"
              onChange={(e) => setEditForm({ ...editForm, businessType: e.target.value })}
            >
              <MenuItem value="Retail">Retail</MenuItem>
              <MenuItem value="Wholesale">Wholesale</MenuItem>
              <MenuItem value="Manufacturer">Manufacturer</MenuItem>
              <MenuItem value="Distributor">Distributor</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="GST Number"
            fullWidth
            value={editForm.gstNumber}
            onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
          />
          <TextField
            label="PAN Number"
            fullWidth
            value={editForm.panNumber}
            onChange={(e) => setEditForm({ ...editForm, panNumber: e.target.value })}
          />
          <TextField
            label="Address Line 1"
            fullWidth
            value={editForm.addressLine1}
            onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })}
          />
          <TextField
            label="Address Line 2"
            fullWidth
            value={editForm.addressLine2}
            onChange={(e) => setEditForm({ ...editForm, addressLine2: e.target.value })}
          />
          <TextField
            label="City"
            fullWidth
            value={editForm.city}
            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
          />
          <TextField
            label="State"
            fullWidth
            value={editForm.state}
            onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
          />
          <TextField
            label="Country"
            fullWidth
            value={editForm.country}
            onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
          />
          <TextField
            label="Postal Code"
            fullWidth
            value={editForm.postalCode}
            onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Store Assignment</InputLabel>
            <Select
              value={editForm.storeId}
              label="Store Assignment"
              onChange={(e) => setEditForm({ ...editForm, storeId: e.target.value })}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {storesData?.data?.stores?.map((s: any) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Role Mapping</InputLabel>
            <Select
              value={editForm.roleCode}
              label="Role Mapping"
              onChange={(e) => setEditForm({ ...editForm, roleCode: e.target.value })}
            >
              <MenuItem value="tenant_owner">Seller</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={editForm.status}
              label="Status"
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
              <MenuItem value="disabled">Disabled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save Updates
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={isSuspendOpen} onClose={() => setIsSuspendOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Suspend Seller?</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Provide a suspension reason. The seller will immediately be blocked from logging into the platform.
          </Typography>
          <TextField
            label="Suspension Reason"
            fullWidth
            multiline
            rows={2}
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
          <Button onClick={handleSuspendConfirm} variant="contained" color="error">
            Suspend Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Result Dialog */}
      <Dialog open={isResetOpen} onClose={() => setIsResetOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Temporary Password Generated</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The seller password has been reset successfully. Please share this temporary password with the user. It will not be shown again.
          </Typography>
          <Paper sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: 1.5, color: '#0F172A' }}>
              {tempPassword}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsResetOpen(false)} variant="contained" color="primary">
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Soft Delete Seller Account?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to soft-delete this seller account? Relational mappings will remain intact, but the user won't be able to log in.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
