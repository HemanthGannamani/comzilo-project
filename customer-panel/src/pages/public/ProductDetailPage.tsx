import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Rating, Chip, Paper, Divider, TextField } from '@mui/material';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../api/catalogApi';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { formatPrice } from '../../utils/currencyService';
import toast from 'react-hot-toast';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useGetProductByIdQuery(id || 1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = data?.data || data;

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image || '', quantity }));
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={6}>
        {/* Product Image Gallery */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box
              component="img"
              src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
              alt={product.name}
              sx={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 3 }}
            />
          </Paper>
        </Grid>

        {/* Product Specs & Purchase Options */}
        <Grid item xs={12} md={6}>
          <Chip label={product.category || 'Retail Product'} color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Rating value={product.rating || 4.8} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">(48 customer reviews)</Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', mb: 2 }}>
            {formatPrice(product?.price || 0)}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            SKU Code: <span style={{ color: '#64748B', fontWeight: 500 }}>{product.sku || 'SKU-MAIN-01'}</span>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 3 }}>
            Availability: <Chip label="IN STOCK" color="success" size="small" sx={{ ml: 1, fontWeight: 700 }} />
          </Typography>

          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <TextField
              type="number"
              label="Qty"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              sx={{ width: 90 }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              sx={{ py: 1.5, px: 3, fontWeight: 700, borderRadius: 2 }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={handleBuyNow}
              sx={{ py: 1.5, px: 3, fontWeight: 700, borderRadius: 2 }}
            >
              Buy Now
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                dispatch(toggleWishlist(product));
                toast.success('Wishlist updated');
              }}
              sx={{ p: 1.5, minWidth: 0, borderRadius: 2 }}
            >
              <Heart size={20} />
            </Button>
          </Box>

          <Paper sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Truck size={20} color="#2563EB" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Free shipping dispatch within 24 hours</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShieldCheck size={20} color="#10B981" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>2-Year manufacturer warranty included</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <RotateCcw size={20} color="#8B5CF6" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>30-Day return guarantee</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
