import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import toast from 'react-hot-toast';

export const CustomerWishlistPage: React.FC = () => {
  const { items } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();

  const handleMoveToCart = (prod: any) => {
    dispatch(addToCart({ id: prod.id, name: prod.name, price: prod.price, image: prod.image || '', quantity: 1 }));
    dispatch(toggleWishlist(prod));
    toast.success(`${prod.name} moved to cart`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 4 }}>
        My Saved Wishlist ({items.length} Items)
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Your wishlist is currently empty. Explore our products and click the heart icon to save items!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map((prod) => (
            <Grid key={prod.id} item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <CardMedia component="img" height="180" image={prod.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'} alt={prod.name} />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{prod.name}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB', mt: 1 }}>${prod.price}</Typography>
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
    </Container>
  );
};
