import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Rating, Chip, Paper, Divider, TextField } from '@mui/material';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { PodStudioModal } from '../../components/pod/PodStudioModal';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../api/catalogApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { formatPrice } from '../../utils/currencyService';
import { getProductImage } from '../../utils/productImageService';
import toast from 'react-hot-toast';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const { data } = useGetProductByIdQuery(id || 1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const product = data?.data || data;
  const isWishlisted = product ? wishlistItems.some((i: any) => String(i.id) === String(product.id)) : false;

  const [isPodModalOpen, setIsPodModalOpen] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    const isPod = product.productType === 'print_on_demand' || product.productTypeRecord?.code === 'print_on_demand';
    if (isPod) {
      setIsPodModalOpen(true);
      toast.success('🎨 Please configure your Front, Back, Left, and Right side artwork in the Studio!');
      return;
    }
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: getProductImage(product), quantity }));
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const handleAddToCartCustomized = (customizedItem: any) => {
    dispatch(
      addToCart({
        id: customizedItem.productId,
        name: customizedItem.name,
        price: customizedItem.price,
        image: getProductImage(product),
        quantity: 1,
        customization: customizedItem.customization,
      } as any)
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const imgUrl = getProductImage(product);
    dispatch(toggleWishlist({ ...product, image: imgUrl }));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={6}>
        {/* Product Image Gallery */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 4, overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Box
              component="img"
              src={product ? getProductImage(product) : ''}
              alt={product?.name || 'Product'}
              sx={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 3 }}
            />
          </Paper>
        </Grid>

        {/* Product Specs & Purchase Options */}
        <Grid item xs={12} md={6}>
          <Chip label={product?.category || 'Retail Product'} color="primary" size="small" sx={{ fontWeight: 700, mb: 1.5 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
            {product?.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Rating value={product?.rating || 4.8} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">(48 customer reviews)</Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB', mb: 2 }}>
            {formatPrice(product?.price || 0)}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product?.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            SKU Code: <span style={{ color: '#64748B', fontWeight: 500 }}>{product?.sku || 'SKU-MAIN-01'}</span>
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 3 }}>
            Availability: <Chip label="IN STOCK" color="success" size="small" sx={{ ml: 1, fontWeight: 700 }} />
          </Typography>

          {/* Quantity Selector & Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
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
              variant={isWishlisted ? 'contained' : 'outlined'}
              color="error"
              onClick={handleToggleWishlist}
              sx={{ p: 1.5, minWidth: 0, borderRadius: 2 }}
            >
              <Heart size={20} fill={isWishlisted ? '#DC2626' : 'none'} />
            </Button>
          </Box>

          {/* LUMISE & PACKDORA 3D CUSTOMIZE BUTTON */}
          <Box sx={{ mb: 4 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Sparkles size={20} />}
              onClick={() => setIsPodModalOpen(true)}
              sx={{
                py: 2,
                fontWeight: 800,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                },
              }}
            >
              Customize & Design (2D Studio + 3D Packaging)
            </Button>
          </Box>

          {/* POD STUDIO MODAL */}
          <PodStudioModal
            isOpen={isPodModalOpen}
            onClose={() => setIsPodModalOpen(false)}
            product={product}
            onAddToCartCustomized={handleAddToCartCustomized}
          />

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
