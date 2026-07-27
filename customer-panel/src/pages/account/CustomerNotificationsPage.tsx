import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} from '../../api/customerPortalApi';
import toast from 'react-hot-toast';

export const CustomerNotificationsPage: React.FC = () => {
  const { data: notifData, isLoading } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notifData?.data?.rows || notifData?.data || [];

  const handleMarkRead = async (id: number) => {
    try {
      await markRead(id).unwrap();
      toast.success('Notification marked as read');
    } catch (err: any) {
      toast.error('Failed to mark notification');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success('Notification removed');
    } catch (err: any) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <CustomerAccountLayout>
      <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
              Notification Center
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time updates on orders, shipping tracking, offers & system alerts.
            </Typography>
          </Box>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={36} />
          </Box>
        ) : notifications.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
            No notifications recorded yet.
          </Typography>
        ) : (
          <List disablePadding>
            {notifications.map((n: any, idx: number) => (
              <React.Fragment key={n.id}>
                {idx > 0 && <Divider sx={{ my: 1 }} />}
                <ListItem
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: n.isRead ? 'transparent' : '#EFF6FF',
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ p: 1, bgcolor: '#FFFFFF', borderRadius: 2, mt: 0.5 }}>
                    <Bell size={20} color="#2563EB" />
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: n.isRead ? 600 : 800 }}>
                          {n.title}
                        </Typography>
                        {!n.isRead && <Chip label="NEW" color="error" size="small" sx={{ height: 18, fontSize: '0.65rem' }} />}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {n.content || n.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!n.isRead && (
                      <IconButton size="small" color="primary" onClick={() => handleMarkRead(n.id)}>
                        <Check size={18} />
                      </IconButton>
                    )}
                    <IconButton size="small" color="error" onClick={() => handleDelete(n.id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </CustomerAccountLayout>
  );
};
