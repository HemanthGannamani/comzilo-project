import React, { useState } from 'react';
import { Box, Container, Typography, Grid, TextField, Card, CardMedia, CardContent, CardActions, Button, Rating, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../api/catalogApi';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import toast from 'react-hot-toast';

export const ProductListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');

  const { data } = useGetProductsQuery({ search });
  const dispatch = useAppDispatch();

  const products = data?.data?.products || [
    { id: 1, name: 'Wireless Noise-Canceling Headphones', price: 249.99, rating: 4.8, category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: 2, name: 'Ergonomic Executive Mesh Office Chair', price: 389.00, rating: 4.9, category: 'Furniture', image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500' },
    { id: 3, name: 'Smart Fitness Tracker & Heart Rate Watch', price: 129.50, rating: 4.6, category: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 4, name: 'Ultra-Slim Mechanical Gaming Keyboard', price: 159.00, rating: 4.7, category: 'Gaming', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' },
  ];

  const handleAddToCart = (prod: any) => {
    dispatch(addToCart({ id: prod.id, name: prod.name, price: prod.price, image: prod.image || '', quantity: 1 }));
    toast.success(`${prod.name} added to cart`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
          Storefront Catalog & Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore all available retail items, electronics, apparel, and hardware.
        </Typography>
      </Box>

      {/* Filter and Sort Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Filter catalog products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search size={18} style={{ marginRight: 8 }} />,
            },
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products Grid */}
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
                  onClick={() => {
                    dispatch(toggleWishlist(prod));
                    toast.success('Wishlist updated');
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8, minWidth: 0, p: 1, bgcolor: '#FFFFFF', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  <Heart size={18} color="#DC2626" />
                </Button>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {prod.category || 'Retail Item'}
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
  );
};
