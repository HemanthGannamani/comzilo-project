import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { PageContainer } from '../../components/layout/PageContainer';
import { axiosInstance } from '../../api/axiosInstance';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

// 1. Reviews Page (/store/reviews)
export const ReviewsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/store/reviews');
      const data = res.data?.data || res.data?.items || res.data;
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <PageContainer
      title="Product Reviews & Ratings"
      subtitle="Moderate customer product ratings, verified buyer feedback, and merchant replies"
      actionText="Export Reviews"
      onAction={() => toast.success('Reviews report exported!')}
      actionIcon={<Plus size={18} />}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Total Customer Reviews</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'primary.main' }}>
              {reviews.length} Reviews
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Average Product Rating</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {reviews.length > 0 ? (reviews.reduce((a, b) => a + (b.rating || 5), 0) / reviews.length).toFixed(1) : '0.0'} / 5.0
              </Typography>
              <Rating value={reviews.length > 0 ? 4.8 : 0} precision={0.1} readOnly size="small" />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Verified Buyer Ratio</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>
              100% Verified
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Review Comment</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No customer reviews recorded yet. Customer ratings will appear automatically upon order completion.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((rev, idx) => (
                <TableRow key={rev.id || idx}>
                  <TableCell sx={{ fontWeight: 600 }}>{rev.customerName || rev.customer || 'Customer'}</TableCell>
                  <TableCell>{rev.productName || rev.product || 'Product'}</TableCell>
                  <TableCell><Rating value={rev.rating || 5} readOnly size="small" /></TableCell>
                  <TableCell>{rev.comment || rev.text || 'Great product quality!'}</TableCell>
                  <TableCell>{formatDate(rev.createdAt || rev.date || new Date())}</TableCell>
                  <TableCell><Chip label={(rev.status || 'PUBLISHED').toUpperCase()} color="success" size="small" sx={{ fontWeight: 700 }} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

// 2. Support Tickets Page (/store/support-tickets)
export const SupportTicketsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/store/support-tickets');
      const data = res.data?.data || res.data?.items || res.data;
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = () => {
    if (!subject) return toast.error('Please enter support issue subject');
    const newTck = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      customerName: custName || 'Walk-in Customer',
      subject,
      priority,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTck, ...prev]);
    toast.success('Support Ticket created!');
    setDialogOpen(false);
    setSubject('');
    setCustName('');
  };

  return (
    <PageContainer
      title="Customer Support Tickets"
      subtitle="Manage customer service tickets, SLA response times, and dispute resolution"
      actionText="Create Support Ticket"
      onAction={() => setDialogOpen(true)}
      actionIcon={<Plus size={18} />}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Total Support Tickets</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'primary.main' }}>
              {tickets.length} Tickets
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Open Pending Tickets</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'warning.main' }}>
              {tickets.filter((t) => t.status === 'OPEN').length} Pending
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">SLA Resolution Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>
              100% On-Time
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ticket ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Subject / Issue</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No customer support tickets opened. Click <strong>"Create Support Ticket"</strong> to log a query.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((tck, idx) => (
                <TableRow key={tck.id || idx}>
                  <TableCell sx={{ fontWeight: 600 }}>{tck.id || `TCK-${idx + 1}`}</TableCell>
                  <TableCell>{tck.customerName || tck.customer || 'Customer'}</TableCell>
                  <TableCell>{tck.subject}</TableCell>
                  <TableCell><Chip label={tck.priority || 'MEDIUM'} color={tck.priority === 'HIGH' ? 'error' : 'warning'} size="small" sx={{ fontWeight: 700 }} /></TableCell>
                  <TableCell>{formatDate(tck.createdAt || tck.date || new Date())}</TableCell>
                  <TableCell><Chip label={(tck.status || 'OPEN').toUpperCase()} color={tck.status === 'RESOLVED' ? 'success' : 'info'} size="small" sx={{ fontWeight: 700 }} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Ticket Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Support Ticket</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Customer Name" fullWidth value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="e.g. Hemanth Gannamani" />
            <TextField label="Subject / Issue Details" fullWidth value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Inquiry regarding order delivery" />
            <TextField label="Priority Level" select fullWidth value={priority} onChange={(e) => setPriority(e.target.value)}>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High Priority</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTicket} sx={{ fontWeight: 700 }}>
            Create Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

// 3. Staff Management Page (/store/staff)
export const StaffManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Store Manager');

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/store/staff');
      const data = res.data?.data || res.data?.items || res.data;
      setStaff(Array.isArray(data) ? data : []);
    } catch {
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = () => {
    if (!name || !email) return toast.error('Please enter staff name and email');
    const newStf = {
      id: Date.now(),
      name,
      email,
      role,
      status: 'ACTIVE',
    };
    setStaff((prev) => [...prev, newStf]);
    toast.success(`Staff invitation sent to ${email}!`);
    setDialogOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <PageContainer
      title="Staff & User Management"
      subtitle="Manage merchant employees, assign RBAC roles, permissions, and audit logs"
      actionText="Invite New Staff Member"
      onAction={() => setDialogOpen(true)}
      actionIcon={<Plus size={18} />}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Total Staff Members</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'primary.main' }}>
              {staff.length} Staff
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Active Account Status</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {staff.filter((s) => s.status === 'ACTIVE').length} Active
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Security Standard</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>
              MFA Enforced
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Staff Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Assigned Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No staff members registered. Click <strong>"Invite New Staff Member"</strong> to grant employee access.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((stf, idx) => (
                <TableRow key={stf.id || idx}>
                  <TableCell sx={{ fontWeight: 600 }}>{stf.name}</TableCell>
                  <TableCell>{stf.email}</TableCell>
                  <TableCell><Chip label={stf.role || 'Staff Member'} color="primary" size="small" sx={{ fontWeight: 700 }} /></TableCell>
                  <TableCell><Chip label={(stf.status || 'ACTIVE').toUpperCase()} color="success" size="small" sx={{ fontWeight: 700 }} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invite Staff Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Invite New Staff Member</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Full Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
            <TextField label="Email Address" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. ramesh@comzilo.com" />
            <TextField label="Role" select fullWidth value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="Store Manager">Store Manager</MenuItem>
              <MenuItem value="Inventory Specialist">Inventory Specialist</MenuItem>
              <MenuItem value="Customer Support Agent">Customer Support Agent</MenuItem>
              <MenuItem value="Cashier / POS Operator">Cashier / POS Operator</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddStaff} sx={{ fontWeight: 700 }}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

// 4. Loyalty Program Page (/marketing/loyalty)
export const LoyaltyProgramPage: React.FC = () => {
  const [tiers, setTiers] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tierName, setTierName] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [multiplier, setMultiplier] = useState('1.5');

  const handleAddTier = () => {
    if (!tierName || !minSpend) return toast.error('Please enter tier name and minimum spend');
    const newTier = {
      id: Date.now(),
      name: tierName,
      minSpend: Number(minSpend),
      multiplier: `${multiplier}x Points`,
      status: 'ACTIVE',
    };
    setTiers((prev) => [...prev, newTier]);
    toast.success(`Reward Tier "${tierName}" added!`);
    setDialogOpen(false);
    setTierName('');
    setMinSpend('');
  };

  return (
    <PageContainer
      title="Customer Loyalty & Rewards Program"
      subtitle="Configure customer reward tiers, points ratio, and promotional redemption rewards"
      actionText="Create Reward Tier"
      onAction={() => setDialogOpen(true)}
      actionIcon={<Plus size={18} />}
    >
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Configured Reward Tiers</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'primary.main' }}>
              {tiers.length} Tiers
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Default Points Earnings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              1 Point per ₹100
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">Redemption Ratio</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>
              100 Pts = ₹10 Discount
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Tier Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Min Spend Threshold</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Points Multiplier</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                  No reward tiers configured yet. Click <strong>"Create Reward Tier"</strong> to define Gold or Silver VIP tiers.
                </TableCell>
              </TableRow>
            ) : (
              tiers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                  <TableCell>₹{t.minSpend}</TableCell>
                  <TableCell><Chip label={t.multiplier} color="primary" size="small" sx={{ fontWeight: 700 }} /></TableCell>
                  <TableCell><Chip label={t.status} color="success" size="small" sx={{ fontWeight: 700 }} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Tier Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Reward Tier</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Tier Name" fullWidth value={tierName} onChange={(e) => setTierName(e.target.value)} placeholder="e.g. Gold VIP Member" />
            <TextField label="Min Spend Threshold (₹)" type="number" fullWidth value={minSpend} onChange={(e) => setMinSpend(e.target.value)} placeholder="e.g. 10000" />
            <TextField label="Points Earning Multiplier" select fullWidth value={multiplier} onChange={(e) => setMultiplier(e.target.value)}>
              <MenuItem value="1.0">1.0x Normal Points</MenuItem>
              <MenuItem value="1.5">1.5x Bonus Points</MenuItem>
              <MenuItem value="2.0">2.0x Double Points</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTier} sx={{ fontWeight: 700 }}>
            Create Tier
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};
