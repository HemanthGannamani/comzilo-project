import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { Mail, MailOpen, Search } from 'lucide-react';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
} from '../../api/adminApi';
import toast from 'react-hot-toast';

export const NotificationsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(''); // 'read', 'unread'
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: notifData, isLoading } = useGetNotificationsQuery({
    search,
    status,
    page,
    limit: pageSize,
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markUnread] = useMarkNotificationUnreadMutation();

  const notifications = notifData?.data?.notifications || [];
  const total = notifData?.data?.total || 0;

  const handleToggleRead = async (id: number, isRead: boolean) => {
    try {
      if (isRead) {
        await markUnread(id).unwrap();
        toast.success('Notification marked as unread');
      } else {
        await markRead(id).unwrap();
        toast.success('Notification marked as read');
      }
    } catch {
      toast.error('Failed to update notification');
    }
  };

  return (
    <PageContainer
      title="In-App Notification Center"
      subtitle="View, track, and manage all automated platform registrations, approvals, and credentials updates notifications"
    >
      <Paper sx={{ p: 3, mb: 3, border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94A3B8' }} />,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="">All Notifications</MenuItem>
                <MenuItem value="unread">Unread Only</MenuItem>
                <MenuItem value="read">Read Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ border: '1px solid #E2E8F0', boxShadow: 'none', borderRadius: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Channel</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Notification Header</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Body Content</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Generated Date</TableCell>
                  <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      No notifications recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((n: any) => {
                    const isRead = !!n.readAt;
                    return (
                      <TableRow key={n.id} hover sx={{ bgcolor: isRead ? 'inherit' : '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 700 }}>
                          <Chip label={n.channel?.toUpperCase() || 'EMAIL'} size="small" color="primary" />
                        </TableCell>
                        <TableCell sx={{ fontWeight: isRead ? 600 : 800 }}>{n.title || n.subject || 'Platform Alert'}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: isRead ? 500 : 700 }}>{n.content || n.body}</TableCell>
                        <TableCell>
                          <Chip
                            label={isRead ? 'Read' : 'Unread'}
                            color={isRead ? 'default' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{new Date(n.createdAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                            onClick={() => handleToggleRead(n.id, isRead)}
                          >
                            {isRead ? 'Unread' : 'Read'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={total}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={(_, np) => setPage(np)}
              onRowsPerPageChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}
      </TableContainer>
    </PageContainer>
  );
};
