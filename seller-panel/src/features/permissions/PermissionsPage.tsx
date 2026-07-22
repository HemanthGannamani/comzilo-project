import React, { useState } from 'react';
import { Box, TextField, Chip, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Search, ChevronDown, Key } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';

interface PermissionItem {
  code: string;
  description: string;
  module: string;
}

const ALL_PERMISSIONS: PermissionItem[] = [
  // Tenants & Stores
  { code: 'tenant.read', description: 'View organization tenants', module: 'Tenants & Stores' },
  { code: 'tenant.create', description: 'Create new tenant account', module: 'Tenants & Stores' },
  { code: 'tenant.delete', description: 'Soft-delete tenant', module: 'Tenants & Stores' },
  { code: 'store.read', description: 'View store locations', module: 'Tenants & Stores' },
  { code: 'store.create', description: 'Create store location', module: 'Tenants & Stores' },

  // Catalog
  { code: 'product.read', description: 'View catalog products', module: 'Product Catalog' },
  { code: 'product.create', description: 'Create catalog product', module: 'Product Catalog' },
  { code: 'product.update', description: 'Update product details', module: 'Product Catalog' },
  { code: 'category.read', description: 'View category taxonomy tree', module: 'Product Catalog' },
  { code: 'brand.read', description: 'View product brands', module: 'Product Catalog' },

  // Inventory
  { code: 'warehouse.read', description: 'View fulfillment warehouses', module: 'Inventory & Warehouses' },
  { code: 'inventory.read', description: 'View stock balances', module: 'Inventory & Warehouses' },
  { code: 'stock_transfer.create', description: 'Initiate inter-warehouse stock transfer', module: 'Inventory & Warehouses' },

  // Sales & POS
  { code: 'customer.read', description: 'View customer CRM profiles', module: 'Sales & Orders' },
  { code: 'order.read', description: 'View sales orders', module: 'Sales & Orders' },
  { code: 'pos.access', description: 'Access POS kiosk terminal', module: 'Point of Sale (POS)' },
  { code: 'pos.session.open', description: 'Open POS register session', module: 'Point of Sale (POS)' },
];

export const PermissionsPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = ALL_PERMISSIONS.filter(
    (p) => p.code.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  );

  const modules = Array.from(new Set(filtered.map((p) => p.module)));

  return (
    <PageContainer title="Permissions Directory" subtitle="Grouped list of system-wide RBAC permission codes">
      <Box sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search permissions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            },
          }}
          sx={{ maxWidth: 360 }}
        />
      </Box>

      {modules.map((mod) => (
        <Accordion key={mod} defaultExpanded sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ChevronDown size={20} />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Key size={18} color="#2563EB" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {mod}
              </Typography>
              <Chip label={`${filtered.filter((p) => p.module === mod).length} Permissions`} size="small" variant="outlined" />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {filtered
                .filter((p) => p.module === mod)
                .map((p) => (
                  <Paper key={p.code} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {p.code}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.description}
                      </Typography>
                    </Box>
                    <Chip label="Active" color="success" size="small" />
                  </Paper>
                ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </PageContainer>
  );
};
