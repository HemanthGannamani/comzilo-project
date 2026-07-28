import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Plus, Edit2, Trash2, MapPin, Navigation } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { MapLocationPickerModal } from '../../components/common/MapLocationPickerModal';
import {
  useGetMyAddressesQuery,
  useCreateMyAddressMutation,
  useUpdateMyAddressMutation,
  useDeleteMyAddressMutation,
  useSetDefaultAddressMutation,
  useGetCustomerProfileQuery,
} from '../../api/customerPortalApi';
import toast from 'react-hot-toast';

// Comprehensive Country & State/Province Registry
const COUNTRY_STATES_MAP: Record<string, string[]> = {
  'India': [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
    'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
    'Lakshadweep', 'Puducherry'
  ],
  'United States': [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ],
  'Canada': [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Northwest Territories', 'Nunavut', 'Yukon'
  ],
  'United Kingdom': [
    'England', 'Scotland', 'Wales', 'Northern Ireland'
  ],
  'Australia': [
    'New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia',
    'Tasmania', 'Australian Capital Territory', 'Northern Territory'
  ],
  'United Arab Emirates': [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'
  ],
  'Germany': [
    'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
    'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
    'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
  ],
  'France': [
    'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
    'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine',
    'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
  ],
  'Singapore': [
    'Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'
  ],
  'Japan': [
    'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki',
    'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama',
    'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie', 'Shiga',
    'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane', 'Okayama',
    'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga',
    'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
  ],
  'Saudi Arabia': [
    'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Al-Qassim', 'Ha\'il', 'Tabuk',
    'Al-Jawf', 'Northern Borders', 'Jazan', 'Najran', 'Al-Bahah', '\'Asir'
  ],
  'Other': []
};

const COUNTRY_LIST = Object.keys(COUNTRY_STATES_MAP);

export const CustomerAddressesPage: React.FC = () => {
  const { data: addressData, isLoading } = useGetMyAddressesQuery();
  const { data: profileData } = useGetCustomerProfileQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateMyAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateMyAddressMutation();
  const [deleteAddress] = useDeleteMyAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [openModal, setOpenModal] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const customerUser = profileData?.data?.user;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'shipping',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const addresses = addressData?.data || [];

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      fullName: customerUser ? `${customerUser.firstName || ''} ${customerUser.lastName || ''}`.trim() : '',
      phone: customerUser?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: COUNTRY_STATES_MAP['India'][0] || '',
      postalCode: '',
      country: 'India',
      addressType: 'shipping',
      isDefaultShipping: false,
      isDefaultBilling: false,
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (addr: any) => {
    setEditingId(addr.id);
    setFormData({
      fullName: addr.fullName || (customerUser ? `${customerUser.firstName || ''} ${customerUser.lastName || ''}`.trim() : ''),
      phone: addr.phone || customerUser?.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
      addressType: addr.addressType || 'shipping',
      isDefaultShipping: addr.isDefaultShipping || false,
      isDefaultBilling: addr.isDefaultBilling || false,
    });
    setOpenModal(true);
  };

  const handleCountryChange = (selectedCountry: string) => {
    const availableStates = COUNTRY_STATES_MAP[selectedCountry] || [];
    setFormData({
      ...formData,
      country: selectedCountry,
      state: availableStates.length > 0 ? availableStates[0] : '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.addressLine1 || !formData.city || !formData.postalCode) {
      toast.error('Address Line 1, City, and Postal Code are required');
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

  const availableStates = COUNTRY_STATES_MAP[formData.country] || [];

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

                {addr.fullName && (
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B' }}>
                    {addr.fullName} {addr.phone ? `(${addr.phone})` : ''}
                  </Typography>
                )}

                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, color: '#0F172A' }}>
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
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</span>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<MapPin size={16} />}
            onClick={() => setOpenMapModal(true)}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            Pick Location on Map / GPS
          </Button>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>

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
                  select
                  label="Country"
                  fullWidth
                  required
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                >
                  {COUNTRY_LIST.map((cName) => (
                    <MenuItem key={cName} value={cName}>
                      {cName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                {availableStates.length > 0 ? (
                  <TextField
                    select
                    label="State / Province"
                    fullWidth
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    {availableStates.map((st) => (
                      <MenuItem key={st} value={st}>
                        {st}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    label="State / Province"
                    fullWidth
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                )}
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

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        open={openMapModal}
        onClose={() => setOpenMapModal(false)}
        onSelectLocation={(loc) => {
          setFormData((prev) => ({
            ...prev,
            addressLine1: loc.addressLine1 || prev.addressLine1,
            city: loc.city || prev.city,
            state: loc.state || prev.state,
            country: loc.country || prev.country,
            postalCode: loc.postalCode || prev.postalCode,
          }));
          toast.success('Address auto-filled from map selection!');
        }}
      />
    </CustomerAccountLayout>
  );
};
