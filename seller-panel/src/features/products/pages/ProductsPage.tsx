import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardActionArea,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Plus,
  Search,
  Trash2,
  RotateCcw,
  Package,
  Layers,
  Zap,
  DownloadCloud,
  FileCode,
  Printer,
  Boxes,
  Clock,
  RefreshCw,
  Gift,
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Download,
  Filter,
} from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useRestoreProductMutation,
} from '../../../api/endpoints/catalogApi';
import { usePermission } from '../../../hooks/usePermission';
import { formatCurrency } from '../../../utils/formatters';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../api/axiosInstance';

interface ProductTypeMaster {
  code: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  supportsInventory: boolean;
  supportsShipping: boolean;
  supportsVariants: boolean;
  supportsDownloads: boolean;
  supportsVirtual: boolean;
}

const PRODUCT_TYPE_CARDS: ProductTypeMaster[] = [
  {
    code: 'physical',
    name: 'Physical Product',
    description: 'Tangible item requiring warehouse inventory tracking, weight, dimensions, and shipping',
    icon: <Package size={28} color="#0284C7" />,
    supportsInventory: true,
    supportsShipping: true,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: false,
  },
  {
    code: 'variable',
    name: 'Variable Product',
    description: 'Product with configurable attribute options (e.g. Size, Color, Material) and variant matrix',
    icon: <Layers size={28} color="#8B5CF6" />,
    supportsInventory: true,
    supportsShipping: true,
    supportsVariants: true,
    supportsDownloads: false,
    supportsVirtual: false,
  },
  {
    code: 'virtual',
    name: 'Virtual Product',
    description: 'Non-tangible service or access pass with instant activation, requiring no inventory or shipping',
    icon: <Zap size={28} color="#F59E0B" />,
    supportsInventory: false,
    supportsShipping: false,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: true,
  },
  {
    code: 'digital',
    name: 'Digital Product',
    description: 'File upload, download limits, download expiration days, and license key generation',
    icon: <DownloadCloud size={28} color="#10B981" />,
    supportsInventory: false,
    supportsShipping: false,
    supportsVariants: false,
    supportsDownloads: true,
    supportsVirtual: true,
  },
  {
    code: 'downloadable',
    name: 'Downloadable Product',
    description: 'E-books, software installers, media attachments, and digital access links',
    icon: <FileCode size={28} color="#06B6D4" />,
    supportsInventory: false,
    supportsShipping: false,
    supportsVariants: false,
    supportsDownloads: true,
    supportsVirtual: true,
  },
  {
    code: 'print_on_demand',
    name: 'Print On Demand',
    description: 'Custom print template design area, print provider routing, and automatic shipping',
    icon: <Printer size={28} color="#EC4899" />,
    supportsInventory: true,
    supportsShipping: true,
    supportsVariants: true,
    supportsDownloads: false,
    supportsVirtual: false,
  },
  {
    code: 'bundle',
    name: 'Bundle Product',
    description: 'Package combining multiple child products into a single SKU with bundle pricing rules',
    icon: <Boxes size={28} color="#6366F1" />,
    supportsInventory: true,
    supportsShipping: true,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: false,
  },
  {
    code: 'service',
    name: 'Service Product',
    description: 'Time-based appointments, service area pincodes, duration, and booking calendar',
    icon: <Clock size={28} color="#14B8A6" />,
    supportsInventory: false,
    supportsShipping: false,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: true,
  },
  {
    code: 'subscription',
    name: 'Subscription Product',
    description: 'Recurring monthly or annual billing cycle, free trial period, and renewal pricing',
    icon: <RefreshCw size={28} color="#3B82F6" />,
    supportsInventory: false,
    supportsShipping: false,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: true,
  },
  {
    code: 'gift_card',
    name: 'Gift Card',
    description: 'Digital voucher with fixed amount options, custom amount ranges, and claim code expiry',
    icon: <Gift size={28} color="#F43F5E" />,
    supportsInventory: false,
    supportsShipping: false,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: true,
  },
  {
    code: 'rental',
    name: 'Rental Product',
    description: 'Daily/hourly rental rate, security deposit hold, and interactive availability calendar',
    icon: <CalendarDays size={28} color="#64748B" />,
    supportsInventory: true,
    supportsShipping: true,
    supportsVariants: false,
    supportsDownloads: false,
    supportsVirtual: false,
  },
];

