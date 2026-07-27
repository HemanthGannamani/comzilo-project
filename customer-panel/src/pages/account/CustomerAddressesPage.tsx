import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import {
  useGetMyAddressesQuery,
  useCreateMyAddressMutation,
  useUpdateMyAddressMutation,
  useDeleteMyAddressMutation,
  useSetDefaultAddressMutation,
} from '../../api/customerPortalApi';
import toast from 'react-hot-toast';

export const CustomerAddressesPage: React.FC = () => {
  const { data: addressData, isLoading } = useGetMyAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateMyAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateMyAddressMutation();
  const [deleteAddress] = useDeleteMyAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    addressType: 'shipping',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const addresses = addressData?.data || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      addressType: 'shipping',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (addr: any) => {
    setEditingId(addr.id);
    setFormData({
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'United States',
      addressType: addr.addressType || 'shipping',
      isDefaultShipping: addr.isDefaultShipping || false,
      isDefaultBilling: addr.isDefaultBilling || false,
    });
    setOpenModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast.error('Address line 1, city, and postal code are required');
      return;
    }

    try {
      if (editingId) {
        await updateAddress({ id: editingId, data: formData }).unwrap();
        toast.success('Address updated successfully');
      } else {
        await createAddress(formData).unwrap();
        toast.success('Address created successfully');
      }
      setOpenModal(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id).unwrap();
      toast.success('Address deleted successfully');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: number, type: 'shipping' | 'billing') => {
    try {
      await setDefaultAddress({ id, type }).unwrap();
      toast.success(`Default ${type} address updated`);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to set default address');
    }
  };

  return (
    <CustomerAccountLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            Saved Addresses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage shipping & billing delivery locations.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenAdd}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Add New Address
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={36} />
        </Box>
      ) : addresses.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Typography color="text.secondary">No saved addresses found. Add a delivery address for fast checkout!</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {addresses.map((addr: any) => (
            <Grid key={addr.id} item xs={12} sm={6}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  boxShadow: 'none',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                  {addr.isDefaultShipping && <Chip label="DEFAULT SHIPPING" color="primary" size="small" sx={{ fontWeight: 700 }} />}
                  {addr.isDefaultBilling && <Chip label="DEFAULT BILLING" color="secondary" size="small" sx={{ fontWeight: 700 }} />}
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
                  {addr.addressLine1}
                </Typography>
                {addr.addressLine2 && (
                  <Typography variant="body2" color="text.secondary">
                    {addr.addressLine2}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {addr.city}, {addr.state} {addr.postalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {addr.country}
                </Typography>

                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #F1F5F9', display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Button size="small" startIcon={<Edit2 size={14} />} onClick={() => handleOpenEdit(addr)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<Trash2 size={14} />} onClick={() => handleDelete(addr.id)}>
                    Delete
                  </Button>

                  {!addr.isDefaultShipping && (
                    <Button size="small" color="primary" onClick={() => handleSetDefault(addr.id, 'shipping')}>
                      Make Default
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CRUD Address Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 1"
                  fullWidth
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 2 (Optional)"
                  fullWidth
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  fullWidth
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State / Province"
                  fullWidth
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Postal Code"
                  fullWidth
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  fullWidth
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isCreating || isUpdating}>
              {editingId ? 'Save Changes' : 'Create Address'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </CustomerAccountLayout>
  );
};
