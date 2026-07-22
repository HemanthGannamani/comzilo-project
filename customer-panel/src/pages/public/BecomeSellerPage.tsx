import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Grid, TextField, Button, MenuItem, FormControl, InputLabel, Select, Alert, CircularProgress, Divider } from '@mui/material';
import { CheckCircle, UploadCloud, Store, Briefcase } from 'lucide-react';
import { axiosInstance } from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export const BecomeSellerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessType: 'Retail',
    gstNumber: '',
    panNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    preferredStoreName: '',
    password: '',
    confirmPassword: '',
  });

  const [files, setFiles] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ applicationNumber: string; status: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size Validation (5 MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must not exceed 5 MB');
      return;
    }

    // Type Validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Allowed formats: PDF, JPG, JPEG, PNG');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFiles((prev) => ({ ...prev, [key]: reader.result as string }));
      toast.success(`${file.name} uploaded successfully`);
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!files.license) {
      setErrorMsg('Business License is required');
      setLoading(false);
      return;
    }

    if (!files.identityProof) {
      setErrorMsg('Identity Proof is required');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        logo: files.logo || null,
        license: files.license,
        gstCertificate: files.gstCertificate || null,
        identityProof: files.identityProof,
      };

      const res = await axiosInstance.post('/seller-applications', payload);
      setSuccessData(res.data.data);
      toast.success('Application submitted successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit application. Please check all fields.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Paper sx={{ p: 6, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#ECFDF5', borderRadius: '50%', mb: 2 }}>
            <CheckCircle size={48} color="#10B981" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
            Application Submitted Successfully
          </Typography>

          <Box sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 3, mb: 4, display: 'inline-block', minWidth: 320 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              APPLICATION NUMBER
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5, fontFamily: 'monospace' }}>
              {successData.applicationNumber}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              STATUS
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#F59E0B' }}>
              Pending Approval
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Thank you for applying to become a Comzilo Seller. Your application has been submitted successfully.
            Our team will review your application and you will receive further communication after the review process.
          </Typography>

          <Button href="/" variant="contained" size="large" sx={{ fontWeight: 700, px: 4 }}>
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 5, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#EFF6FF', borderRadius: '50%', mb: 1.5 }}>
            <Store size={36} color="#2563EB" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Register as a Comzilo Seller
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Submit your retail or business application to start listing inventory on Comzilo storefront.
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMsg}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Business Info */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Briefcase size={20} color="#2563EB" /> 1. Business Information
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="businessName"
                label="Business Name *"
                fullWidth
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="ownerName"
                label="Owner Full Name *"
                fullWidth
                value={formData.ownerName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Business Email *"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Mobile Number *"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Business Type *</InputLabel>
                <Select
                  value={formData.businessType}
                  label="Business Type *"
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
          </Grid>

          {/* Section 2: Business Identifiers */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            2. Business Identifiers
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="gstNumber"
                label="GST Number (Optional)"
                fullWidth
                value={formData.gstNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="panNumber"
                label="PAN Number (Optional)"
                fullWidth
                value={formData.panNumber}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          {/* Section 3: Address */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            3. Business Address
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                name="addressLine1"
                label="Address Line 1 *"
                fullWidth
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="addressLine2"
                label="Address Line 2"
                fullWidth
                value={formData.addressLine2}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City *"
                fullWidth
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="state"
                label="State *"
                fullWidth
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="country"
                label="Country *"
                fullWidth
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="postalCode"
                label="PIN Code *"
                fullWidth
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          {/* Section 4: Store Info */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            4. Store Information
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12}>
              <TextField
                name="preferredStoreName"
                label="Preferred Store Name *"
                fullWidth
                value={formData.preferredStoreName}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          {/* Section 5: Account Info */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            5. Account Configuration
          </Typography>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password *"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Confirm Password *"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          {/* Section 6: Document Uploads */}
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            6. Document Credentials (Max 5MB each)
          </Typography>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {[
              { key: 'logo', label: 'Business Logo (Optional)' },
              { key: 'license', label: 'Business License (Required) *' },
              { key: 'gstCertificate', label: 'GST Certificate (Optional)' },
              { key: 'identityProof', label: 'Identity Proof (Required) *' },
            ].map((upload) => (
              <Grid item xs={12} sm={6} key={upload.key}>
                <Paper sx={{ p: 2.5, border: '1px dashed #CBD5E1', textAlign: 'center', bgcolor: '#F8FAFC' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    {upload.label}
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadCloud size={16} />}
                    size="small"
                  >
                    Upload File
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, upload.key)}
                    />
                  </Button>
                  {files[upload.key] && (
                    <Typography variant="caption" display="block" color="success.main" sx={{ mt: 1.5, fontWeight: 600 }}>
                      ✓ File Attached
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ py: 1.8, fontWeight: 800, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Seller Application'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
