import React, { useState } from 'react';
import { Box, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus, Search, Trash2 } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import {
  useGetCollectionsQuery,
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from '../../../api/endpoints/catalogApi';
import { usePermission } from '../../../hooks/usePermission';
import toast from 'react-hot-toast';

export const CollectionsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const canCreate = usePermission('collection.create');
  const canDelete = usePermission('collection.delete');

  const { data, isLoading } = useGetCollectionsQuery({ search });
  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();

  const handleCreate = async () => {
    try {
      await createCollection(formData).unwrap();
      toast.success('Collection created successfully');
      setOpenModal(false);
      setFormData({ name: '', slug: '', description: '' });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create collection');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteCollection(selectedId).unwrap();
      toast.success('Collection deleted successfully');
      setConfirmOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete collection');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Collection Name', flex: 1, minWidth: 160 },
    { field: 'slug', headerName: 'Slug', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
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
        </Box>
      ),
    },
  ];

  const rows = data?.data?.collections || data?.data || [];

  return (
    <PageContainer
      title="Product Collections"
      subtitle="Curate promotional and seasonal product collections"
      actionText={canCreate ? 'Create Collection' : undefined}
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            },
          }}
          sx={{ maxWidth: 300 }}
        />
      </Box>

      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Collection</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Collection Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Slug"
            fullWidth
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Collection"
        message="Are you sure you want to delete this collection?"
        color="error"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
};
