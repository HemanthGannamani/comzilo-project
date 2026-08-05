/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Pagination,
  Grid,
} from '@mui/material';
import { Search, DollarSign, Layers, Tag, Upload, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const BulkVariantManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceVal, setPriceVal] = useState(10);
  const [priceType, setPriceType] = useState<'percentage' | 'flat'>('percentage');
  const [priceDir, setPriceDir] = useState<'increase' | 'decrease'>('increase');

  useEffect(() => {
    fetchVariants();
  }, [page, search]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/seller/bulk-variants/search?page=${page}&limit=10&search=${encodeURIComponent(search)}`).then((r) => r.json());
      if (res.success) {
        setVariants(res.data.variants || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (e) {
      toast.error('Failed to load variants');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(variants.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkPriceUpdate = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select variants first.');
      return;
    }

    try {
      const res = await fetch('/api/v1/seller/bulk-variants/price-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantIds: selectedIds,
          adjustmentType: priceType,
          direction: priceDir,
          value: priceVal,
        }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success(res.message);
        setPriceDialogOpen(false);
        fetchVariants();
      }
    } catch (e) {
      toast.error('Bulk price update failed');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/v1/seller/bulk-variants/export', '_blank');
    toast.success('Exporting variant matrix to CSV...');
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Enterprise Bulk Variant Operations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Batch edit prices, inventory, SKUs, barcodes, and export variant matrix
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download size={18} />}
            onClick={handleExportCSV}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Export Matrix CSV
          </Button>
          <Button
            variant="contained"
            disabled={selectedIds.length === 0}
            startIcon={<DollarSign size={18} />}
            onClick={() => setPriceDialogOpen(true)}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
          >
            Bulk Update Price ({selectedIds.length})
          </Button>
        </Box>
      </Box>

      {/* Toolbar & Search */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0', display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search by Product Name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94A3B8' }} /> }}
          sx={{ width: 320 }}
        />
        <Button variant="text" onClick={fetchVariants} startIcon={<RefreshCw size={16} />}>
          Refresh
        </Button>
      </Paper>

      {/* Main Data Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F1F5F9' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={variants.length > 0 && selectedIds.length === variants.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Stock Qty</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94A3B8' }}>
                    No variants found matching filter criteria
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((v) => {
                  const isSelected = selectedIds.includes(v.id);
                  return (
                    <TableRow key={v.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => handleSelectOne(v.id)} />
                      </TableCell>
                      <TableCell><Chip label={v.sku} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{v.product?.name || 'N/A'}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#2563EB' }}>₹{Number(v.price).toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>{v.stockQuantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={v.status}
                          color={v.status === 'active' ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Server Side Pagination */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E2E8F0' }}>
          <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      </Paper>

      {/* Bulk Price Adjustment Dialog */}
      <Dialog open={priceDialogOpen} onClose={() => setPriceDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Bulk Price Update ({selectedIds.length} Selected)</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Adjustment Value"
              type="number"
              value={priceVal}
              onChange={(e) => setPriceVal(Number(e.target.value))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPriceDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBulkPriceUpdate}>
            Apply Bulk Price Change
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
