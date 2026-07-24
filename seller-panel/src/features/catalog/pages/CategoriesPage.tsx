/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Folder,
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Upload,
  Globe,
  Tag as TagIcon,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../api/axiosInstance';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [flatCategories, setFlatCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    imageUrl: '',
    iconUrl: '',
    bannerUrl: '',
    status: 'active',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get('/catalog/categories');
      const tree = res.data?.data || [];
      setCategories(tree);

      // Flatten tree for Parent Dropdown
      const flat: any[] = [];
      const flatten = (nodes: any[], depth = 0) => {
        nodes.forEach((node) => {
          flat.push({ ...node, prefix: '— '.repeat(depth) + node.name });
          if (node.children && node.children.length > 0) {
            flatten(node.children, depth + 1);
          }
        });
      };
      flatten(tree);
      setFlatCategories(flat);
    } catch (err: any) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category: any | null = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        parentId: category.parentId ? String(category.parentId) : '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        iconUrl: category.iconUrl || '',
        bannerUrl: category.bannerUrl || '',
        status: category.status || 'active',
        metaTitle: category.seoTitle || category.metaTitle || '',
        metaDescription: category.seoDescription || category.metaDescription || '',
        metaKeywords: category.seoKeywords || category.metaKeywords || '',
        canonicalUrl: category.canonicalUrl || '',
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        name: '',
        slug: '',
        parentId: '',
        description: '',
        imageUrl: '',
        iconUrl: '',
        bannerUrl: '',
        status: 'active',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        canonicalUrl: '',
      });
    }
    setModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category Name is required');
      return;
    }

    try {
      if (selectedCategory) {
        await axiosInstance.put(`/catalog/categories/${selectedCategory.id}`, formData);
        toast.success('Category updated successfully!');
      } else {
        await axiosInstance.post('/catalog/categories', formData);
        toast.success('Category created successfully!');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axiosInstance.delete(`/catalog/categories/${id}`);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error('Failed to delete category');
    }
  };

  const renderCategoryTree = (nodes: any[]) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      return (
        <Accordion key={node.id} defaultExpanded sx={{ mb: 1, border: '1px solid #E2E8F0', borderRadius: '8px !important' }}>
          <AccordionSummary expandIcon={hasChildren ? <ChevronDown size={18} /> : null}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Folder size={18} color="#0284C7" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A' }}>
                  {node.name}
                </Typography>
                <Chip
                  label={node.status ? node.status.toUpperCase() : 'ACTIVE'}
                  size="small"
                  color={node.status === 'inactive' ? 'default' : 'success'}
                  sx={{ height: 20, fontSize: 10, fontWeight: 800 }}
                />
              </Box>
              <Box onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" onClick={() => handleOpenModal(node)}>
                  <Edit2 size={16} />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDeleteCategory(node.id)}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            </Box>
          </AccordionSummary>
          {hasChildren && (
            <AccordionDetails sx={{ pl: 4, pt: 0 }}>
              {renderCategoryTree(node.children)}
            </AccordionDetails>
          )}
        </Accordion>
      );
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Category Hierarchy Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage main categories, sub-categories, nested trees, media, and SEO metadata.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => handleOpenModal(null)}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Add New Category
        </Button>
      </Box>

      {/* CATEGORY TREE CONTAINER */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          {isLoading ? (
            <Typography variant="body2" sx={{ py: 4, textAlign: 'center' }}>Loading Category Tree...</Typography>
          ) : categories.length === 0 ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <FolderPlus size={48} color="#94A3B8" />
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>No Categories Found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get started by creating your first main category.
              </Typography>
              <Button variant="contained" onClick={() => handleOpenModal(null)}>Add Main Category</Button>
            </Box>
          ) : (
            renderCategoryTree(categories)
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT CATEGORY MODAL */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Category Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Parent Category"
                fullWidth
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              >
                <MenuItem value="">[None - Main Category]</MenuItem>
                {flatCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id} disabled={selectedCategory?.id === cat.id}>
                    {cat.prefix}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={2}
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            {/* MEDIA URLS */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}><Chip label="MEDIA & ASSETS" size="small" icon={<Upload size={14} />} /></Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category Image URL"
                fullWidth
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category Icon URL"
                fullWidth
                placeholder="https://cdn-icons-png.flaticon.com/..."
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
              />
            </Grid>

            {/* SEO SETTINGS */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}><Chip label="SEO & METADATA" size="small" icon={<Globe size={14} />} /></Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Meta Title"
                fullWidth
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Canonical URL"
                fullWidth
                value={formData.canonicalUrl}
                onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Meta Description"
                multiline
                rows={2}
                fullWidth
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveCategory} sx={{ fontWeight: 700 }}>
            {selectedCategory ? 'Update Category' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
