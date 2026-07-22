import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Card, CardMedia, CardContent, CardActions, Rating, Chip } from '@mui/material';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../api/catalogApi';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
  const { data: productData } = useGetProductsQuery({ limit: 8 });
  const dispatch = useAppDispatch();

  const products = productData?.data?.products || [
    { id: 1, name: 'Wireless Noise-Canceling Headphones', price: 249.99, rating: 4.8, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: 2, name: 'Ergonomic Executive Mesh Office Chair', price: 389.00, rating: 4.9, category: 'Furniture', image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500' },
    { id: 3, name: 'Smart Fitness Tracker & Heart Rate Watch', price: 129.50, rating: 4.6, category: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 4, name: 'Ultra-Slim Mechanical Gaming Keyboard', price: 159.00, rating: 4.7, category: 'Gaming', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' },
  ];

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image || '', quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (product: any) => {
    dispatch(toggleWishlist(product));
    toast.success('Wishlist updated');
  };

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{ bgcolor: '#0F172A', color: '#FFFFFF', py: 10, px: 2, borderRadius: { xs: 0, md: 4 }, mx: { xs: 0, md: 4 }, my: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="SUMMER BIG TECH DISCOUNTS - UP TO 40% OFF" color="primary" sx={{ fontWeight: 800, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Next-Gen Retail Electronics & Essentials
              </Typography>
              <Typography variant="h6" sx={{ color: '#94A3B8', fontWeight: 400, mb: 4 }}>
                Browse verified products, fast shipping dispatch, and 100% secure checkout powered by Comzilo.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button component={Link} to="/products" variant="contained" color="primary" size="large" endIcon={<ArrowRight size={18} />} sx={{ py: 1.5, px: 3, fontWeight: 700, borderRadius: 2 }}>
                  Shop All Catalog
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Bar */}
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Truck size={32} color="#2563EB" />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Express Shipping</Typography>
                <Typography variant="body2" color="text.secondary">Free delivery on orders over $99</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShieldCheck size={32} color="#10B981" />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>100% Secure Checkout</Typography>
                <Typography variant="body2" color="text.secondary">Encrypted payment gateway protection</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <RotateCcw size={32} color="#8B5CF6" />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>30-Day Money Back</Typography>
                <Typography variant="body2" color="text.secondary">Hassle-free product return policy</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Products Grid */}
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            Featured Products
          </Typography>
          <Button component={Link} to="/products" endIcon={<ArrowRight size={16} />}>
            View All Products
          </Button>
        </Box>

        <Grid container spacing={3}>
          {products.map((prod: any) => (
            <Grid key={prod.id} item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                    alt={prod.name}
                  />
                  <Button
                    onClick={() => handleToggleWishlist(prod)}
                    sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, p: 1, bgcolor: '#FFFFFF', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  >
                    <Heart size={18} color="#DC2626" />
                  </Button>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {prod.category || 'Retail Store'}
                  </Typography>
                  <Typography
                    component={Link}
                    to={`/products/${prod.id}`}
                    variant="subtitle1"
                    sx={{ fontWeight: 700, display: 'block', textDecoration: 'none', color: '#0F172A', mt: 0.5, mb: 1, '&:hover': { color: '#2563EB' } }}
                  >
                    {prod.name}
                  </Typography>
                  <Rating value={prod.rating || 5} precision={0.5} size="small" readOnly />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB', mt: 1 }}>
                    ${prod.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart size={16} />}
                    onClick={() => handleAddToCart(prod)}
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
