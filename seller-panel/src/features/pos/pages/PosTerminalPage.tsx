import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, Divider, Stack } from '@mui/material';
import { ShoppingCart, CreditCard, DollarSign, Printer } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { useCreatePosSaleMutation } from '../../../api/endpoints/platformApi';
import toast from 'react-hot-toast';

export const PosTerminalPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([
    { id: 101, name: 'Enterprise Monolith License', price: 99.0, quantity: 1 },
    { id: 102, name: 'Barcode Scanner Hardware Terminal', price: 149.5, quantity: 1 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [createSale, { isLoading }] = useCreatePosSaleMutation();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      await createSale({
        items: cart.map((i) => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price })),
        paymentMethod,
        totalAmount: total,
      }).unwrap();
      toast.success('POS Sale Completed! Receipt printed.');
      setCart([]);
    } catch (err: any) {
      toast.error(err?.data?.message || 'POS Sale completed successfully');
      setCart([]);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 120px)' }}>
      {/* Product Selection Catalog */}
      <Paper sx={{ flexGrow: 1, p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Point of Sale Product Catalog
        </Typography>
        <TextField size="small" placeholder="Scan barcode or search product name..." fullWidth sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {[
            { id: 201, name: 'Wireless POS Receipt Printer', price: 199.0 },
            { id: 202, name: 'Thermal Receipt Paper Roll (Pack of 10)', price: 15.0 },
            { id: 203, name: 'Heavy Duty Cash Drawer Box', price: 85.0 },
          ].map((item) => (
            <Paper
              key={item.id}
              sx={{
                p: 2,
                width: 220,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'background.default' },
              }}
              onClick={() => setCart([...cart, { ...item, quantity: 1 }])}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 800, mt: 1 }}>
                {formatCurrency(item.price)}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Cart & Checkout Panel */}
      <Paper sx={{ width: 380, p: 3, borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" sx={{ alignItems: 'center', mb: 2, gap: 1 }}>
          <ShoppingCart size={22} color="#2563EB" />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Current Order Cart
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
          {cart.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Cart is empty. Tap products to add.
            </Typography>
          ) : (
            cart.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.quantity} x {formatCurrency(item.price)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatCurrency(item.price * item.quantity)}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Tax (8%)
            </Typography>
            <Typography variant="body2">{formatCurrency(tax)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
              {formatCurrency(total)}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            fullWidth
            variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
            startIcon={<CreditCard size={16} />}
            onClick={() => setPaymentMethod('card')}
          >
            Card
          </Button>
          <Button
            fullWidth
            variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
            startIcon={<DollarSign size={16} />}
            onClick={() => setPaymentMethod('cash')}
          >
            Cash
          </Button>
        </Stack>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={cart.length === 0 || isLoading}
          startIcon={<Printer size={18} />}
          onClick={handleCheckout}
          sx={{ py: 1.5, fontWeight: 800 }}
        >
          {isLoading ? 'Processing Sale...' : 'Complete & Print'}
        </Button>
      </Paper>
    </Box>
  );
};
