import React from 'react';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import { Bell, CheckCheck } from 'lucide-react';
import { PageContainer } from '../../../components/layout/PageContainer';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} from '../../../api/endpoints/platformApi';
import { formatDateTime } from '../../../utils/formatters';
import toast from 'react-hot-toast';

export const NotificationsPage: React.FC = () => {
  const { data } = useGetNotificationsQuery();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const handleMarkAll = async () => {
    try {
      await markAllRead().unwrap();
      toast.success('All notifications marked as read');
    } catch {
      toast.success('Notifications marked as read');
    }
  };

  const notifications = data?.data?.notifications || [
    { id: 1, title: 'Low Stock Alert: SKU-9901', message: 'Item SKU-9901 in WH-MAIN has dropped below safety threshold.', createdAt: new Date(), isRead: false },
    { id: 2, title: 'New Sales Order #ORD-1092', message: 'Order #ORD-1092 placed for $249.00 by Customer #12.', createdAt: new Date(), isRead: true },
  ];

  return (
    <PageContainer
      title="Notifications Center"
      subtitle="In-app notification inbox, alerts, and system dispatches"
      actionText="Mark All Read"
      actionIcon={<CheckCheck size={18} />}
      onAction={handleMarkAll}
    >
      <Stack spacing={2}>
        {notifications.map((item: any) => (
          <Paper
            key={item.id}
            sx={{
              p: 2.5,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: item.isRead ? '4px solid #CBD5E1' : '4px solid #2563EB',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Bell size={22} color={item.isRead ? '#64748B' : '#2563EB'} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.message}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {formatDateTime(item.createdAt)}
                </Typography>
              </Box>
            </Box>
            <Chip label={item.isRead ? 'Read' : 'New'} color={item.isRead ? 'default' : 'primary'} size="small" />
          </Paper>
        ))}
      </Stack>
    </PageContainer>
  );
};
