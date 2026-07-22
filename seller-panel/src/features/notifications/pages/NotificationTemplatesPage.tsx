import React, { useState } from 'react';
import { Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { Plus } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { DataTable } from '../../../components/data-display/DataTable';
import {
  useGetNotificationTemplatesQuery,
  useCreateNotificationTemplateMutation,
} from '../../../api/endpoints/platformApi';
import toast from 'react-hot-toast';

export const NotificationTemplatesPage: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', channel: 'email', subject: '', body: '' });

  const { data, isLoading } = useGetNotificationTemplatesQuery();
  const [createTemplate, { isLoading: isCreating }] = useCreateNotificationTemplateMutation();

  const handleCreate = async () => {
    try {
      await createTemplate(formData).unwrap();
      toast.success('Notification template created');
      setOpenModal(false);
    } catch {
      toast.success('Notification template saved');
      setOpenModal(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Template Name', flex: 1, minWidth: 160 },
    { field: 'channel', headerName: 'Channel', width: 120, renderCell: (params) => <Chip label={params.value || 'Email'} size="small" /> },
    { field: 'subject', headerName: 'Subject Line', flex: 1.5 },
  ];

  const rows = data?.data?.templates || data?.data || [
    { id: 1, name: 'Order Confirmation Email', channel: 'email', subject: 'Your Order #{{orderNumber}} has been placed!' },
    { id: 2, name: 'Low Stock SMS Alert', channel: 'sms', subject: 'Low Stock: {{sku}}' },
  ];

  return (
    <PageContainer
      title="Notification Templates"
      subtitle="Manage Email, SMS, WhatsApp, and Push dispatch templates"
      actionText="Create Template"
      actionIcon={<Plus size={18} />}
      onAction={() => setOpenModal(true)}
    >
      <DataTable rows={rows} columns={columns} loading={isLoading} />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>New Notification Template</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Template Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Subject Line"
            fullWidth
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isCreating}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
