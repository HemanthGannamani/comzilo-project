import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Paper,
  TextField,
  MenuItem,
  Avatar,
  Divider,
  Rating,
  CircularProgress,
  IconButton,
  Badge,
} from '@mui/material';
import {
  MessageSquare,
  Ticket,
  Plus,
  Send,
  Bot,
  User,
  Paperclip,
  CheckCircle,
  HelpCircle,
  Star,
  Clock,
  AlertCircle,
  FileText,
  Truck,
  ShieldCheck,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const SellerCustomerSupportPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);

  // Response & Note Form State
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);
  const [selectedCanned, setSelectedCanned] = useState('');

  const fetchAnalyticsAndTickets = async () => {
    setLoading(true);
    try {
      const [anaRes, tckRes, canRes] = await Promise.allSettled([
        axiosInstance.get('/support/seller/analytics'),
        axiosInstance.get(`/support/seller/tickets?status=${statusFilter}`),
        axiosInstance.get('/support/seller/canned-responses'),
      ]);

      if (anaRes.status === 'fulfilled') setAnalytics(anaRes.value.data?.data);
      if (tckRes.status === 'fulfilled') setTickets(tckRes.value.data?.data || []);
      if (canRes.status === 'fulfilled') setCannedResponses(canRes.value.data?.data || []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsAndTickets();
  }, [statusFilter]);

  const handleOpenDetails = async (t: any) => {
    setSelectedTicket(t);
    try {
      const res = await axiosInstance.get(`/support/seller/tickets/${t.id}`);
      setDetails(res.data?.data);
    } catch {
      setDetails(null);
    }
  };

  const handleSellerReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      await axiosInstance.post(`/support/seller/tickets/${selectedTicket.id}/reply`, {
        message: replyText,
      });
      toast.success('Seller reply sent to customer!');
      setReplyText('');
      handleOpenDetails(selectedTicket);
      fetchAnalyticsAndTickets();
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleAddInternalNote = async () => {
    if (!internalNote.trim() || !selectedTicket) return;
    setAddingNote(true);
    try {
      await axiosInstance.post(`/support/seller/tickets/${selectedTicket.id}/internal-note`, {
        note: internalNote,
      });
      toast.success('Internal staff note added!');
      setInternalNote('');
      handleOpenDetails(selectedTicket);
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      await axiosInstance.patch(`/support/seller/tickets/${selectedTicket.id}`, {
        status: newStatus,
      });
      toast.success(`Ticket status set to ${newStatus.toUpperCase()}`);
      handleOpenDetails(selectedTicket);
      fetchAnalyticsAndTickets();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSelectCanned = (content: string) => {
    setReplyText(content);
    setSelectedCanned('');
  };

  return (
    <PageContainer
      title="Customer Support Workspace"
      subtitle="AI + Human Hybrid Ticket Operations, Live SLA Timers, and Customer Satisfaction (CSAT)"
      actionText="Refresh Support Queue"
      onAction={fetchAnalyticsAndTickets}
      actionIcon={<RefreshCw size={18} />}
    >
      {/* 1. BELL NOTIFICATION ALERT BANNER */}
      {analytics?.unreadHighCritical > 0 && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge badgeContent={analytics.unreadHighCritical} color="error">
              <Bell color="#DC2626" size={24} />
            </Badge>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#991B1B' }}>
                🚨 High & Critical Priority SLA Alerts ({analytics.unreadHighCritical} Unread)
              </Typography>
              <Typography variant="caption" sx={{ color: '#7F1D1D' }}>
                Immediate seller intervention required to avoid SLA breach.
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" color="error" size="small" onClick={() => setStatusFilter('open')} sx={{ fontWeight: 700 }}>
            View High Priority Tickets
          </Button>
        </Paper>
      )}

      {/* 2. SUPPORT ANALYTICS METRICS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #2563EB' }}>
            <Typography variant="body2" color="text.secondary">Open Seller Tickets</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#2563EB' }}>
              {analytics?.openTickets || 0} Open
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #F59E0B' }}>
            <Typography variant="body2" color="text.secondary">Pending Customer Reply</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#F59E0B' }}>
              {analytics?.pendingTickets || 0} Pending
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #10B981' }}>
            <Typography variant="body2" color="text.secondary">AI Auto-Resolution Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: '#10B981' }}>
              {analytics?.aiResolutionPercent || '100'}% AI Resolved
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card sx={{ p: 2.5, borderRadius: 3, borderLeft: '4px solid #8B5CF6' }}>
            <Typography variant="body2" color="text.secondary">Average CSAT Rating</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#8B5CF6' }}>
                {analytics?.avgCsat || '5.0'} / 5.0
              </Typography>
              <Star color="#8B5CF6" size={20} fill="#8B5CF6" />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 3. FILTER TABS */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs value={statusFilter} onChange={(_, v) => setStatusFilter(v)} variant="scrollable" scrollButtons="auto">
          <Tab value="all" label="All Tickets" />
          <Tab value="open" label="Open & Escalated" />
          <Tab value="pending" label="Pending Customer" />
          <Tab value="resolved" label="Resolved" />
          <Tab value="closed" label="Closed" />
        </Tabs>
      </Paper>

      {/* 4. WORKSPACE CONTENT */}
      <Grid container spacing={3}>
        {/* TICKET LIST */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, px: 1 }}>Store Support Queue</Typography>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={28} /></Box>
            ) : tickets.length === 0 ? (
              <Typography color="text.secondary" sx={{ p: 2 }}>No tickets found matching current status filter.</Typography>
            ) : (
              tickets.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => handleOpenDetails(t)}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 2.5,
                    cursor: 'pointer',
                    border: selectedTicket?.id === t.id ? '2px solid #2563EB' : '1px solid #E2E8F0',
                    bgcolor: selectedTicket?.id === t.id ? '#EFF6FF' : 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>#{t.ticketNumber}</Typography>
                    <Chip label={t.priority?.toUpperCase()} color={t.priority === 'critical' ? 'error' : t.priority === 'high' ? 'warning' : 'default'} size="small" />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t.subject}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Customer: {t.customerName} ({t.customerEmail})
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                    <Chip label={t.status.toUpperCase()} color={t.status === 'open' ? 'warning' : 'success'} size="small" />
                    <Typography variant="caption" color="text.secondary"><Clock size={12} /> SLA: 24h</Typography>
                  </Box>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* TICKET DETAILS & WORKSPACE */}
        <Grid item xs={12} md={7}>
          {selectedTicket && details ? (
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              {/* TICKET HEADER */}
              <Box sx={{ borderBottom: '1px solid #E2E8F0', pb: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Ticket #{details.ticket?.ticketNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">{details.ticket?.subject}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Customer: {details.customer?.firstName} {details.customer?.lastName} ({details.customer?.email})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="success" size="small" onClick={() => handleUpdateStatus('resolved')} sx={{ fontWeight: 700 }}>
                    Resolve
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleUpdateStatus('closed')} sx={{ fontWeight: 700 }}>
                    Close
                  </Button>
                </Box>
              </Box>

              {/* CUSTOMER & ORDER CONTEXT CARDS */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {details.order && (
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1.5, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Associated Order</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>#{details.order.orderNumber}</Typography>
                      <Typography variant="caption">Amount: ₹{details.order.totalAmount || 0}</Typography>
                    </Paper>
                  </Grid>
                )}
                {details.payment && (
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1.5, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary">Payment Status</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {(details.payment.status || 'COMPLETED').toUpperCase()}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* CONVERSATION TIMELINE */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Complete AI + Customer Conversation History</Typography>
              <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {details.messages?.map((m: any) => (
                  <Box
                    key={m.id}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      bgcolor: m.senderType === 'seller_staff' ? '#ECFDF5' : m.senderType === 'ai_assistant' ? '#FFFBEB' : '#EFF6FF',
                      border: m.senderType === 'seller_staff' ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {m.senderType === 'seller_staff' ? `Store Agent (${m.senderName})` : m.senderType === 'ai_assistant' ? 'AI Assistant' : 'Customer'}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>{m.message}</Typography>
                  </Box>
                ))}
              </Box>

              {/* CANNED RESPONSES SELECTOR */}
              <Box sx={{ mb: 1.5 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Reusable Canned Response Template"
                  value={selectedCanned}
                  onChange={(e) => handleSelectCanned(e.target.value)}
                >
                  <MenuItem value="">Custom Reply...</MenuItem>
                  {cannedResponses.map((c) => (
                    <MenuItem key={c.id} value={c.content}>
                      [{c.shortcut}] {c.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* SELLER REPLY BOX */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField fullWidth multiline rows={2} placeholder="Write reply to customer..." value={replyText} onChange={(e) => setReplyText(e.target.value)} size="small" />
                <Button variant="contained" onClick={handleSellerReply} disabled={replying} sx={{ fontWeight: 700, px: 3 }}>
                  Send Reply
                </Button>
              </Box>

              {/* INTERNAL STAFF NOTES (INVISIBLE TO CUSTOMER) */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#D97706' }}>
                🔒 Internal Seller Staff Notes (Invisible to Customer)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField fullWidth placeholder="Add private internal note for team..." value={internalNote} onChange={(e) => setInternalNote(e.target.value)} size="small" />
                <Button variant="outlined" color="warning" onClick={handleAddInternalNote} disabled={addingNote} sx={{ fontWeight: 700 }}>
                  Add Note
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {details.internalNotes?.map((n: any) => (
                  <Paper key={n.id} sx={{ p: 1.5, bgcolor: '#FFFBEB', border: '1px dashed #FDE68A', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#B45309' }}>Staff: {n.staffName}</Typography>
                    <Typography variant="body2" sx={{ color: '#78350F' }}>{n.note}</Typography>
                  </Paper>
                ))}
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', border: '1px solid #E2E8F0' }}>
              <Typography variant="body1" color="text.secondary">Select a support ticket from the queue to open the seller workspace.</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};
