import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import {
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  Lock,
  ChevronDown,
  CheckSquare,
  Square,
  Shield,
  Users,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  useGetRolesQuery,
  useGetPermissionsMatrixQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} from '../../api/adminApi';
import toast from 'react-hot-toast';

import { useAppSelector } from '../../store/hooks';

export const RolesPermissionsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isReadOnly = (user?.role || '').toUpperCase() === 'READ_ONLY';

  const { data: rolesResponse, isLoading: isRolesLoading } = useGetRolesQuery();
  const { data: permsResponse, isLoading: isPermsLoading } = useGetPermissionsMatrixQuery();

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State
  const [roleForm, setRoleForm] = useState({
    code: '',
    name: '',
    description: '',
    priority: 10,
    status: 'active',
    permissionCodes: [] as string[],
  });

  const roles = rolesResponse?.data || [];
  const permCategories: { [cat: string]: any[] } = permsResponse?.data?.categories || {};

  const handleOpenCreate = () => {
    setSelectedRole(null);
    setValidationError(null);
    setRoleForm({
      code: '',
      name: '',
      description: '',
      priority: 10,
      status: 'active',
      permissionCodes: [],
    });
    setRoleModalOpen(true);
  };

  const handleOpenEdit = (role: any) => {
    setSelectedRole(role);
    setValidationError(null);

    // Fetch details including mapped permissions
    const mappedPermCodes: string[] = role.permissionCodes || [];

    setRoleForm({
      code: role.code || '',
      name: role.name || '',
      description: role.description || '',
      priority: role.priority || 10,
      status: role.status || 'active',
      permissionCodes: mappedPermCodes,
    });
    setRoleModalOpen(true);
  };

  const handleTogglePermission = (code: string) => {
    setRoleForm((prev) => {
      const exists = prev.permissionCodes.includes(code);
      const updated = exists
        ? prev.permissionCodes.filter((c) => c !== code)
        : [...prev.permissionCodes, code];
      return { ...prev, permissionCodes: updated };
    });
  };

  const handleToggleCategoryAll = (category: string, permList: any[]) => {
    const categoryCodes = permList.map((p) => p.code);
    const allSelected = categoryCodes.every((c) => roleForm.permissionCodes.includes(c));

    setRoleForm((prev) => {
      let updated: string[];
      if (allSelected) {
        updated = prev.permissionCodes.filter((c) => !categoryCodes.includes(c));
      } else {
        updated = Array.from(new Set([...prev.permissionCodes, ...categoryCodes]));
      }
      return { ...prev, permissionCodes: updated };
    });
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!roleForm.name.trim()) {
      setValidationError('Role Name is required.');
      return;
    }

    try {
      if (selectedRole) {
        await updateRole({
          id: selectedRole.id,
          name: roleForm.name.trim(),
          description: roleForm.description.trim(),
          status: roleForm.status,
          permissionCodes: roleForm.permissionCodes,
        }).unwrap();
        toast.success(`Role '${roleForm.name}' updated successfully!`);
      } else {
        await createRole({
          code: roleForm.code.trim(),
          name: roleForm.name.trim(),
          description: roleForm.description.trim(),
          status: roleForm.status,
          permissionCodes: roleForm.permissionCodes,
        }).unwrap();
        toast.success(`Custom Role '${roleForm.name}' created successfully!`);
      }
      setRoleModalOpen(false);
    } catch (err: any) {
      setValidationError(err?.data?.message || err?.message || 'Failed to save role.');
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (role.code === 'super_admin' || role.isSystem) {
      toast.error('System root roles (SUPER_ADMIN) cannot be deleted.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete role '${role.name}'?`)) return;

    try {
      await deleteRole(role.id).unwrap();
      toast.success(`Role '${role.name}' deleted successfully.`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete role.');
    }
  };

  return (
    <PageContainer
      title="Enterprise RBAC Matrix & Role Management"
      subtitle="Define granular access entitlements, module permissions, and security roles across the SaaS platform"
      action={
        !isReadOnly ? (
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleOpenCreate}
            sx={{ fontWeight: 700, borderRadius: 2, px: 2.5 }}
          >
            Create Custom Role
          </Button>
        ) : undefined
      }
    >
      {isRolesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {roles.map((r: any) => (
            <Grid key={r.id} item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  position: 'relative',
                  '&:hover': { borderColor: '#2563EB', boxShadow: '0 10px 15px -3px rgba(37,99,235,0.1)' },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldCheck size={22} color={r.code === 'super_admin' ? '#DC2626' : '#2563EB'} />
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: 16 }}>
                        {r.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={r.code.toUpperCase()}
                      color={r.code === 'super_admin' ? 'error' : 'primary'}
                      size="small"
                      sx={{ fontWeight: 800, fontSize: 10 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 2, fontSize: 13 }}>
                    {r.description || 'Enterprise platform security role.'}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      icon={<Shield size={12} />}
                      label={`${r.permissionCount || 0} Permissions`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: 11 }}
                    />
                    <Chip
                      icon={<Users size={12} />}
                      label={`${r.userCount || 0} Users`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ fontWeight: 700, fontSize: 11 }}
                    />
                    {r.isSystem && (
                      <Chip
                        icon={<Lock size={12} />}
                        label="System Core"
                        size="small"
                        color="default"
                        sx={{ fontWeight: 700, fontSize: 11 }}
                      />
                    )}
                  </Stack>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1, borderTop: '1px solid #F1F5F9' }}>
                  <Tooltip title="Configure Role Permissions Matrix">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit3 size={14} />}
                      onClick={() => handleOpenEdit(r)}
                      sx={{ fontWeight: 700 }}
                    >
                      Edit Matrix
                    </Button>
                  </Tooltip>
                  {!r.isSystem && r.code !== 'super_admin' && (
                    <Tooltip title="Delete Role">
                      <IconButton size="small" color="error" onClick={() => handleDeleteRole(r)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CREATE & EDIT ROLE PERMISSION MATRIX DIALOG */}
      <Dialog
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {selectedRole ? `Configure RBAC Matrix: ${selectedRole.name}` : 'Create Enterprise Security Role'}
        </DialogTitle>

        <form onSubmit={handleSaveRole}>
          <DialogContent dividers sx={{ py: 3, maxHeight: '70vh' }}>
            {validationError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {validationError}
              </Alert>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  label="Role Code *"
                  fullWidth
                  required
                  disabled={Boolean(selectedRole?.isSystem)}
                  value={roleForm.code}
                  onChange={(e) => setRoleForm({ ...roleForm, code: e.target.value })}
                  placeholder="e.g. store_auditor"
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Role Display Name *"
                  fullWidth
                  required
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. Store Auditor Specialist"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={2}
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Describe the entitlements and responsibilities of this security role..."
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0F172A' }}>
              Granular Module Permissions Matrix ({roleForm.permissionCodes.length} Entitlements Selected)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Check module permissions to grant access. Users assigned to this role will inherit these exact privileges.
            </Typography>

            {isPermsLoading ? (
              <CircularProgress />
            ) : (
              Object.keys(permCategories).map((cat) => {
                const catPerms = permCategories[cat] || [];
                const catCodes = catPerms.map((p) => p.code);
                const allCatSelected = catCodes.every((c) => roleForm.permissionCodes.includes(c));

                return (
                  <Accordion key={cat} sx={{ border: '1px solid #E2E8F0', mb: 1, borderRadius: '8px !important' }}>
                    <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', color: '#2563EB' }}>
                          {cat.replace('_', ' ')} MODULE ({catPerms.length} Permissions)
                        </Typography>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCategoryAll(cat, catPerms);
                          }}
                          sx={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          {allCatSelected ? 'Clear All Module Perms' : 'Select All Module Perms'}
                        </Button>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ bgcolor: '#F8FAFC', pt: 1 }}>
                      <Grid container spacing={1}>
                        {catPerms.map((p) => {
                          const isChecked = roleForm.permissionCodes.includes(p.code);
                          return (
                            <Grid key={p.id} item xs={12} sm={6} md={4}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={isChecked}
                                    onChange={() => handleTogglePermission(p.code)}
                                    size="small"
                                    color="primary"
                                  />
                                }
                                label={
                                  <Typography variant="body2" sx={{ fontSize: 13, fontWeight: isChecked ? 700 : 400 }}>
                                    {p.name}
                                  </Typography>
                                }
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRoleModalOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
              startIcon={isCreating || isUpdating ? <CircularProgress size={18} color="inherit" /> : <ShieldCheck size={18} />}
              sx={{ fontWeight: 700, px: 3 }}
            >
              Save RBAC Matrix
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};
