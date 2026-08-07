import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Rating,
  LinearProgress,
  Button,
  Avatar,
  Chip,
  Divider,
  TextField,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Star, ThumbsUp, MessageSquarePlus, CheckCircle2, User } from 'lucide-react';
import {
  useGetProductReviewsQuery,
  useSubmitProductReviewMutation,
  useMarkReviewHelpfulMutation,
} from '../../api/catalogApi';
import { useAppSelector } from '../../store/hooks';
import toast from 'react-hot-toast';

interface ProductReviewsSectionProps {
  productId: number | string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ productId }) => {
  const { data: reviewData, isLoading } = useGetProductReviewsQuery(productId);
  const [submitReview, { isLoading: submitting }] = useSubmitProductReviewMutation();
  const [markHelpful] = useMarkReviewHelpfulMutation();

  const { user } = useAppSelector((state) => state.auth);

  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newCustomerName, setNewCustomerName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );

  const reviewsInfo = reviewData?.data || {
    reviews: [],
    count: 0,
    averageRating: 5.0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  };

  const { reviews, count, averageRating, ratingBreakdown } = reviewsInfo;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter your review feedback');
      return;
    }

    try {
      await submitReview({
        productId,
        rating: newRating,
        title: newTitle.trim() || 'Customer Review',
        comment: newComment.trim(),
        customerName: newCustomerName.trim() || 'Valued Customer',
      }).unwrap();

      toast.success('Thank you! Your review has been published.');
      setNewTitle('');
      setNewComment('');
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit review. Please try again.');
    }
  };

  const handleHelpfulClick = async (reviewId: number) => {
    try {
      await markHelpful(reviewId).unwrap();
      toast.success('Marked review as helpful!');
    } catch (err) {
      toast.error('Unable to register vote.');
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 3 }}>
        Customer Ratings & Reviews
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        {/* Rating Breakdown Card */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: '#E2E8F0', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {averageRating.toFixed(1)}
                </Typography>
                <Rating value={averageRating} precision={0.1} readOnly size="small" sx={{ mt: 0.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Based on {count} verified review{count !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ flexGrow: 1 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const starCount = ratingBreakdown?.[star] || 0;
                  const percentage = count > 0 ? (starCount / count) * 100 : 0;
                  return (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                      <Typography variant="caption" sx={{ minWidth: 40, fontWeight: 700 }}>
                        {star} Stars
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4, bgcolor: '#F1F5F9' }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24, textAlign: 'right' }}>
                        {starCount}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<MessageSquarePlus size={18} />}
              onClick={() => setShowForm(!showForm)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {showForm ? 'Cancel Review' : 'Write a Customer Review'}
            </Button>
          </Paper>
        </Grid>

        {/* Submit Review Form */}
        {showForm && (
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" component="form" onSubmit={handleSubmit} sx={{ p: 3, borderRadius: 3, borderColor: '#2563EB', bgcolor: '#F8FAFC' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#0F172A' }}>
                Write Your Verified Product Review
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Your Rating</Typography>
                <Rating
                  value={newRating}
                  onChange={(_, val) => setNewRating(val || 5)}
                  size="large"
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Your Name"
                    fullWidth
                    size="small"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Review Headline / Title"
                    fullWidth
                    size="small"
                    placeholder="e.g. Excellent quality product!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Detailed Review Feedback"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe what you liked or disliked about this product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                Submit Review
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Reviews List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#F8FAFC' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#64748B' }}>
              No reviews submitted yet for this product.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Be the first valued customer to write a review!
            </Typography>
          </Paper>
        ) : (
          reviews.map((rev: any) => (
            <Card key={rev.id} variant="outlined" sx={{ borderRadius: 3, borderColor: '#E2E8F0', boxShadow: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#2563EB', width: 38, height: 38, fontSize: '0.9rem', fontWeight: 800 }}>
                      {(rev.customerName?.[0] || 'C').toUpperCase()}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          {rev.customerName || 'Verified Customer'}
                        </Typography>
                        {rev.verifiedPurchase && (
                          <Chip
                            icon={<CheckCircle2 size={12} />}
                            label="Verified Buyer"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>

                  <Rating value={Number(rev.rating)} precision={0.5} readOnly size="small" />
                </Box>

                {rev.title && (
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1.5, mb: 0.5, color: '#0F172A' }}>
                    {rev.title}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6, mb: 2 }}>
                  {rev.comment}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    startIcon={<ThumbsUp size={14} />}
                    onClick={() => handleHelpfulClick(rev.id)}
                    sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Helpful ({rev.helpfulCount || 0})
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};
