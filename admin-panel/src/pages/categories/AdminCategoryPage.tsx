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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Plus, Edit2, Trash2, FolderTree, RefreshCw, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCategoryPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/categories').then((r) => r.json());
      if (res.success || Array.isArray(res)) {
        const list = res.data || res;
        setCategories(Array.isArray(list) ? list : []);
      }
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name || '');
      setSlug(cat.slug || '');
      setParentId(cat.parentId ? String(cat.parentId) : '');
      setDescription(cat.description || '');
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setParentId('');
      setDescription('');
    }
    setDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      toast.error('Category Name is required');
      return;
    }

    try {
      const payload = {
        name,
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        parentId: parentId ? Number(parentId) : null,
        description,
      };

      const url = editingCategory ? `/api/v1/categories/${editingCategory.id}` : '/api/v1/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      if (res.success || res.id) {
        toast.success(`Category ${editingCategory ? 'updated' : 'created'} successfully`);
        setDialogOpen(false);
        fetchCategories();
      } else {
        toast.error(res.message || 'Operation failed');
      }
    } catch (e) {
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to archive this category?')) return;

    try {
      const res = await fetch(`/api/v1/categories/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res.success) {
        toast.success('Category archived successfully');
        fetchCategories();
      }
    } catch (e) {
      toast.error('Failed to archive category');
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#F8FAFC', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Category Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage store catalog categories, parent-child hierarchies, and attribute mappings
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={18} />}
            onClick={fetchCategories}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => handleOpenModal()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Create Category
          </Button>
        </Box>
      </Box>

      {/* Main Category Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F1F5F9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Parent Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94A3B8' }}>
                    No categories found. Click 'Create Category' to add one.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => {
                  const parentCat = categories.find((c) => c.id === cat.parentId);
                  return (
                    <TableRow key={cat.id}>
                      <TableCell sx={{ fontWeight: 700 }}>#{cat.id}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FolderTree size={18} color="#2563EB" />
                          {cat.name}
                        </Box>
                      </TableCell>
                      <TableCell><Chip label={cat.slug} size="small" sx={{ fontWeight: 600 }} /></TableCell>
                      <TableCell>{parentCat ? parentCat.name : <Typography variant="caption" color="text.secondary">Root Category</Typography>}</TableCell>
                      <TableCell>
                        <Chip
                          label={cat.status || 'active'}
                          color={cat.status === 'archived' ? 'default' : 'success'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Category">
                          <IconButton size="small" onClick={() => handleOpenModal(cat)} color="primary">
                            <Edit2 size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Archive Category">
                          <IconButton size="small" onClick={() => handleDeleteCategory(cat.id)} color="error">
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create / Edit Category Modal */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Category Slug (URL)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="Auto-generated from name if left empty"
              fullWidth
            />
            <TextField
              select
              label="Parent Category (Optional)"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">None (Top-Level Category)</MenuItem>
              {categories
                .filter((c) => !editingCategory || c.id !== editingCategory.id)
                .map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </MenuItem>
                ))}
            </TextField>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCategory}>
            {editingCategory ? 'Update Category' : 'Save Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
