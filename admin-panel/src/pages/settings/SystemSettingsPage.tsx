import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import toast from 'react-hot-toast';
import {
  useGetSystemSettingsQuery,
  useSaveSystemSettingsMutation,
  useGetEmailTemplatesQuery,
  useSaveEmailTemplateMutation,
} from '../../api/adminApi';

export const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // General state
  const [appName, setAppName] = useState('Comzilo Enterprise ERP');
  const [adminEmail, setAdminEmail] = useState('admin@comzilo.com');
  const [companyName, setCompanyName] = useState('Comzilo Technologies');
  const [companyAddress, setCompanyAddress] = useState('Hyderabad, Telangana');
  const [smtpHost, setSmtpHost] = useState('smtp.sendgrid.net');
  const [smtpPort, setSmtpPort] = useState('587');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Email Templates state
  const [welcomeSubject, setWelcomeSubject] = useState('Welcome to Comzilo');
  const [welcomeBody, setWelcomeBody] = useState('Dear {{sellerName}}, welcome to our platform.');
  const [approvalSubject, setApprovalSubject] = useState('Application Approved');
  const [approvalBody, setApprovalBody] = useState('Dear {{sellerName}}, your application for {{businessName}} has been approved.');
  const [rejectionSubject, setRejectionSubject] = useState('Application Status Update');
  const [rejectionBody, setRejectionBody] = useState('Dear {{sellerName}}, we regret to inform you that your application was rejected.');
  const [resetSubject, setResetSubject] = useState('Password Reset Request');
  const [resetBody, setResetBody] = useState('Dear {{sellerName}}, your temporary password is {{temporaryPassword}}.');

  const { data: settingsData, isLoading: loadingSettings } = useGetSystemSettingsQuery();
  const { data: templatesData, isLoading: loadingTemplates } = useGetEmailTemplatesQuery();

  const [saveSettings] = useSaveSystemSettingsMutation();
  const [saveTemplate] = useSaveEmailTemplateMutation();

  // Populate loaded settings
  useEffect(() => {
    if (settingsData?.data) {
      settingsData.data.forEach((s: any) => {
        if (s.settingKey === 'app_name') setAppName(s.settingValue);
        if (s.settingKey === 'admin_email') setAdminEmail(s.settingValue);
        if (s.settingKey === 'company_name') setCompanyName(s.settingValue);
        if (s.settingKey === 'company_address') setCompanyAddress(s.settingValue);
        if (s.settingKey === 'smtp_host') setSmtpHost(s.settingValue);
        if (s.settingKey === 'smtp_port') setSmtpPort(s.settingValue);
        if (s.settingKey === 'maintenance_mode') setMaintenanceMode(s.settingValue === 'true' || s.settingValue === true);
      });
    }
  }, [settingsData]);

  // Populate loaded templates
  useEffect(() => {
    if (templatesData?.data) {
      templatesData.data.forEach((t: any) => {
        if (t.code === 'welcome_email') {
          setWelcomeSubject(t.subject || '');
          setWelcomeBody(t.body || '');
        }
        if (t.code === 'seller_approval') {
          setApprovalSubject(t.subject || '');
          setApprovalBody(t.body || '');
        }
        if (t.code === 'seller_rejection') {
          setRejectionSubject(t.subject || '');
          setRejectionBody(t.body || '');
        }
        if (t.code === 'password_reset') {
          setResetSubject(t.subject || '');
          setResetBody(t.body || '');
        }
      });
    }
  }, [templatesData]);

  const handleSaveSettings = async () => {
    try {
      await saveSettings([
        { settingKey: 'app_name', settingValue: appName, category: 'general' },
        { settingKey: 'admin_email', settingValue: adminEmail, category: 'general' },
        { settingKey: 'company_name', settingValue: companyName, category: 'company' },
        { settingKey: 'company_address', settingValue: companyAddress, category: 'company' },
        { settingKey: 'smtp_host', settingValue: smtpHost, category: 'smtp' },
        { settingKey: 'smtp_port', settingValue: smtpPort, category: 'smtp' },
        { settingKey: 'maintenance_mode', settingValue: String(maintenanceMode), category: 'maintenance' },
      ]).unwrap();
      toast.success('System settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleSaveTemplates = async () => {
    try {
      await saveTemplate({ code: 'welcome_email', name: 'Welcome Email', subject: welcomeSubject, body: welcomeBody }).unwrap();
      await saveTemplate({ code: 'seller_approval', name: 'Seller Approval Email', subject: approvalSubject, body: approvalBody }).unwrap();
      await saveTemplate({ code: 'seller_rejection', name: 'Seller Rejection Email', subject: rejectionSubject, body: rejectionBody }).unwrap();
      await saveTemplate({ code: 'password_reset', name: 'Password Reset Notification', subject: resetSubject, body: resetBody }).unwrap();
      toast.success('Email templates updated successfully');
    } catch {
      toast.error('Failed to save email templates');
    }
  };

  if (loadingSettings || loadingTemplates) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  return (
    <PageContainer
      title="System Settings & Infrastructure"
      subtitle="Manage global system variables, SMTP options, security modules, and email templates"
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, nv) => setActiveTab(nv)}>
          <Tab label="System Settings" />
          <Tab label="Email Template Configuration" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            General & Infrastructure Settings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField label="SaaS Platform Name" fullWidth value={appName} onChange={(e) => setAppName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Super Admin Email" fullWidth value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Company Name" fullWidth value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Company Address" fullWidth value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="SMTP Host" fullWidth value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="SMTP Port" fullWidth value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />}
                label="Enable System Maintenance Mode (locks public forms)"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSaveSettings} sx={{ fontWeight: 700 }}>
              Save Settings
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Email Notifications Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Customize system notification emails. Use placeholders: {"{{sellerName}}"}, {"{{businessName}}"}, {"{{temporaryPassword}}"}
          </Typography>

          <Grid container spacing={4}>
            {/* Welcome Email */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Welcome Email Template</Typography>
              <TextField label="Subject" fullWidth value={welcomeSubject} onChange={(e) => setWelcomeSubject(e.target.value)} sx={{ mb: 2 }} />
              <TextField label="Body Content" fullWidth multiline rows={4} value={welcomeBody} onChange={(e) => setWelcomeBody(e.target.value)} />
            </Grid>

            {/* Seller Approval */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Seller Approval Welcome Template</Typography>
              <TextField label="Subject" fullWidth value={approvalSubject} onChange={(e) => setApprovalSubject(e.target.value)} sx={{ mb: 2 }} />
              <TextField label="Body Content" fullWidth multiline rows={4} value={approvalBody} onChange={(e) => setApprovalBody(e.target.value)} />
            </Grid>

            {/* Seller Rejection */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Seller Rejection Template</Typography>
              <TextField label="Subject" fullWidth value={rejectionSubject} onChange={(e) => setRejectionSubject(e.target.value)} sx={{ mb: 2 }} />
              <TextField label="Body Content" fullWidth multiline rows={4} value={rejectionBody} onChange={(e) => setRejectionBody(e.target.value)} />
            </Grid>

            {/* Password Reset */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>Password Reset Template</Typography>
              <TextField label="Subject" fullWidth value={resetSubject} onChange={(e) => setResetSubject(e.target.value)} sx={{ mb: 2 }} />
              <TextField label="Body Content" fullWidth multiline rows={4} value={resetBody} onChange={(e) => setResetBody(e.target.value)} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSaveTemplates} sx={{ fontWeight: 700 }}>
              Update All Templates
            </Button>
          </Box>
        </Paper>
      )}
    </PageContainer>
  );
};