export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [page, setPage] = useState(0);
  
  // Selection Screen & Dynamic Form Modal States
  const [typeSelectionModalOpen, setTypeSelectionModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ProductTypeMaster | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Dynamic Product Form Payload State
  const [productForm, setProductForm] = useState<any>({
    name: '',
    sku: '',
    price: '',
    costPrice: '',
    status: 'published',
    productType: 'physical',
    description: '',
    // Physical / Variable
    warehouseId: '1',
    stockQuantity: 100,
    weight: 1.5,
    length: 10,
    width: 10,
    height: 10,
    barcode: '',
    // Digital
    fileUrl: '',
    downloadLimit: 5,
    downloadExpiryDays: 30,
    licenseKeyPattern: 'KEY-XXXX-YYYY',
    // Service
    durationMinutes: 60,
    serviceAreaPincode: '500001',
    // Subscription
    billingCycle: 'monthly',
    trialDays: 14,
    renewalPrice: '',
    // Rental
    depositAmount: 500,
    rentalRatePerDay: 100,
    // Gift Card
    fixedAmounts: '500, 1000, 2000, 5000',
    // SEO
    metaTitle: '',
    metaDescription: '',
    slug: '',
  });

  const canCreate = usePermission('product.create');
  const canDelete = usePermission('product.delete');

  const { data, isLoading, refetch } = useGetProductsQuery({
    page: page + 1,
    limit: 20,
    search,
    types: selectedTypeFilter !== 'all' ? selectedTypeFilter : undefined,
  });
  const [deleteProduct] = useDeleteProductMutation();
  const [restoreProduct] = useRestoreProductMutation();

  const handleOpenTypeSelection = () => {
    setTypeSelectionModalOpen(true);
  };

  const handleSelectProductType = (typeObj: ProductTypeMaster) => {
    setSelectedType(typeObj);
    setTypeSelectionModalOpen(false);
    
    // Auto-generate SKU & Defaults for selected type
    const skuPrefix = typeObj.code.slice(0, 3).toUpperCase();
    setProductForm({
      ...productForm,
      productType: typeObj.code,
      name: '',
      sku: `${skuPrefix}-${Date.now().toString().slice(-6)}`,
      price: '199',
      costPrice: '100',
      renewalPrice: '199',
      metaTitle: '',
      metaDescription: '',
    });
    setFormModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!productForm.sku.trim()) {
      toast.error('SKU Code is required');
      return;
    }

    const payload = {
      name: productForm.name,
      sku: productForm.sku,
      price: parseFloat(productForm.price) || 0,
      costPrice: parseFloat(productForm.costPrice) || 0,
      productType: productForm.productType,
      status: productForm.status,
      description: productForm.description,
      seoTitle: productForm.metaTitle || productForm.name,
      seoDescription: productForm.metaDescription,
      dynamicAttributes: {
        weight: productForm.weight,
        dimensions: `${productForm.length}x${productForm.width}x${productForm.height} cm`,
        fileUrl: productForm.fileUrl,
        downloadLimit: productForm.downloadLimit,
        billingCycle: productForm.billingCycle,
        trialDays: productForm.trialDays,
        renewalPrice: productForm.renewalPrice,
        depositAmount: productForm.depositAmount,
        rentalRatePerDay: productForm.rentalRatePerDay,
        serviceDurationMinutes: productForm.durationMinutes,
      },
    };

    try {
      await axiosInstance.post('/products', payload);
      toast.success(`${selectedType?.name || 'Product'} created successfully!`);
      setFormModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.data?.message || 'Failed to create product');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteProduct(selectedId).unwrap();
      toast.success('Product soft-deleted successfully');
      setConfirmOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete product');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct(id).unwrap();
      toast.success('Product restored successfully');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to restore product');
    }
  };

  const handleExportProductsCsv = () => {
    const rawRows = data?.data?.products || data?.data || [];
    if (rawRows.length === 0) {
      toast.error('No products available to export');
      return;
    }
    let csv = 'ID,SKU,Product Name,Type,Price (INR),Status,Created Date\n';
    rawRows.forEach((p: any) => {
      csv += `"${p.id}","${p.sku || ''}","${p.name}","${p.productType || p.product_type || 'physical'}","${p.price}","${p.status}","${p.createdAt || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Catalog_Products_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('Product catalog exported to CSV successfully');
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 140 },
    { field: 'name', headerName: 'Product Name', flex: 1, minWidth: 200 },
    {
      field: 'productType',
      headerName: 'Product Type',
      width: 160,
      renderCell: (params) => {
        const typeCode = params.row.productType || params.row.product_type || 'physical';
        const typeMatch = PRODUCT_TYPE_CARDS.find((t) => t.code === typeCode);
        return (
          <Chip
            label={typeMatch?.name || typeCode.toUpperCase()}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
    {
      field: 'price',
      headerName: 'Retail Price',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0F172A' }}>
          ₹{Number(params.value || 0).toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={String(params.value || 'published').toUpperCase()}
          color={params.value === 'draft' ? 'warning' : 'success'}
          size="small"
          sx={{ fontWeight: 700 }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canDelete && (
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setSelectedId(params.row.id);
                setConfirmOpen(true);
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          )}
          {params.row.deletedAt && (
            <IconButton size="small" color="primary" onClick={() => handleRestore(params.row.id)}>
              <RotateCcw size={18} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const rows = data?.data?.products || data?.data || [];
  const totalCount = data?.data?.total || rows.length;

  return (
    <PageContainer
      title="Enterprise Product Catalog Master"
      subtitle="Manage database-driven product types, dynamic forms, digital files, subscriptions, rentals & pricing"
      actionText={canCreate ? 'Add Product' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={handleOpenTypeSelection}
    >
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search products by name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280 }}
          />

          <FormControl size="small" sx={{ width: 220 }}>
            <InputLabel>Filter by Product Type</InputLabel>
            <Select
              value={selectedTypeFilter}
              label="Filter by Product Type"
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All 11 Product Types</MenuItem>
              {PRODUCT_TYPE_CARDS.map((t) => (
                <MenuItem key={t.code} value={t.code}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button variant="outlined" startIcon={<Download size={18} />} onClick={handleExportProductsCsv} sx={{ fontWeight: 700 }}>
          Export CSV
        </Button>
      </Box>

      {rows.length === 0 && !isLoading ? (
        <Paper sx={{ textAlign: 'center', py: 8, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
          <Package size={56} color="#94A3B8" />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
            No Products Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {search || selectedTypeFilter !== 'all'
              ? 'No products match your current search/filter. Try clearing filters.'
              : 'Click Add Product to select a product type and populate your live MySQL product catalog.'}
          </Typography>
          {canCreate && (
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenTypeSelection} sx={{ fontWeight: 700 }}>
              Add Product
            </Button>
          )}
        </Paper>
      ) : (
        <DataTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          rowCount={totalCount}
          page={page}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {/* STEP 1: PRODUCT TYPE SELECTION MODAL SCREEN */}
      <Dialog open={typeSelectionModalOpen} onClose={() => setTypeSelectionModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Select Product Type</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select the enterprise product type for your new item. The product editor form will dynamically render specific fields and capabilities.
          </Typography>

          <Grid container spacing={2}>
            {PRODUCT_TYPE_CARDS.map((typeObj) => (
              <Grid item xs={12} sm={6} md={4} key={typeObj.code}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    borderColor: '#E2E8F0',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#0284C7',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardActionArea sx={{ p: 2.5, height: '100%' }} onClick={() => handleSelectProductType(typeObj)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                      {typeObj.icon}
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {typeObj.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, lineHeight: 1.5 }}>
                      {typeObj.description}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setTypeSelectionModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* STEP 2: DYNAMIC PRODUCT FORM MODAL SCREEN */}
      <Dialog open={formModalOpen} onClose={() => setFormModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {selectedType?.icon}
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Create {selectedType?.name}</Typography>
          </Box>
          <Chip label={selectedType?.code.toUpperCase()} color="primary" size="small" sx={{ fontWeight: 800 }} />
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ pt: 1 }}>
            {/* COMMON FIELDS */}
            <Grid item xs={12} sm={8}>
              <TextField
                label="Product Name"
                fullWidth
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="SKU Code"
                fullWidth
                required
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Retail Price (₹)"
                type="number"
                fullWidth
                required
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cost Price (₹)"
                type="number"
                fullWidth
                value={productForm.costPrice}
                onChange={(e) => setProductForm({ ...productForm, costPrice: e.target.value })}
              />
            </Grid>

            {/* PHYSICAL / VARIABLE / RENTAL SPECIFIC FIELDS */}
            {(selectedType?.supportsInventory || selectedType?.code === 'physical' || selectedType?.code === 'variable' || selectedType?.code === 'rental') && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Chip label="INVENTORY & SHIPPING SPECIFICATIONS" size="small" /></Divider>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Stock Quantity"
                    type="number"
                    fullWidth
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Weight (kg)"
                    type="number"
                    fullWidth
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Barcode (CODE128)"
                    fullWidth
                    placeholder="e.g. SKU-8849201"
                    value={productForm.barcode}
                    onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                  />
                </Grid>
              </>
            )}

            {/* DIGITAL / DOWNLOADABLE SPECIFIC FIELDS */}
            {(selectedType?.code === 'digital' || selectedType?.code === 'downloadable') && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Chip label="DIGITAL FILE & ACCESS RULES" size="small" color="success" /></Divider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Digital File Download URL"
                    fullWidth
                    placeholder="https://cdn.comzilo.com/files/software-installer.zip"
                    value={productForm.fileUrl}
                    onChange={(e) => setProductForm({ ...productForm, fileUrl: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Download Count Limit"
                    type="number"
                    fullWidth
                    value={productForm.downloadLimit}
                    onChange={(e) => setProductForm({ ...productForm, downloadLimit: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Download Expiry (Days)"
                    type="number"
                    fullWidth
                    value={productForm.downloadExpiryDays}
                    onChange={(e) => setProductForm({ ...productForm, downloadExpiryDays: Number(e.target.value) })}
                  />
                </Grid>
              </>
            )}

            {/* SUBSCRIPTION SPECIFIC FIELDS */}
            {selectedType?.code === 'subscription' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Chip label="SUBSCRIPTION & BILLING CYCLE" size="small" color="info" /></Divider>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Billing Cycle</InputLabel>
                    <Select
                      value={productForm.billingCycle}
                      label="Billing Cycle"
                      onChange={(e) => setProductForm({ ...productForm, billingCycle: e.target.value })}
                    >
                      <MenuItem value="monthly">Monthly Recurring</MenuItem>
                      <MenuItem value="annual">Annual Recurring</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Free Trial Period (Days)"
                    type="number"
                    fullWidth
                    value={productForm.trialDays}
                    onChange={(e) => setProductForm({ ...productForm, trialDays: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Recurring Renewal Price (₹)"
                    type="number"
                    fullWidth
                    value={productForm.renewalPrice}
                    onChange={(e) => setProductForm({ ...productForm, renewalPrice: e.target.value })}
                  />
                </Grid>
              </>
            )}

            {/* RENTAL SPECIFIC FIELDS */}
            {selectedType?.code === 'rental' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Chip label="RENTAL DEPOSIT & DAILY RATES" size="small" color="secondary" /></Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Security Deposit Amount (₹)"
                    type="number"
                    fullWidth
                    value={productForm.depositAmount}
                    onChange={(e) => setProductForm({ ...productForm, depositAmount: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rental Rate / Day (₹)"
                    type="number"
                    fullWidth
                    value={productForm.rentalRatePerDay}
                    onChange={(e) => setProductForm({ ...productForm, rentalRatePerDay: Number(e.target.value) })}
                  />
                </Grid>
              </>
            )}

            {/* SERVICE SPECIFIC FIELDS */}
            {selectedType?.code === 'service' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Chip label="SERVICE DURATION & BOOKING AREA" size="small" color="warning" /></Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Service Duration (Minutes)"
                    type="number"
                    fullWidth
                    value={productForm.durationMinutes}
                    onChange={(e) => setProductForm({ ...productForm, durationMinutes: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Serviced Pin Codes"
                    fullWidth
                    value={productForm.serviceAreaPincode}
                    onChange={(e) => setProductForm({ ...productForm, serviceAreaPincode: e.target.value })}
                  />
                </Grid>
              </>
            )}

            {/* SEO & DESCRIPTION */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}><Chip label="SEO & DESCRIPTION" size="small" /></Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Product Short Description"
                multiline
                rows={2}
                fullWidth
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Meta Title (SEO)"
                fullWidth
                value={productForm.metaTitle}
                onChange={(e) => setProductForm({ ...productForm, metaTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Meta Description (SEO)"
                fullWidth
                value={productForm.metaDescription}
                onChange={(e) => setProductForm({ ...productForm, metaDescription: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setFormModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProduct} sx={{ px: 3, fontWeight: 800 }}>
            Save & Publish Product
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Product"
        message="Are you sure you want to soft-delete this product?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
