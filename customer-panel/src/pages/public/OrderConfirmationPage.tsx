import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Package,
  ArrowRight,
  Download,
  Share2,
  Copy,
  Mail,
  Check,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const orderShareUrl = window.location.href;
  const shareText = `🛒 Order Confirmed on Comzilo Store!\n📦 Order Number: ${orderNumber}\n🔗 Track Order: ${orderShareUrl}`;

  const handleWhatsAppShare = () => {
    const encodedMessage = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(orderShareUrl);
    setCopied(true);
    toast.success('Order tracking link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Order Details: ${orderNumber}`);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comzilo Store Order - ${orderNumber}`,
          text: `My order ${orderNumber} details`,
          url: orderShareUrl,
        });
        toast.success('Order shared successfully!');
      } catch (err) {
        // User cancelled share
      }
    } else {
      setShareModalOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Box sx={{ display: 'inline-flex', p: 2, bgcolor: '#ECFDF5', borderRadius: '50%', mb: 3 }}>
          <CheckCircle size={56} color="#10B981" />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Order Confirmed & Placed!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 520, mx: 'auto' }}>
          Thank you for your purchase. We have received your order and sent a confirmation invoice to your registered email address.
        </Typography>

        <Paper sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 3, mb: 4, display: 'inline-block', minWidth: 320, border: '1px dashed #CBD5E1' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
            OFFICIAL TRACKING ORDER NUMBER
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563EB', mt: 0.5, fontFamily: 'monospace' }}>
            {orderNumber}
          </Typography>
        </Paper>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PAYMENT STATUS</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#10B981' }}>CONFIRMED</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ESTIMATED DELIVERY</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>3-5 Business Days</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SHARE OPTIONS BAR */}
        <Paper sx={{ p: 2.5, mb: 4, borderRadius: 3, bgcolor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E40AF', mb: 1.5 }}>
            Share Order Details with Friends & Family
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ rowGap: 1.5 }}>
            {/* WHATSAPP SHARE BUTTON */}
            <Button
              variant="contained"
              onClick={handleWhatsAppShare}
              startIcon={<MessageSquare size={18} />}
              sx={{
                bgcolor: '#25D366',
                color: '#FFF',
                fontWeight: 800,
                borderRadius: 2.5,
                px: 3,
                py: 1,
                '&:hover': { bgcolor: '#1DA851' },
              }}
            >
              Share on WhatsApp
            </Button>

            {/* COPY LINK BUTTON */}
            <Button
              variant="outlined"
              onClick={handleCopyLink}
              startIcon={copied ? <Check size={18} color="#10B981" /> : <Copy size={18} />}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                bgcolor: '#FFF',
                borderColor: '#93C5FD',
                color: '#1E40AF',
                '&:hover': { bgcolor: '#F0F9FF' },
              }}
            >
              {copied ? 'Link Copied!' : 'Copy Order Link'}
            </Button>

            {/* MORE SHARE OPTIONS */}
            <Button
              variant="outlined"
              onClick={handleNativeShare}
              startIcon={<Share2 size={18} />}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                bgcolor: '#FFF',
                borderColor: '#93C5FD',
                color: '#1E40AF',
                '&:hover': { bgcolor: '#F0F9FF' },
              }}
            >
              More Options
            </Button>
          </Stack>
        </Paper>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} to="/account/orders" variant="outlined" size="large" startIcon={<Package size={18} />} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Track Package & Details
          </Button>

          <Button component={Link} to="/account/invoices" variant="outlined" size="large" startIcon={<Download size={18} />} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Download Tax Invoice
          </Button>

          <Button component={Link} to="/products" variant="contained" size="large" endIcon={<ArrowRight size={18} />} sx={{ borderRadius: 2, fontWeight: 800 }}>
            Continue Shopping
          </Button>
        </Box>
      </Paper>

      {/* SHARE MODAL DIALOG */}
      <Dialog open={shareModalOpen} onClose={() => setShareModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Share Order Details</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ py: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                handleWhatsAppShare();
                setShareModalOpen(false);
              }}
              startIcon={<MessageSquare size={20} />}
              sx={{ bgcolor: '#25D366', color: '#FFF', fontWeight: 800, py: 1.5, '&:hover': { bgcolor: '#1DA851' } }}
            >
              Share via WhatsApp
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                handleCopyLink();
                setShareModalOpen(false);
              }}
              startIcon={<Copy size={20} />}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Copy Order Tracking Link
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                handleEmailShare();
                setShareModalOpen(false);
              }}
              startIcon={<Mail size={20} />}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Send via Email
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareModalOpen(false)} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderConfirmationPage;
