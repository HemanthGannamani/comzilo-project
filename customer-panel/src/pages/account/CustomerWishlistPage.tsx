import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { CustomerAccountLayout } from '../../components/layout/CustomerAccountLayout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { formatPrice } from '../../utils/currencyService';
import { getProductImage } from '../../utils/productImageService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const CustomerWishlistPage: React.FC = () => {
  const { items } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMoveToCart = (prod: any) => {
    const imgUrl = getProductImage(prod);
    dispatch(addToCart({ id: prod.id, name: prod.name, price: prod.price, image: imgUrl, quantity: 1 }));
    dispatch(toggleWishlist(prod));
    toast.success(`${prod.name} moved to cart`);
  };

  return (
    <CustomerAccountLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            My Saved Wishlist ({items.length} Items)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Save items to purchase later or move directly to cart.
          </Typography>
        </Box>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
          <Typography color="text.secondary">
            Your wishlist is currently empty. Explore our catalog and click the heart icon to save products!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((prod) => (
            <Grid key={prod.id} item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={getProductImage(prod)}
                  alt={prod.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>{prod.name}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB', mt: 1 }}>{formatPrice(prod.price)}</Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                  <Button variant="contained" size="small" fullWidth startIcon={<ShoppingCart size={16} />} onClick={() => handleMoveToCart(prod)}>
                    Move to Cart
                  </Button>
                  <Button color="error" size="small" onClick={() => dispatch(toggleWishlist(prod))}>
                    <Trash2 size={18} />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </CustomerAccountLayout>
  );
};
