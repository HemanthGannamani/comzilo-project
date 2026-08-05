import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Plus, ArrowRightLeft, Sliders, AlertTriangle } from 'lucide-react';
import { axiosInstance } from '../../../api/axiosInstance';
import toast from 'react-hot-toast';

interface Props {
  variantId: number;
  variantSku: string;
}

export const VariantInventoryTab: React.FC<Props> = ({ variantId, variantSku }) => {
  const [inventories, setInventories] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  // Forms
  const [allocateForm, setAllocateForm] = useState({ warehouseId: '', quantityOnHand: 10, lowStockThreshold: 5 });
  const [adjustForm, setAdjustForm] = useState({ warehouseId: '', adjustmentQty: 0, notes: '' });
  const [transferForm, setTransferForm] = useState({ fromWarehouseId: '', toWarehouseId: '', quantity: 1 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, whRes] = await Promise.allSettled([
        axiosInstance.get(`/seller/variant-inventory/${variantId}`),
        axiosInstance.get('/warehouses'),
      ]);

      if (invRes.status === 'fulfilled') setInventories(invRes.value.data.data || []);
      if (whRes.status === 'fulfilled') {
        const raw = whRes.value.data.data;
        setWarehouses(Array.isArray(raw) ? raw : raw?.rows || []);
      }
    } catch {
      toast.error('Failed to load variant inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (variantId) fetchData();
  }, [variantId]);

  const handleAllocate = async () => {
    if (!allocateForm.warehouseId) return toast.error('Warehouse selection is required');
    try {
      await axiosInstance.post('/seller/variant-inventory/allocate', {
        variantId,
        warehouseId: Number(allocateForm.warehouseId),
        quantityOnHand: Number(allocateForm.quantityOnHand),
        lowStockThreshold: Number(allocateForm.lowStockThreshold),
      });
      toast.success('Warehouse allocated to variant');
      setAllocateModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Allocation failed');
    }
  };

  const handleAdjust = async () => {
    if (!adjustForm.warehouseId) return toast.error('Warehouse is required');
    try {
      await axiosInstance.post('/seller/variant-inventory/adjust', {
        variantId,
        warehouseId: Number(adjustForm.warehouseId),
        adjustmentQty: Number(adjustForm.adjustmentQty),
        notes: adjustForm.notes,
      });
      toast.success('Stock adjusted');
      setAdjustModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Adjustment failed');
    }
  };

  const handleTransfer = async () => {
    if (!transferForm.fromWarehouseId || !transferForm.toWarehouseId) return toast.error('Select both source and destination warehouses');
    try {
      await axiosInstance.post('/seller/variant-inventory/transfer', {
        variantId,
        fromWarehouseId: Number(transferForm.fromWarehouseId),
        toWarehouseId: Number(transferForm.toWarehouseId),
        quantity: Number(transferForm.quantity),
      });
      toast.success('Stock transferred');
      setTransferModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    }
  };

  const totalOnHand = inventories.reduce((sum, i) => sum + (i.quantityOnHand || 0), 0);
  const totalReserved = inventories.reduce((sum, i) => sum + (i.reservedStock || 0), 0);
  const totalAvailable = Math.max(0, totalOnHand - totalReserved);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Multi-Warehouse Inventory for Variant: {variantSku}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total On-Hand: <strong>{totalOnHand}</strong> | Reserved: <strong>{totalReserved}</strong> | Available: <strong style={{ color: '#16A34A' }}>{totalAvailable}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowRightLeft size={16} />}
            onClick={() => setTransferModalOpen(true)}
            disabled={inventories.length < 2}
            sx={{ fontWeight: 700 }}
          >
            Transfer Stock
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => setAllocateModalOpen(true)}
            sx={{ fontWeight: 700 }}
          >
            Allocate Warehouse
          </Button>
        </Box>
      </Box>

      {inventories.some((i) => (i.quantityAvailable || 0) <= (i.lowStockThreshold || 5)) && (
        <Alert severity="warning" icon={<AlertTriangle size={18} />} sx={{ mb: 2, fontWeight: 700 }}>
          Low Stock Warning: Available inventory has reached or dropped below the low stock threshold for one or more allocated warehouses!
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Warehouse</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Current Stock</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Reserved Stock</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Available Stock</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Low Threshold</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((inv: any) => (
              <TableRow key={inv.id} hover>
                <TableCell sx={{ fontWeight: 700 }}>{inv.warehouse?.name || `Warehouse #${inv.warehouseId}`}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{inv.quantityOnHand}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#DC2626' }}>{inv.reservedStock || 0}</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#16A34A' }}>{inv.quantityAvailable || (inv.quantityOnHand - (inv.reservedStock || 0))}</TableCell>
                <TableCell>{inv.lowStockThreshold || 5}</TableCell>
                <TableCell>
                  <Chip
                    label={(inv.status || 'in_stock').toUpperCase()}
                    color={inv.status === 'out_of_stock' ? 'error' : inv.status === 'low_stock' ? 'warning' : 'success'}
                    size="small"
                    sx={{ fontWeight: 800 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<Sliders size={14} />}
                    onClick={() => {
                      setAdjustForm({ warehouseId: String(inv.warehouseId), adjustmentQty: 0, notes: '' });
                      setAdjustModalOpen(true);
                    }}
                    sx={{ fontSize: 11, fontWeight: 700 }}
                  >
                    Adjust Stock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG: ALLOCATE WAREHOUSE */}
      <Dialog open={allocateModalOpen} onClose={() => setAllocateModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Allocate Warehouse</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Warehouse</InputLabel>
              <Select value={allocateForm.warehouseId} label="Warehouse" onChange={(e) => setAllocateForm({ ...allocateForm, warehouseId: e.target.value })}>
                {warehouses.map((w: any) => (
                  <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Initial Current Stock" type="number" fullWidth value={allocateForm.quantityOnHand} onChange={(e) => setAllocateForm({ ...allocateForm, quantityOnHand: Number(e.target.value) })} />
            <TextField label="Low Stock Warning Threshold" type="number" fullWidth value={allocateForm.lowStockThreshold} onChange={(e) => setAllocateForm({ ...allocateForm, lowStockThreshold: Number(e.target.value) })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAllocateModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAllocate} sx={{ fontWeight: 700 }}>Allocate</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: ADJUST STOCK */}
      <Dialog open={adjustModalOpen} onClose={() => setAdjustModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Adjust Variant Stock</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Adjustment Quantity (+ for Add / - for Deduct)" type="number" fullWidth value={adjustForm.adjustmentQty} onChange={(e) => setAdjustForm({ ...adjustForm, adjustmentQty: Number(e.target.value) })} />
            <TextField label="Adjustment Reason / Notes" fullWidth multiline rows={2} value={adjustForm.notes} onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdjust} sx={{ fontWeight: 700 }}>Save Adjustment</Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: TRANSFER STOCK */}
      <Dialog open={transferModalOpen} onClose={() => setTransferModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Transfer Stock Between Warehouses</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>From Warehouse (Source)</InputLabel>
              <Select value={transferForm.fromWarehouseId} label="From Warehouse (Source)" onChange={(e) => setTransferForm({ ...transferForm, fromWarehouseId: e.target.value })}>
                {inventories.map((i: any) => (
                  <MenuItem key={i.warehouseId} value={i.warehouseId}>{i.warehouse?.name || `Warehouse #${i.warehouseId}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>To Warehouse (Destination)</InputLabel>
              <Select value={transferForm.toWarehouseId} label="To Warehouse (Destination)" onChange={(e) => setTransferForm({ ...transferForm, toWarehouseId: e.target.value })}>
                {warehouses.map((w: any) => (
                  <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Transfer Quantity" type="number" fullWidth value={transferForm.quantity} onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTransfer} sx={{ fontWeight: 700 }}>Execute Transfer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
