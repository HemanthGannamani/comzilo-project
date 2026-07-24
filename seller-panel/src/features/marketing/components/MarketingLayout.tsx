import React from 'react';
import { Box, Paper, Tabs, Tab } from '@mui/material';
import {
  LayoutDashboard,
  Mail,
  Server,
  FileText,
  Send,
  MessageSquare,
  Ticket,
  ShoppingCart,
  Users,
  GitBranch,
  BarChart3,
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export const MarketingLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/marketing/email-providers')) return 1;
    if (path.includes('/marketing/email-templates')) return 2;
    if (path.includes('/marketing/campaigns')) return 3;
    if (path.includes('/marketing/whatsapp')) return 4;
    if (path.includes('/marketing/coupons')) return 5;
    if (path.includes('/marketing/abandoned-cart') || path.includes('/marketing/abandoned-carts')) return 6;
    if (path.includes('/marketing/customer-segments') || path.includes('/marketing/segments')) return 7;
    if (path.includes('/marketing/automation-rules')) return 8;
    if (path.includes('/marketing/analytics')) return 9;
    return 0; // Default: Dashboard
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/marketing/dashboard');
        break;
      case 1:
        navigate('/marketing/email-providers');
        break;
      case 2:
        navigate('/marketing/email-templates');
        break;
      case 3:
        navigate('/marketing/campaigns');
        break;
      case 4:
        navigate('/marketing/whatsapp');
        break;
      case 5:
        navigate('/marketing/coupons');
        break;
      case 6:
        navigate('/marketing/abandoned-carts');
        break;
      case 7:
        navigate('/marketing/segments');
        break;
      case 8:
        navigate('/marketing/automation-rules');
        break;
      case 9:
        navigate('/marketing/analytics');
        break;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Paper elevation={0} sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF', px: 3, pt: 2, overflowX: 'auto' }}>
        <Tabs value={getActiveTab()} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
          <Tab icon={<LayoutDashboard size={18} />} iconPosition="start" label="Dashboard" sx={{ fontWeight: 700 }} />
          <Tab icon={<Server size={18} />} iconPosition="start" label="Email Providers" sx={{ fontWeight: 700 }} />
          <Tab icon={<FileText size={18} />} iconPosition="start" label="Email Templates" sx={{ fontWeight: 700 }} />
          <Tab icon={<Send size={18} />} iconPosition="start" label="Campaigns" sx={{ fontWeight: 700 }} />
          <Tab icon={<MessageSquare size={18} />} iconPosition="start" label="WhatsApp" sx={{ fontWeight: 700 }} />
          <Tab icon={<Ticket size={18} />} iconPosition="start" label="Coupons" sx={{ fontWeight: 700 }} />
          <Tab icon={<ShoppingCart size={18} />} iconPosition="start" label="Abandoned Carts" sx={{ fontWeight: 700 }} />
          <Tab icon={<Users size={18} />} iconPosition="start" label="Segments" sx={{ fontWeight: 700 }} />
          <Tab icon={<GitBranch size={18} />} iconPosition="start" label="Automation Rules" sx={{ fontWeight: 700 }} />
          <Tab icon={<BarChart3 size={18} />} iconPosition="start" label="Analytics" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
