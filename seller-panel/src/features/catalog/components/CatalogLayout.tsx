import React from 'react';
import { Box, Paper, Tabs, Tab, Container } from '@mui/material';
import { FolderTree, Award, Layers, Sliders, Tag as TagIcon } from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

export const CatalogLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/catalog/brands')) return 1;
    if (path.includes('/catalog/collections')) return 2;
    if (path.includes('/catalog/attributes')) return 3;
    if (path.includes('/catalog/tags')) return 4;
    return 0; // Default: Categories
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/catalog/categories');
        break;
      case 1:
        navigate('/catalog/brands');
        break;
      case 2:
        navigate('/catalog/collections');
        break;
      case 3:
        navigate('/catalog/attributes');
        break;
      case 4:
        navigate('/catalog/tags');
        break;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Paper elevation={0} sx={{ borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF', px: 3, pt: 2 }}>
        <Tabs value={getActiveTab()} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab icon={<FolderTree size={18} />} iconPosition="start" label="Categories" sx={{ fontWeight: 700 }} />
          <Tab icon={<Award size={18} />} iconPosition="start" label="Brands" sx={{ fontWeight: 700 }} />
          <Tab icon={<Layers size={18} />} iconPosition="start" label="Collections" sx={{ fontWeight: 700 }} />
          <Tab icon={<Sliders size={18} />} iconPosition="start" label="Attributes & Swatches" sx={{ fontWeight: 700 }} />
          <Tab icon={<TagIcon size={18} />} iconPosition="start" label="Product Tags" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
};
