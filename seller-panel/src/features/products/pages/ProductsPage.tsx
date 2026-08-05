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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

  // Product Images Drag & Drop Upload State
  const [uploadedImages, setUploadedImages] = useState<
    { id?: string; file?: File; url: string; previewUrl: string; isPrimary: boolean }[]
  >([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic Category & Attribute State
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [attributeGroups, setAttributeGroups] = useState<any[]>([]);
  const [selectedAttrValues, setSelectedAttrValues] = useState<{ [groupId: number]: string[] }>({});

  // Variant Matrix State
  const [variantsList, setVariantsList] = useState<
    { id?: number; sku: string; barcode: string; price: number; compareAtPrice: number; stockQuantity: number; status: string; attributes?: any[]; comboText?: string }[]
  >([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/catalog/categories');
      const tree = res.data?.data || [];
      const flat: any[] = [];
      const flatten = (nodes: any[], depth = 0) => {
        if (!Array.isArray(nodes)) return;
        nodes.forEach((node) => {
          flat.push({
            id: node.id,
            name: node.name,
            displayName: (depth > 0 ? '— '.repeat(depth) : '') + node.name,
            parentId: node.parentId,
          });
          if (node.children && node.children.length > 0) {
            flatten(node.children, depth + 1);
          }
        });
      };
      if (Array.isArray(tree)) {
        flatten(tree);
        setCategoriesList(flat);
      } else if (tree.rows && Array.isArray(tree.rows)) {
        setCategoriesList(tree.rows);
      }
    } catch {
      console.warn('Failed to load categories list');
    }
  };

  const handleCategoryChange = async (catId: string) => {
    setSelectedCategoryId(catId);
    if (!catId) {
      setAttributeGroups([]);
      setSelectedAttrValues({});
      return;
    }

    try {
      // 1. Fetch mapped category attributes
      const mappedRes = await axiosInstance.get(`/admin/attributes/category-attributes?categoryId=${catId}`);
      let groupsData = mappedRes.data?.data || [];

      // 2. Fallback to all groups if no specific mapping exists
      if (!groupsData || groupsData.length === 0) {
        const allGroupsRes = await axiosInstance.get('/admin/attributes/groups');
        groupsData = allGroupsRes.data?.data || [];
      }

      // 3. Ensure values are loaded for each group
      const enrichedGroups = await Promise.all(
        groupsData.map(async (g: any) => {
          const groupObj = g.group || g;
          if (!groupObj.values || groupObj.values.length === 0) {
            try {
              const valsRes = await axiosInstance.get(`/admin/attributes/groups/${groupObj.id}/values`);
              return { ...groupObj, values: valsRes.data?.data || [] };
            } catch {
              return groupObj;
            }
          }
          return groupObj;
        })
      );

      setAttributeGroups(enrichedGroups);
    } catch {
      toast.error('Failed to load category attributes');
    }
  };

  const handleToggleAttrValue = (groupId: number, valueStr: string) => {
    setSelectedAttrValues((prev) => {
      const currentVals = prev[groupId] || [];
      const updated = currentVals.includes(valueStr)
        ? currentVals.filter((v) => v !== valueStr)
        : [...currentVals, valueStr];
      return { ...prev, [groupId]: updated };
    });
  };

  const handleGenerateCartesianVariants = () => {
    const activeGroups = attributeGroups.filter(
      (g) => selectedAttrValues[g.id] && selectedAttrValues[g.id].length > 0
    );

    if (activeGroups.length === 0) {
      toast.error('Select at least one value for an attribute group (e.g. Size or Color)');
      return;
    }

    const cartesian = (args: any[][]): any[][] =>
      args.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

    const groupValueArrays = activeGroups.map((g) =>
      selectedAttrValues[g.id].map((valStr) => ({
        groupId: g.id,
        groupName: g.name,
        value: valStr,
      }))
    );

    let combinations: any[][] = [];
    if (groupValueArrays.length === 1) {
      combinations = groupValueArrays[0].map((item) => [item]);
    } else {
      combinations = cartesian(groupValueArrays);
    }

    const generated = combinations.map((combo, idx) => {
      const comboArray = Array.isArray(combo) ? combo : [combo];
      const skuSuffix = comboArray.map((c) => c.value.replace(/\s+/g, '-').toUpperCase()).join('-');
      const sku = `${productForm.sku || 'SKU'}-${skuSuffix}`;

      const variantAttrs = comboArray.map((c) => ({
        attributeName: c.groupName,
        attributeValue: c.value,
      }));

      return {
        sku,
        barcode: `BAR-${Date.now().toString().slice(-6)}-${idx + 1}`,
        price: Number(productForm.price) || 0,
        compareAtPrice: Number(productForm.price) ? Math.round(Number(productForm.price) * 1.2 * 100) / 100 : 0,
        stockQuantity: 10,
        status: 'active',
        attributes: variantAttrs,
        comboText: comboArray.map((c) => `${c.groupName}: ${c.value}`).join(' / '),
      };
    });

    setVariantsList(generated);
    toast.success(`Generated ${generated.length} variant combinations!`);
  };

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
    fetchCategories();
    setTypeSelectionModalOpen(true);
  };

  const handleSelectProductType = (typeObj: ProductTypeMaster) => {
    fetchCategories();
    setSelectedType(typeObj);
    setTypeSelectionModalOpen(false);
    setUploadedImages([]);
    setImageUrlInput('');
    
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

  // Image Drag & Drop Handlers
  const handleFilesAdded = (files: FileList | File[]) => {
    const newItems: { file: File; url: string; previewUrl: string; isPrimary: boolean }[] = [];
    Array.from(files).forEach((file, index) => {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type.toLowerCase())) {
        toast.error(`Invalid file format for ${file.name}. Allowed: JPG, PNG, WEBP`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 5MB limit.`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      newItems.push({
        file,
        url: previewUrl,
        previewUrl,
        isPrimary: uploadedImages.length === 0 && index === 0,
      });
    });

    if (newItems.length > 0) {
      setUploadedImages((prev) => [...prev, ...newItems]);
      toast.success(`${newItems.length} image(s) added to upload gallery.`);
    }
  };

  const handleAddUrlImage = () => {
    if (!imageUrlInput.trim()) return;
    const isPrimary = uploadedImages.length === 0;
    setUploadedImages((prev) => [
      ...prev,
      {
        url: imageUrlInput.trim(),
        previewUrl: imageUrlInput.trim(),
        isPrimary,
      },
    ]);
    setImageUrlInput('');
    toast.success('Image URL added.');
  };

  const setPrimaryImage = (index: number) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
    toast.success('Set as primary/featured image.');
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= uploadedImages.length) return;
    setUploadedImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
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

    const imagePayload = uploadedImages
      .filter((img) => img.url && img.url.trim().length > 0)
      .map((img, idx) => ({
        imageUrl: img.url,
        isPrimary: img.isPrimary || idx === 0,
        displayOrder: idx,
      }));

    const payload = {
      name: productForm.name,
      sku: productForm.sku,
      price: parseFloat(productForm.price) || 0,
      costPrice: parseFloat(productForm.costPrice) || 0,
      productType: productForm.productType,
      categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
      status: 'published',
      visibility: 'public',
      description: productForm.description,
      seoTitle: productForm.metaTitle || productForm.name,
      seoDescription: productForm.metaDescription,
      images: imagePayload,
      variants: productForm.productType === 'variable' ? variantsList : undefined,
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
      const res = await axiosInstance.post('/products', payload);
      const createdProd = res.data?.data;

      // Upload actual file blobs if any files were attached via drag & drop
      if (createdProd?.id) {
        for (let i = 0; i < uploadedImages.length; i++) {
          const imgItem = uploadedImages[i];
          if (imgItem.file) {
            const formData = new FormData();
            formData.append('image', imgItem.file);
            formData.append('isPrimary', String(imgItem.isPrimary));
            formData.append('displayOrder', String(i));
            try {
              await axiosInstance.post(`/products/${createdProd.id}/images`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
            } catch {
              console.warn('Failed to upload file blob for image item', i);
            }
          }
        }
      }

      toast.success(`${selectedType?.name || 'Product'} created successfully!`);
      setFormModalOpen(false);
      refetch();
    } catch (err: any) {
      const apiErrMsg = err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || err?.message || 'Failed to create product';
      toast.error(apiErrMsg);
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                fullWidth
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="SKU Code"
                fullWidth
                required
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Category"
                fullWidth
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                helperText="Select to load dynamic attributes"
              >
                <MenuItem value="">-- Select Category --</MenuItem>
                {categoriesList.map((cat) => (
                  <MenuItem key={cat.id} value={String(cat.id)}>
                    {cat.displayName || cat.name}
                  </MenuItem>
                ))}
              </TextField>
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

            {/* PRODUCT IMAGES MANAGEMENT SECTION (DRAG & DROP) */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="PRODUCT IMAGES & GALLERY (DRAG & DROP)" size="small" color="primary" icon={<Upload size={14} />} />
              </Divider>
            </Grid>

            <Grid item xs={12}>
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFilesAdded(e.dataTransfer.files);
                  }
                }}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragging ? '#0284C7' : '#CBD5E1',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: isDragging ? '#F0F9FF' : '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#0284C7',
                    bgcolor: '#F0F9FF',
                  },
                }}
                component="label"
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesAdded(e.target.files);
                    }
                  }}
                />
                <Upload size={36} color="#0284C7" style={{ marginBottom: 8 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  Drag & Drop Product Images Here
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Supports JPG, JPEG, PNG, WEBP up to 5MB per file. Multi-file selection enabled.
                </Typography>
                <Button size="small" variant="outlined" sx={{ mt: 1.5, fontWeight: 700 }}>
                  Browse Local Files
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Or enter Image URL (e.g. https://images.unsplash.com/photo-...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
                <Button variant="contained" size="small" onClick={handleAddUrlImage} sx={{ whitespace: 'nowrap', fontWeight: 700 }}>
                  Add Image URL
                </Button>
              </Box>
            </Grid>

            {/* PREVIEW GALLERY GRID */}
            {uploadedImages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Uploaded Gallery Images ({uploadedImages.length}):
                </Typography>
                <Grid container spacing={2}>
                  {uploadedImages.map((img, idx) => (
                    <Grid item xs={6} sm={4} md={3} key={idx}>
                      <Card variant="outlined" sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', borderColor: img.isPrimary ? '#0284C7' : '#E2E8F0', borderWidth: img.isPrimary ? 2 : 1 }}>
                        <Box sx={{ position: 'relative', height: 120 }}>
                          <img
                            src={img.previewUrl}
                            alt={`Preview ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {img.isPrimary && (
                            <Chip
                              label="FEATURED"
                              color="primary"
                              size="small"
                              sx={{ position: 'absolute', top: 6, left: 6, fontWeight: 800, fontSize: 10, height: 20 }}
                            />
                          )}
                        </Box>
                        <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F8FAFC' }}>
                          <Button
                            size="small"
                            onClick={() => setPrimaryImage(idx)}
                            disabled={img.isPrimary}
                            sx={{ fontSize: 11, fontWeight: 700, p: 0.5, minWidth: 0 }}
                          >
                            {img.isPrimary ? 'Primary' : 'Make Primary'}
                          </Button>
                          <IconButton size="small" color="error" onClick={() => removeImage(idx)}>
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

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

            {/* SELLER VARIANT BUILDER MATRIX (VARIABLE PRODUCT TYPE) */}
            {selectedType?.code === 'variable' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="DYNAMIC PRODUCT VARIANT BUILDER (CATEGORICAL ATTRIBUTE MATRIX)" color="secondary" size="small" icon={<Layers size={14} />} />
                  </Divider>
                </Grid>

                {/* DYNAMIC CATEGORY ATTRIBUTE SELECTION CONTROLS */}
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, bgcolor: '#F8FAFC', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: '#0F172A' }}>
                      Category Attribute Options & Values:
                    </Typography>
                    {attributeGroups.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        {selectedCategoryId
                          ? 'No attribute groups mapped to this category. Go to Admin -> Category Attributes to link groups.'
                          : 'Select a Category above to load mapped attribute groups (e.g. Size, Color, RAM, Storage).'}
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {attributeGroups.map((group) => {
                          const selectedVals = selectedAttrValues[group.id] || [];
                          const groupValuesList = group.values || [];
                          return (
                            <Box key={group.id} sx={{ bgcolor: '#FFFFFF', p: 2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
                                {group.name} ({selectedVals.length} selected):
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {groupValuesList.length === 0 ? (
                                  <Typography variant="caption" color="text.secondary">No preset values configured for group</Typography>
                                ) : (
                                  groupValuesList.map((valObj: any) => {
                                    const valStr = typeof valObj === 'string' ? valObj : valObj.value;
                                    const isSelected = selectedVals.includes(valStr);
                                    return (
                                      <Chip
                                        key={valObj.id || valStr}
                                        label={valStr}
                                        color={isSelected ? 'primary' : 'default'}
                                        variant={isSelected ? 'filled' : 'outlined'}
                                        onClick={() => handleToggleAttrValue(group.id, valStr)}
                                        sx={{ fontWeight: 700, cursor: 'pointer' }}
                                      />
                                    );
                                  })
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<Zap size={16} />}
                            onClick={handleGenerateCartesianVariants}
                            sx={{ fontWeight: 800, textTransform: 'none', borderRadius: 2 }}
                          >
                            Generate Variant Combinations
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Generated Product Variant Matrix ({variantsList.length})
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      startIcon={<Plus size={16} />}
                      onClick={() => {
                        const newSku = `${productForm.sku || 'SKU'}-VAR-${variantsList.length + 1}`;
                        setVariantsList([
                          ...variantsList,
                          {
                            sku: newSku,
                            barcode: `BAR-${Date.now().toString().slice(-6)}`,
                            price: Number(productForm.price) || 0,
                            compareAtPrice: 0,
                            stockQuantity: 10,
                            status: 'active',
                          },
                        ]);
                      }}
                      sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                      Add Manual Variant Row
                    </Button>
                  </Box>

                  {variantsList.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No variants generated yet. Select category attribute options above and click <strong>Generate Variant Combinations</strong>.
                      </Typography>
                    </Paper>
                  ) : (
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 800 }}>Variant SKU</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Attribute Options</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Retail Price (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Compare Price (₹)</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Stock Qty</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {variantsList.map((v, idx) => (
                            <TableRow key={idx} hover>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={v.sku}
                                  onChange={(e) => {
                                    const updated = [...variantsList];
                                    updated[idx].sku = e.target.value;
                                    setVariantsList(updated);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                {v.comboText ? (
                                  <Chip label={v.comboText} size="small" color="info" sx={{ fontWeight: 700 }} />
                                ) : (
                                  <Typography variant="caption" color="text.secondary">Default</Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => {
                                    const updated = [...variantsList];
                                    updated[idx].price = Number(e.target.value);
                                    setVariantsList(updated);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={v.compareAtPrice}
                                  onChange={(e) => {
                                    const updated = [...variantsList];
                                    updated[idx].compareAtPrice = Number(e.target.value);
                                    setVariantsList(updated);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={v.stockQuantity}
                                  onChange={(e) => {
                                    const updated = [...variantsList];
                                    updated[idx].stockQuantity = Number(e.target.value);
                                    setVariantsList(updated);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip label={v.status.toUpperCase()} size="small" color={v.status === 'active' ? 'success' : 'default'} sx={{ fontWeight: 700 }} />
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {
                                    const updated = variantsList.filter((_, i) => i !== idx);
                                    setVariantsList(updated);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
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
