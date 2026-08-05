import React, { useState } from 'react';
import { Container, Grid, Box, Typography, Button, Rating, Chip, Paper, Divider, TextField, Alert } from '@mui/material';
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../api/catalogApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { formatPrice } from '../../utils/currencyService';
import { getProductImage } from '../../utils/productImageService';
import { VariantSelector, VariantItem } from '../../components/products/VariantSelector';
import toast from 'react-hot-toast';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null);

  const { data } = useGetProductByIdQuery(id || 1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const product = data?.data || data;
  const isWishlisted = product ? wishlistItems.some((i: any) => String(i.id) === String(product.id)) : false;

  const hasVariants = product?.variants && Array.isArray(product.variants) && product.variants.length > 0;

  // Live Price and Image updates based on Selected Variant vs Simple Product
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
  const comparePrice = selectedVariant ? selectedVariant.compareAtPrice : product?.compareAtPrice;
  const currentSku = selectedVariant ? selectedVariant.sku : product?.sku || 'SKU-MAIN-01';
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product?.stockQuantity ?? 50;

  const primaryVariantImage = selectedVariant?.images?.[0]?.imageUrl;
  const displayImage = primaryVariantImage || getProductImage(product);

  const handleAddToCart = () => {
    if (!product) return;

    if (hasVariants && !selectedVariant) {
      toast.error('Please select a valid variant combination before adding to cart');
      return;
    }

    if (currentStock <= 0) {
      toast.error('Selected variant is currently out of stock');
      return;
    }

    const itemPayload = {
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: selectedVariant ? `${product.name} (${selectedVariant.sku})` : product.name,
      price: currentPrice,
      image: displayImage,
      quantity,
    };

    dispatch(addToCart(itemPayload));
    toast.success(`${quantity}x ${itemPayload.name} added to cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (!hasVariants || selectedVariant) navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    dispatch(toggleWishlist({ ...product, image: displayImage }));
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
              src={displayImage}
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

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#2563EB' }}>
              {formatPrice(currentPrice)}
            </Typography>
            {comparePrice && comparePrice > currentPrice && (
              <Typography variant="h5" sx={{ textDecoration: 'line-through', color: '#94A3B8' }}>
                {formatPrice(comparePrice)}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {product?.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {/* DYNAMIC VARIANT SELECTOR */}
          {hasVariants && (
            <VariantSelector
              productId={product.id}
              variants={product.variants}
              onSelectVariant={(variant) => setSelectedVariant(variant)}
            />
          )}

          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
            SKU Code: <span style={{ color: '#64748B', fontWeight: 500 }}>{currentSku}</span>
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 700, mb: 3 }}>
            Availability:{' '}
            {currentStock > 10 ? (
              <Chip label="IN STOCK" color="success" size="small" sx={{ ml: 1, fontWeight: 700 }} />
            ) : currentStock > 0 ? (
              <Chip label={`ONLY ${currentStock} LEFT`} color="warning" size="small" sx={{ ml: 1, fontWeight: 700 }} />
            ) : (
              <Chip label="OUT OF STOCK" color="error" size="small" sx={{ ml: 1, fontWeight: 700 }} />
            )}
          </Typography>

          {/* Quantity Selector & Add to Cart */}
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
              disabled={currentStock <= 0}
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
              disabled={currentStock <= 0}
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
              <Heart size={20} fill={isWishlisted ? '#FFFFFF' : 'none'} />
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
