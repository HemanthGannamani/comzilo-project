import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  ShieldCheck,
  Laptop,
  LogOut,
  AlertTriangle,
  FileText,
  Lock,
  Scale,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Cookie,
  UserCheck,
  PackageCheck,
} from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const CustomerPrivacyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | false>('rules');

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? panel : false);
    };

  const handleLogoutAllOther = () => {
    toast.success('Successfully logged out of all other active browser sessions');
  };

  const handleDeleteRequest = () => {
    toast.success('Account deletion request submitted. Our privacy team will process it within 24 hours.');
    setConfirmDelete(false);
    dispatch(logout());
    navigate('/');
  };

  return (
    <CustomerAccountLayout>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          mb: 4,
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'rgba(37, 99, 235, 0.2)',
              color: '#60A5FA',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ShieldCheck size={32} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Platform Rules & Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Official Comzilo Terms of Service, User Regulations, Data Protection Guidelines & Account Security
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Chip label="EFFECTIVE: AUGUST 2026" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#E2E8F0', fontWeight: 700 }} />
          <Chip label="VERIFIED COMPLIANT" size="small" color="success" sx={{ fontWeight: 700 }} />
        </Box>
      </Paper>

      {/* Rules & Regulations Accordion Document */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FileText size={24} color="#2563EB" /> Marketplace Rules & Regulations Policy
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Please review the binding rules, operational regulations, buyer responsibilities, and data privacy policies governing your usage of the Comzilo Commerce Platform.
        </Typography>

        {/* Section 1: Terms of Use & Marketplace Regulations */}
        <Accordion expanded={expandedSection === 'rules'} onChange={handleAccordionChange('rules')} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ChevronDown color="#2563EB" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Scale size={20} color="#2563EB" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                1. Marketplace Terms of Use & Customer Conduct Regulations
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>1.1 Account Eligibility & Authenticity:</strong> By creating an account on Comzilo, you certify that all information provided (full name, email address, shipping destination, phone number) is accurate and up to date. Impersonation or unauthorized use of third-party credentials is strictly prohibited.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>1.2 Order Integrity & Fraud Prevention:</strong> Placed orders represent a binding purchase request. Orders determined to be fraudulent, automated bot requests, or placed using unauthorized payment instruments will be subject to immediate cancellation and account suspension.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>1.3 Cash on Delivery (COD) Rules:</strong> Selecting Cash on Delivery requires customer commitment to accept and pay the courier upon package arrival. Repeated refusal of COD packages without valid reason may result in revocation of COD payment options for future orders.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Section 2: Data Privacy & Protection Policy */}
        <Accordion expanded={expandedSection === 'privacy'} onChange={handleAccordionChange('privacy')} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ChevronDown color="#2563EB" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Lock size={20} color="#2563EB" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                2. Privacy Policy & Data Collection Protection
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>2.1 Personal Information We Collect:</strong> We collect personal details required to process transactions and deliver goods, including your name, delivery address, phone number, payment transaction tokens, and IP address.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>2.2 Usage of Data:</strong> Your data is used exclusively for order fulfillment, shipment tracking, order status notifications, seller dispatch coordination, and customer support. We <strong>never sell or rent your personal data</strong> to third-party advertisers.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>2.3 Secure Encryption:</strong> All sensitive payload data, including login authentication credentials and payment authorization tokens, are transmitted over 256-bit SSL encryption and stored in PCI-DSS compliant infrastructure.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Section 3: Shipping, Returns & Refund Policy */}
        <Accordion expanded={expandedSection === 'shipping'} onChange={handleAccordionChange('shipping')} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px !important', mb: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ChevronDown color="#2563EB" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PackageCheck size={20} color="#2563EB" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                3. Shipping, Returns & Replacement Regulations
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>3.1 Delivery Dispatch Timelines:</strong> Physical items are dispatched through authorized multi-vendor sellers within 1-3 business days. Estimated delivery dates are displayed during checkout and tracking links are available in your orders history.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>3.2 Return & Replacement Window:</strong> Customers may request returns or replacements for damaged, defective, or incorrect items within 7 days of delivery through the Support Center portal.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>3.3 Refund Processing:</strong> Approved refunds for online prepaid transactions are credited back to the original payment source within 5-7 business days after seller item inspection.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Section 4: Cookies & Security Policy */}
        <Accordion expanded={expandedSection === 'cookies'} onChange={handleAccordionChange('cookies')} sx={{ border: '1px solid #E2E8F0', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ChevronDown color="#2563EB" />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Cookie size={20} color="#2563EB" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                4. Cookies & Browser Security Settings
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>4.1 Essential Session Cookies:</strong> We utilize encrypted httpOnly session tokens and local storage strictly to keep you securely signed in, maintain shopping cart contents, and preserve currency preferences.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>4.2 Security Audit Logs:</strong> Security logs record browser user-agent strings and IP addresses for fraud detection, multi-device management, and account security verification.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Active Login Sessions */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
              Active Login Sessions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Devices currently authenticated and signed in to your account.
            </Typography>
          </Box>
          <Button variant="outlined" color="error" startIcon={<LogOut size={16} />} onClick={handleLogoutAllOther}>
            Logout Other Devices
          </Button>
        </Box>

        <List disablePadding>
          <ListItem sx={{ px: 0, py: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: '#EFF6FF', borderRadius: 2, mr: 2 }}>
              <Laptop size={24} color="#2563EB" />
            </Box>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Chrome Browser (Windows 11)
                  </Typography>
                  <Chip label="CURRENT DEVICE" color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              }
              secondary={`IP: 127.0.0.1 • Active Now (${new Date().toLocaleTimeString()})`}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Danger Zone: Account Deletion */}
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #FCA5A5', bgcolor: '#FEF2F2', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#DC2626', mb: 1 }}>
          Account Deletion & Privacy Rights
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Request permanent deletion of your customer account, personal details, saved addresses, and order history.
        </Typography>
        <Button variant="contained" color="error" onClick={() => setConfirmDelete(true)} sx={{ fontWeight: 700, borderRadius: 2 }}>
          Request Permanent Account Deletion
        </Button>
      </Paper>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AlertTriangle size={22} /> Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to request permanent deletion of your Comzilo customer profile ({user?.email})? All your saved addresses, wishlist items, and billing history will be permanently erased.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteRequest}>
            Yes, Submit Deletion Request
          </Button>
        </DialogActions>
      </Dialog>
    </CustomerAccountLayout>
  );
};
