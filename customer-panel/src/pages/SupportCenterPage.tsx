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
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';
import { CustomerAccountLayout } from '../components/layout/CustomerAccountLayout';

const API_BASE = 'http://localhost:5000/api/v1/support';

export const SupportCenterPage: React.FC = () => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const authHeaders = {
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // AI Chat State
  const [aiMessage, setAiMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your Store AI Support Assistant. Ask me about your order status, shipment tracking, billing, or returns!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [sendingAi, setSendingAi] = useState(false);

  // Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  // Raise Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Order Issue');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // CSAT Rating State
  const [csatScore, setCsatScore] = useState<number | null>(5);
  const [csatFeedback, setCsatFeedback] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/customer/tickets`, authHeaders);
      setTickets(res.data?.data || []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendAiChat = async () => {
    if (!aiMessage.trim()) return;
    const userMsg = aiMessage.trim();
    setAiMessage('');

    setChatHistory((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setSendingAi(true);

    try {
      const res = await axios.post(`${API_BASE}/customer/ai-chat`, {
        message: userMsg,
      }, authHeaders);

      const data = res.data?.data;
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aiResolved: data.aiResolved,
          ticketCreated: data.ticketCreated,
        },
      ]);

      if (data.ticketCreated) {
        toast.success('Support Ticket created and assigned to store seller!');
        fetchTickets();
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'I have logged your request. Connecting you to your seller support agent...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSendingAi(false);
    }
  };

  const handleOpenTicketDetails = async (t: any) => {
    setSelectedTicket(t);
    try {
      const res = await axios.get(`${API_BASE}/customer/tickets/${t.id}`, authHeaders);
      setTicketDetails(res.data?.data);
    } catch {
      setTicketDetails(null);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      await axios.post(`${API_BASE}/customer/tickets/${selectedTicket.id}/reply`, {
        message: replyText,
      }, authHeaders);
      toast.success('Reply sent!');
      setReplyText('');
      handleOpenTicketDetails(selectedTicket);
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject || !message) return toast.error('Please enter subject and message');
    setSubmittingTicket(true);
    try {
      await axios.post(`${API_BASE}/customer/tickets`, {
        subject,
        category,
        priority,
        message,
        orderId: orderId ? Number(orderId) : null,
        attachments: uploadUrl ? [{ fileName: 'document.pdf', fileUrl: uploadUrl, fileType: 'application/pdf' }] : [],
      }, authHeaders);
      toast.success('Support Ticket created successfully!');
      setSubject('');
      setMessage('');
      setUploadUrl('');
      setTabIndex(3); // Switch to My Tickets
      fetchTickets();
    } catch {
      toast.error('Error creating ticket');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSubmitCsat = async () => {
    if (!selectedTicket) return;
    try {
      await axios.post(`${API_BASE}/customer/tickets/${selectedTicket.id}/rate`, {
        score: csatScore || 5,
        feedback: csatFeedback,
      }, authHeaders);
      toast.success('Thank you for rating our support team!');
      setCsatFeedback('');
      handleOpenTicketDetails(selectedTicket);
    } catch {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <CustomerAccountLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 1 }}>
        {/* HEADER BANNER */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Customer Support Center
          </Typography>
          <Typography variant="body2" color="text.secondary">
            AI-Powered 24/7 Assistance & Direct Store Seller Helpdesk
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setTabIndex(2)}
          sx={{ fontWeight: 700, borderRadius: 2.5, px: 2.5, py: 1 }}
        >
          Raise Support Ticket
        </Button>
      </Box>

      {/* NAVIGATION TABS */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} variant="scrollable" scrollButtons="auto">
          <Tab label="Dashboard" icon={<HelpCircle size={18} />} iconPosition="start" />
          <Tab label="AI Chat Assistant" icon={<Bot size={18} />} iconPosition="start" />
          <Tab label="Raise Ticket" icon={<Plus size={18} />} iconPosition="start" />
          <Tab label={`My Tickets (${tickets.length})`} icon={<Ticket size={18} />} iconPosition="start" />
          <Tab label="FAQ / Help Center" icon={<FileText size={18} />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* TAB 0: DASHBOARD */}
      {tabIndex === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Bot color="#2563EB" size={32} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">AI Resolution Speed</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E40AF' }}>Instant (0s)</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: '#ECFDF5', border: '1px solid #A7F3D0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Ticket color="#10B981" size={32} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Active Store Tickets</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#065F46' }}>{tickets.length} Total</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShieldCheck color="#D97706" size={32} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Store Seller Protection</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#92400E' }}>100% Isolated</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Instant AI Support Assistant</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Get immediate real-time updates on your latest order status, AWB shipment tracking, payment billing receipts, and store refund policies.
              </Typography>
              <Button variant="contained" startIcon={<MessageSquare size={18} />} onClick={() => setTabIndex(1)} fullWidth sx={{ py: 1.2, fontWeight: 700 }}>
                Launch AI Live Chat
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Recent Store Tickets</Typography>
              {tickets.slice(0, 3).map((t) => (
                <Box key={t.id} sx={{ p: 1.5, mb: 1, border: '1px solid #F1F5F9', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>#{t.ticketNumber}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.subject}</Typography>
                  </Box>
                  <Chip label={t.status.toUpperCase()} color={t.status === 'open' ? 'warning' : 'success'} size="small" />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* TAB 1: AI CHAT ASSISTANT */}
      {tabIndex === 1 && (
        <Paper sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#2563EB' }}><Bot size={20} /></Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Store AI Support Assistant</Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>Powered by Comzilo Business Intelligence Engine</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 3, height: 420, overflowY: 'auto', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {chatHistory.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: 1.5,
                }}
              >
                {item.sender === 'ai' && <Avatar sx={{ width: 32, height: 32, bgcolor: '#2563EB' }}><Bot size={16} /></Avatar>}
                <Box
                  sx={{
                    maxWidth: '75%',
                    p: 2,
                    borderRadius: 3,
                    bgcolor: item.sender === 'user' ? '#2563EB' : '#FFFFFF',
                    color: item.sender === 'user' ? 'white' : '#1E293B',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  <Typography variant="body2">{item.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.65rem' }}>
                    {item.timestamp}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth
              placeholder="Ask AI about order status, tracking, invoices, or return policies..."
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendAiChat()}
              size="small"
            />
            <Button variant="contained" onClick={handleSendAiChat} disabled={sendingAi} endIcon={<Send size={16} />} sx={{ fontWeight: 700, px: 3 }}>
              Send
            </Button>
          </Box>
        </Paper>
      )}

      {/* TAB 2: RAISE TICKET */}
      {tabIndex === 2 && (
        <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Raise Support Ticket to Store Seller</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Subject / Summary" fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Need assistance with order delivery" />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Category" select fullWidth value={category} onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="Order Issue">Order Issue</MenuItem>
                <MenuItem value="Payment">Payment & Billing</MenuItem>
                <MenuItem value="Shipping">Shipping & Courier</MenuItem>
                <MenuItem value="Refund">Refund / Return Request</MenuItem>
                <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                <MenuItem value="Product Query">Product Query</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Priority Level" select fullWidth value={priority} onChange={(e) => setPriority(e.target.value)}>
                <MenuItem value="low">Low (48h Response)</MenuItem>
                <MenuItem value="medium">Medium (24h Response)</MenuItem>
                <MenuItem value="high">High (6h Response)</MenuItem>
                <MenuItem value="critical">Critical (2h Response)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detailed Description"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain your query in detail..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Related Order ID (Optional)" fullWidth value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. 1" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Attachment URL / Image Link (Optional)" fullWidth value={uploadUrl} onChange={(e) => setUploadUrl(e.target.value)} placeholder="https://..." />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCreateTicket} disabled={submittingTicket} startIcon={<Send size={18} />} sx={{ py: 1.2, px: 4, fontWeight: 700 }}>
                Submit Ticket
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* TAB 3: MY TICKETS & TIMELINE */}
      {tabIndex === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, px: 1 }}>My Support Tickets</Typography>
              {tickets.length === 0 ? (
                <Typography color="text.secondary" sx={{ p: 2 }}>No support tickets raised yet.</Typography>
              ) : (
                tickets.map((t) => (
                  <Card
                    key={t.id}
                    onClick={() => handleOpenTicketDetails(t)}
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
                      <Chip label={t.status.toUpperCase()} color={t.status === 'open' ? 'warning' : 'success'} size="small" />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{t.subject}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(t.createdAt).toLocaleDateString()}</Typography>
                  </Card>
                ))
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            {selectedTicket && ticketDetails ? (
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Box sx={{ borderBottom: '1px solid #E2E8F0', pb: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Ticket #{selectedTicket.ticketNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedTicket.subject}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={`Category: ${selectedTicket.category || 'General'}`} size="small" variant="outlined" />
                    <Chip label={`Priority: ${selectedTicket.priority?.toUpperCase()}`} size="small" color="primary" />
                  </Box>
                </Box>

                <Box sx={{ maxHeight: 350, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {ticketDetails.messages?.map((m: any) => (
                    <Box
                      key={m.id}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: m.senderType === 'customer' ? '#EFF6FF' : '#F8FAFC',
                        border: m.senderType === 'customer' ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: m.senderType === 'customer' ? '#1E40AF' : '#0F172A' }}>
                        {m.senderType === 'customer' ? 'You (Customer)' : m.senderName || 'Store Support Agent'}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-line' }}>{m.message}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* REPLY BOX */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField fullWidth placeholder="Type message reply to store seller..." value={replyText} onChange={(e) => setReplyText(e.target.value)} size="small" />
                  <Button variant="contained" onClick={handleSendReply} disabled={replying} sx={{ fontWeight: 700 }}>Reply</Button>
                </Box>

                {/* CSAT RATING BOX */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Rate Seller Support Satisfaction (CSAT)</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating value={csatScore} onChange={(_, val) => setCsatScore(val)} />
                  <TextField placeholder="Feedback notes..." size="small" value={csatFeedback} onChange={(e) => setCsatFeedback(e.target.value)} />
                  <Button variant="outlined" size="small" onClick={handleSubmitCsat} sx={{ fontWeight: 700 }}>Submit CSAT</Button>
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', border: '1px solid #E2E8F0' }}>
                <Typography variant="body1" color="text.secondary">Select a ticket from the left panel to view conversation timeline.</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}

      {/* TAB 4: FAQ / HELP CENTER */}
      {tabIndex === 4 && (
        <Paper sx={{ p: 3.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Frequently Asked Questions (FAQ)</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>How do I track my order shipment?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Go to My Orders, click Track Package to view real-time AWB status and carrier tracking link.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ p: 2, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>What is the refund turnaround time?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Bank refunds are processed within 2-3 business days back to your original payment method.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  </CustomerAccountLayout>
  );
};
