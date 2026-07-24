import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
  Divider,
  Chip,
  InputAdornment,
} from '@mui/material';
import { Search, ShoppingCart, Heart, Filter, PackageX, Globe } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../../api/catalogApi';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { SUPPORTED_COUNTRIES, formatPrice } from '../../utils/currencyService';
import toast from 'react-hot-toast';

interface ProductTypeItem {
  code: string;
  name: string;
}

const ALL_PRODUCT_TYPES: ProductTypeItem[] = [
  { code: 'physical', name: 'Physical Products' },
  { code: 'variable', name: 'Variable Products' },
  { code: 'virtual', name: 'Virtual Products' },
  { code: 'digital', name: 'Digital Products' },
  { code: 'downloadable', name: 'Downloadable Products' },
  { code: 'print_on_demand', name: 'Print On Demand' },
  { code: 'bundle', name: 'Bundle Products' },
  { code: 'service', name: 'Service Products' },
  { code: 'subscription', name: 'Subscription Products' },
  { code: 'gift_card', name: 'Gift Cards' },
  { code: 'rental', name: 'Rental Products' },
];

export const ProductListingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('IN'); // Location-aware country currency

  // Pass selected multi-type filter array to backend MySQL query
  const typesQuery = selectedTypes.length > 0 ? selectedTypes.join(',') : undefined;

  const { data, isLoading } = useGetProductsQuery({
    search,
    types: typesQuery,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });
  const dispatch = useAppDispatch();

  const handleTypeToggle = (typeCode: string) => {
    if (selectedTypes.includes(typeCode)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== typeCode));
    } else {
      setSelectedTypes([...selectedTypes, typeCode]);
    }
  };

  const handleAddToCart = (prod: any) => {
    dispatch(
      addToCart({
        id: prod.id,
        name: prod.name,
        price: Number(prod.price),
        image: prod.media?.[0]?.url || prod.image || '',
        quantity: 1,
      })
    );
    toast.success(`${prod.name} added to cart`);
  };

  // Real database rows only from MySQL (Zero mock / hardcoded fallback)
  const rawProducts = data?.data?.products || data?.data || [];
  const products = Array.isArray(rawProducts) ? rawProducts : [];

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
            Enterprise Storefront Catalog
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse all active products powered by MySQL backend database filtering.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* STEP 2: SIDEBAR FILTER PANEL FOR MULTI-TYPE CHECKBOXES */}
        <Grid item xs={12} md={3}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: '#E2E8F0', sticky: 'top', top: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Filter size={20} color="#2563EB" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                Filter Catalog
              </Typography>
            </Box>
            <Divider sx={{ mb: 2.5 }} />

            {/* PRODUCT TYPES MULTI-SELECT CHECKBOXES */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#334155' }}>
              Product Type
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              {ALL_PRODUCT_TYPES.map((t) => (
                <FormControlLabel
                  key={t.code}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedTypes.includes(t.code)}
                      onChange={() => handleTypeToggle(t.code)}
                      color="primary"
                    />
                  }
                  label={<Typography variant="body2" sx={{ fontSize: 13, fontWeight: selectedTypes.includes(t.code) ? 700 : 400 }}>{t.name}</Typography>}
                />
              ))}
            </FormGroup>

            <Divider sx={{ mb: 2.5 }} />

            {/* PRICE RANGE FILTER */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#334155' }}>
              Price Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Min"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <TextField
                size="small"
                placeholder="Max"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Box>

            {(selectedTypes.length > 0 || minPrice || maxPrice) && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                size="small"
                onClick={() => {
                  setSelectedTypes([]);
                  setMinPrice('');
                  setMaxPrice('');
                }}
                sx={{ mt: 1, fontWeight: 700 }}
              >
                Clear All Filters
              </Button>
            )}
          </Paper>
        </Grid>

        {/* MAIN PRODUCT LISTINGS CONTENT */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search catalog products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 320 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {selectedTypes.length > 0 && (
                <Chip label={`${selectedTypes.length} Product Types Filtered`} color="primary" size="small" sx={{ fontWeight: 700 }} />
              )}
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
                  <MenuItem value="popular">Most Popular</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* STEP 4: EMPTY STATE WHEN ZERO MATCHING PRODUCTS EXIST */}
          {products.length === 0 && !isLoading ? (
            <Paper sx={{ textAlign: 'center', py: 8, border: '1px dashed #CBD5E1', borderRadius: 3, bgcolor: '#F8FAFC' }}>
              <PackageX size={56} color="#94A3B8" />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 700, color: '#334155' }}>
                No Products Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {selectedTypes.length > 0 || search || minPrice || maxPrice
                  ? 'No products match your selected product type filters in MySQL database.'
                  : 'There are currently no active products in the storefront catalog.'}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {products.map((prod: any) => (
                <Grid key={prod.id} item xs={12} sm={6} md={4}>
                  <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={prod.media?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
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
                      {prod.productType && (
                        <Chip
                          label={prod.productType.toUpperCase().replace(/_/g, ' ')}
                          size="small"
                          color="primary"
                          sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 800, fontSize: 10 }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {prod.sku ? `SKU: ${prod.sku}` : 'Retail Item'}
                      </Typography>
                      <Typography
                        component={Link}
                        to={`/products/${prod.id}`}
                        variant="subtitle1"
                        sx={{ fontWeight: 700, display: 'block', textDecoration: 'none', color: '#0F172A', mt: 0.5, mb: 1, '&:hover': { color: '#2563EB' } }}
                      >
                        {prod.name}
                      </Typography>
                      <Rating value={4.8} precision={0.5} size="small" readOnly />

                      {/* LOCATION-AWARE AUTOMATIC CURRENCY FORMATTING */}
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563EB', mt: 1 }}>
                        {formatPrice(prod.price)}
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
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
