import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Stepper, Step, StepLabel, Button, TextField, MenuItem, FormControl, InputLabel, Select, Grid, Divider, CircularProgress } from '@mui/material';
import { User, Briefcase, Building, Store, Shield } from 'lucide-react';
import { useCreateSellerMutation, useGetTenantsQuery, useGetStoresQuery } from '../api/adminApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STEPS = [
  { label: 'Owner Info', icon: <User size={18} /> },
  { label: 'Business Info', icon: <Briefcase size={18} /> },
  { label: 'Tenant Config', icon: <Building size={18} /> },
  { label: 'Store Config', icon: <Store size={18} /> },
  { label: 'Role & Status', icon: <Shield size={18} /> },
];

export const AddSellerPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [createSeller, { isLoading }] = useCreateSellerMutation();

  const { data: tenantsData } = useGetTenantsQuery({ limit: 100 });
  const { data: storesData } = useGetStoresQuery({ limit: 100 });

  // Form State
  const [formData, setFormData] = useState({
    // Section 1: Owner
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Section 2: Business
    businessName: '',
    businessType: 'Retail',
    gstNumber: '',
    panNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    // Section 3: Tenant Config
    tenantMode: 'create', // 'assign' or 'create'
    tenantId: '',
    newTenantName: '',
    newTenantSlug: '',
    newTenantStatus: 'active',
    // Section 4: Store Config
    storeMode: 'create', // 'assign' or 'create'
    storeId: '',
    newStoreName: '',
    newStoreCode: '',
    newStoreAddress: '',
    newStoreStatus: 'active',
    // Section 5: Role & Status
    roleCode: 'tenant_owner', // 'tenant_owner', 'manager', 'staff'
    status: 'active',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Basic step validation
    if (activeStep === 0) {
      if (!formData.ownerName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        toast.error('All fields in Owner Information are required');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    if (activeStep === 1) {
      if (!formData.businessName) {
        toast.error('Business Name is required');
        return;
      }
    }
    if (activeStep === 2) {
      if (formData.tenantMode === 'assign' && !formData.tenantId) {
        toast.error('Please select an existing tenant');
        return;
      }
      if (formData.tenantMode === 'create' && (!formData.newTenantName || !formData.newTenantSlug)) {
        toast.error('Tenant Name and Slug are required');
        return;
      }
    }
    if (activeStep === 3) {
      if (formData.storeMode === 'assign' && !formData.storeId) {
        toast.error('Please select an existing store');
        return;
      }
      if (formData.storeMode === 'create' && (!formData.newStoreName || !formData.newStoreCode)) {
        toast.error('Store Name and Code/Slug are required');
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber || null,
        panNumber: formData.panNumber || null,
        addressLine1: formData.addressLine1 || null,
        addressLine2: formData.addressLine2 || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        postalCode: formData.postalCode || null,
        tenantConfig: {
          mode: formData.tenantMode,
          tenantId: formData.tenantMode === 'assign' ? parseInt(formData.tenantId) : undefined,
          newName: formData.tenantMode === 'create' ? formData.newTenantName : undefined,
          newSlug: formData.tenantMode === 'create' ? formData.newTenantSlug : undefined,
          newStatus: formData.tenantMode === 'create' ? formData.newTenantStatus : undefined,
        },
        storeConfig: {
          mode: formData.storeMode,
          storeId: formData.storeMode === 'assign' ? parseInt(formData.storeId) : undefined,
          newName: formData.storeMode === 'create' ? formData.newStoreName : undefined,
          newCode: formData.storeMode === 'create' ? formData.newStoreCode : undefined,
          newAddress: formData.storeMode === 'create' ? formData.newStoreAddress : undefined,
          newStatus: formData.storeMode === 'create' ? formData.newStoreStatus : undefined,
        },
        roleCode: formData.roleCode,
        status: formData.status,
      };

      await createSeller(payload).unwrap();
      toast.success('Seller account successfully provisioned!');
      navigate('/sellers');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create seller');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Owner Information</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="ownerName"
                label="Owner Name *"
                value={formData.ownerName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Mobile Phone *"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password *"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password *"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Business Information</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="businessName"
                label="Business Name *"
                value={formData.businessName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Business Type</InputLabel>
                <Select
                  value={formData.businessType}
                  label="Business Type"
                  onChange={(e) => handleSelectChange('businessType', e.target.value)}
                >
                  <MenuItem value="Retail">Retail</MenuItem>
                  <MenuItem value="Wholesale">Wholesale</MenuItem>
                  <MenuItem value="Manufacturer">Manufacturer</MenuItem>
                  <MenuItem value="Distributor">Distributor</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="gstNumber"
                label="GST Number"
                value={formData.gstNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="panNumber"
                label="PAN Number"
                value={formData.panNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, mt: 1 }}>Business Address</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="addressLine1"
                label="Address Line 1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="addressLine2"
                label="Address Line 2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="State"
                value={formData.state}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="postalCode"
                label="PIN Code"
                value={formData.postalCode}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Tenant Configuration</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tenant Mode</InputLabel>
                <Select
                  value={formData.tenantMode}
                  label="Tenant Mode"
                  onChange={(e) => handleSelectChange('tenantMode', e.target.value)}
                >
                  <MenuItem value="create">Option B: Create New Tenant</MenuItem>
                  <MenuItem value="assign">Option A: Assign Existing Tenant</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.tenantMode === 'assign' ? (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Tenant *</InputLabel>
                  <Select
                    value={formData.tenantId}
                    label="Select Tenant *"
                    onChange={(e) => handleSelectChange('tenantId', e.target.value)}
                  >
                    {tenantsData?.data?.tenants?.map((t: any) => (
                      <MenuItem key={t.id} value={t.id}>{t.name} ({t.slug})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="newTenantName"
                    label="Tenant Name *"
                    value={formData.newTenantName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="newTenantSlug"
                    label="Tenant Slug *"
                    placeholder="e.g. customized-slug"
                    value={formData.newTenantSlug}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tenant Status</InputLabel>
                    <Select
                      value={formData.newTenantStatus}
                      label="Tenant Status"
                      onChange={(e) => handleSelectChange('newTenantStatus', e.target.value)}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Store Configuration</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Store Mode</InputLabel>
                <Select
                  value={formData.storeMode}
                  label="Store Mode"
                  onChange={(e) => handleSelectChange('storeMode', e.target.value)}
                >
                  <MenuItem value="create">Option B: Create New Store</MenuItem>
                  <MenuItem value="assign">Option A: Assign Existing Store</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.storeMode === 'assign' ? (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Store *</InputLabel>
                  <Select
                    value={formData.storeId}
                    label="Select Store *"
                    onChange={(e) => handleSelectChange('storeId', e.target.value)}
                  >
                    {storesData?.data?.stores?.map((s: any) => (
                      <MenuItem key={s.id} value={s.id}>{s.name} ({s.slug})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="newStoreName"
                    label="Store Name *"
                    value={formData.newStoreName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="newStoreCode"
                    label="Store Code/Slug *"
                    placeholder="e.g. hyderabad-outlet"
                    value={formData.newStoreCode}
                    onChange={handleInputChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="newStoreAddress"
                    label="Store Address"
                    value={formData.newStoreAddress}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Store Status</InputLabel>
                    <Select
                      value={formData.newStoreStatus}
                      label="Store Status"
                      onChange={(e) => handleSelectChange('newStoreStatus', e.target.value)}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="suspended">Suspended</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        );

      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Role & Status Configuration</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Onboarding Role *</InputLabel>
                <Select
                  value={formData.roleCode}
                  label="Onboarding Role *"
                  onChange={(e) => handleSelectChange('roleCode', e.target.value)}
                >
                  <MenuItem value="tenant_owner">Seller</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleSelectChange('status', e.target.value)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="disabled">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 5, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1, textAlign: 'center' }}>
          Direct Seller Onboarding
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Manually provision new merchants, tenants, stores, and managers.
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
          {STEPS.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 280, mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || isLoading}
            onClick={handleBack}
            variant="outlined"
            sx={{ fontWeight: 700 }}
          >
            Back
          </Button>

          {activeStep === STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{ fontWeight: 800, px: 4 }}
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Provision Seller'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ fontWeight: 800, px: 4 }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};
