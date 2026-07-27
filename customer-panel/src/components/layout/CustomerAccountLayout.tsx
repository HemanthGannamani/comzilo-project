import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { CustomerSidebar } from '../../components/layout/CustomerSidebar';

interface CustomerAccountLayoutProps {
  children: React.ReactNode;
}

export const CustomerAccountLayout: React.FC<CustomerAccountLayoutProps> = ({ children }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        {/* Amazon/Shopify-style Sticky Customer Sidebar */}
        <Grid item xs={12} md={3.5} lg={3}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 90 } }}>
            <CustomerSidebar />
          </Box>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={12} md={8.5} lg={9}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};
