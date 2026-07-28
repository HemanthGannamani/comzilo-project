import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Plus,
  Edit3,
  Trash2,
  Key,
  ShieldCheck,
  Search,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/data-display/DataTable';
import {
  useGetPlatformUsersQuery,
  useCreatePlatformUserMutation,
  useUpdatePlatformUserMutation,
  useDeletePlatformUserMutation,
  useResetPlatformUserPasswordMutation,
} from '../../api/adminApi';
import toast from 'react-hot-toast';

export const PlatformUsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: usersResponse, isLoading, isError } = useGetPlatformUsersQuery({
    search,
    role: roleFilter,
    status: statusFilter,
    page: page + 1,
    limit: pageSize,
  });

  const [createUser, { isLoading: isCreating }] = useCreatePlatformUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdatePlatformUserMutation();
  const [deleteUser] = useDeletePlatformUserMutation();
  const [resetPassword] = useResetPlatformUserPasswordMutation();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleCode: 'SUPER_ADMIN',
    status: 'active',
  });

  const users = usersResponse?.data || [];
  const totalUsers = usersResponse?.meta?.total || users.length;

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setValidationError(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      roleCode: 'SUPER_ADMIN',
      status: 'active',
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setValidationError(null);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      roleCode: user.role || 'SUPER_ADMIN',
      status: user.rawStatus || (user.status === 'Active' ? 'active' : 'inactive'),
    });
    setEditModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.firstName.trim()) {
      setValidationError('First Name is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      if (selectedUser) {
        await updateUser({
          id: selectedUser.id,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          roleCode: formData.roleCode,
          status: formData.status,
        }).unwrap();
        toast.success(`Platform User '${formData.firstName}' updated successfully!`);
        setEditModalOpen(false);
      } else {
        await createUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          roleCode: formData.roleCode,
          status: formData.status,
        }).unwrap();
        toast.success(`New Platform Administrator '${formData.firstName}' created & credentials emailed!`);
        setCreateModalOpen(false);
      }
    } catch (err: any) {
      setValidationError(err?.data?.message || err?.message || 'Failed to save platform user.');
    }
  };

  const handleResetPassword = async (user: any) => {
    if (!window.confirm(`Generate new temporary password and email credentials to ${user.email}?`)) return;
    try {
      const res = await resetPassword(user.id).unwrap();
      toast.success(`New credentials emailed to ${user.email}! (Temp Pass: ${res?.data?.tempPassword || 'Sent'})`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reset password.');
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(`Are you sure you want to delete platform administrator '${user.name}'?`)) return;
    try {
      await deleteUser(user.id).unwrap();
      toast.success(`Platform User '${user.name}' deleted successfully.`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete platform user.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'SUPER_ADMIN':
        return 'error';
      case 'PLATFORM_ADMIN':
        return 'primary';
      case 'PLATFORM_OPERATIONS':
      case 'PLATFORM_OPERATOR':
        return 'secondary';
      case 'SUPPORT':
        return 'info';
      case 'FINANCE':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'name',
      headerName: 'Administrator Name',
      flex: 1.5,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#2563EB', width: 34, height: 34, fontSize: 14, fontWeight: 700 }}>
            {params.row.firstName?.[0] || 'A'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID #{params.row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email Address', flex: 1.5 },
    { field: 'phone', headerName: 'Phone Number', flex: 1 },
    {
      field: 'role',
      headerName: 'Platform Role',
      width: 180,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={getRoleBadgeColor(params.value) as any}
          size="small"
          sx={{ fontWeight: 800, fontSize: 11 }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          color={params.value === 'Active' ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit Administrator">
            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(params.row)}>
              <Edit3 size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Password & Resend Credentials">
            <IconButton size="small" color="warning" onClick={() => handleResetPassword(params.row)}>
              <Key size={17} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Administrator">
            <IconButton size="small" color="error" onClick={() => handleDeleteUser(params.row)}>
              <Trash2 size={17} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <PageContainer
      title="Platform Administrators"
      subtitle="Enterprise User Management System - Roles, Entitlements & Access Controls"
      action={
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
        >
          Add Platform User
        </Button>
      }
    >
      {/* SEARCH & FILTERS TOOLBAR */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by administrator name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <Search size={18} style={{ marginRight: 8, color: '#64748B' }} />,
              }}
            />
          </Grid>

          <Grid item xs={6} md={3.5}>
            <FormControl size="small" fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Platform Roles</MenuItem>
                <MenuItem value="SUPER_ADMIN">Super Administrator (SUPER_ADMIN)</MenuItem>
                <MenuItem value="PLATFORM_ADMIN">Platform Admin (PLATFORM_ADMIN)</MenuItem>
                <MenuItem value="PLATFORM_OPERATIONS">Platform Operations (OPERATIONS)</MenuItem>
                <MenuItem value="SUPPORT">Support Specialist (SUPPORT)</MenuItem>
                <MenuItem value="FINANCE">Finance Auditor (FINANCE)</MenuItem>
                <MenuItem value="READ_ONLY">Read Only (READ_ONLY)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3.5}>
            <FormControl size="small" fullWidth>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load platform users from backend. Please refresh.
        </Alert>
      )}

      {/* DATA TABLE */}
      <DataTable
        rows={users}
        columns={columns}
        loading={isLoading}
        rowCount={totalUsers}
        page={page}
        pageSize={pageSize}
        onPageChange={(newPage: number) => setPage(newPage)}
        onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
      />

      {/* CREATE & EDIT PLATFORM USER DIALOG */}
      <Dialog
        open={createModalOpen || editModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditModalOpen(false);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {selectedUser ? `Edit Platform User: ${selectedUser.name}` : 'Create New Platform Administrator'}
        </DialogTitle>

        <form onSubmit={handleSaveUser}>
          <DialogContent dividers sx={{ py: 3 }}>
            {validationError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {validationError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name *"
                  fullWidth
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email Address *"
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Platform Role</InputLabel>
                  <Select
                    value={formData.roleCode}
                    label="Platform Role"
                    onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
                  >
                    <MenuItem value="SUPER_ADMIN">Super Admin (Root)</MenuItem>
                    <MenuItem value="PLATFORM_ADMIN">Platform Admin</MenuItem>
                    <MenuItem value="PLATFORM_OPERATIONS">Platform Operations</MenuItem>
                    <MenuItem value="SUPPORT">Support Specialist</MenuItem>
                    <MenuItem value="FINANCE">Finance Auditor</MenuItem>
                    <MenuItem value="READ_ONLY">Read Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Account Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Account Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {!selectedUser && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    🔑 A secure temporary password will be generated automatically and emailed to the administrator. They will be required to update their password upon first login.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
              }}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
              startIcon={
                isCreating || isUpdating ? <CircularProgress size={18} color="inherit" /> : <ShieldCheck size={18} />
              }
              sx={{ fontWeight: 700, px: 3 }}
            >
              Save Platform User
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};
