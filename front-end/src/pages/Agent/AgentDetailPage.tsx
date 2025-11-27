import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Paper,
  CircularProgress,
  Chip,
  Button,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';
import {
  getPublicAgentInfo,
  getAgentProperties,
  getAgentReviews,
} from '../../services/publicAgent.service';
import type { AgentInfoResponse, AgentProperty, AgentReview } from '../../types/AgentDetail';
import useTitle from '@/hooks/useTitle';
import { getLanguage } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';

const AgentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['agentDetail']);
  const lang = getLanguage() as 'vi' | 'en';
  const navigate = useNavigate();

  const [agentInfo, setAgentInfo] = useState<AgentInfoResponse | null>(null);
  const [properties, setProperties] = useState<AgentProperty[]>([]);
  const [reviews, setReviews] = useState<AgentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});

  useTitle(agentInfo ? `${agentInfo.agent.fullName} - ${t('agentDetail:pageTitle')}` : t('agentDetail:pageTitle'));

  useEffect(() => {
    const fetchAgentData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [infoData, propertiesData, reviewsData] = await Promise.all([
          getPublicAgentInfo(id),
          getAgentProperties(id),
          getAgentReviews(id),
        ]);

        setAgentInfo(infoData);
        setProperties(propertiesData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching agent data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [id]);

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/detail/${propertyId}`);
  };

  const handlePrevImage = (e: React.MouseEvent, propertyId: string, totalImages: number) => {
    e.stopPropagation();
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleNextImage = (e: React.MouseEvent, propertyId: string, totalImages: number) => {
    e.stopPropagation();
    setImageIndexes(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages
    }));
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!agentInfo) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" textAlign="center">
          {t('agentDetail:agentNotFound')}
        </Typography>
      </Container>
    );
  }

  const { agent, stats } = agentInfo;
  const totalProperties = stats.sold_properties + stats.active_listings;

  return (
    <Box sx={{ bgcolor: '#1a1d29', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            mb: 3, 
            bgcolor: '#252836',
            borderRadius: 3,
          }}
        >
          <Box 
            display="flex" 
            alignItems="flex-start" 
            gap={{ xs: 2, md: 3 }} 
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <Avatar
              src={agent.avatar || '/defaultUser.png'}
              alt={agent.fullName}
              sx={{ 
                width: { xs: 60, md: 80 }, 
                height: { xs: 60, md: 80 } 
              }}
            />

            <Box flex={1} minWidth={{ xs: '100%', sm: 250 }}>
              <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color="white"
                  sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
                >
                  {agent.fullName}
                </Typography>
                <CheckCircleIcon sx={{ color: '#4ade80', fontSize: { xs: 20, md: 28 } }} />
              </Box>

              <Typography 
                variant="body1" 
                color="rgba(255,255,255,0.7)" 
                mb={1}
                sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
              >
                {agent.email}
              </Typography>

              <Chip 
                label={t('broker')} 
                size="small" 
                sx={{ 
                  bgcolor: '#667eea', 
                  color: 'white',
                  fontWeight: 600,
                  mb: 2
                }} 
              />

              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography 
                  variant="h5" 
                  fontWeight="bold" 
                  color="white"
                  sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
                >
                  {totalProperties}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="rgba(255,255,255,0.6)"
                  sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                >
                  {t('listings')}
                </Typography>
              </Box>
            </Box>

            {agent.phone && (
              <Button
                variant="contained"
                startIcon={<LocalPhoneIcon />}
                sx={{
                  bgcolor: '#3b82f6',
                  color: 'white',
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 1.5 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 600,
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: '#2563eb',
                  },
                }}
              >
                {agent.phone}
              </Button>
            )}
          </Box>
        </Paper>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Left */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper 
              sx={{ 
                bgcolor: '#252836', 
                borderRadius: 3, 
                p: { xs: 2, md: 3 },
                minHeight: { xs: '300px', md: '400px' }
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={{ xs: 2, md: 3 }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="white"
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  {t('propertiesSold')} ({stats.sold_properties})
                </Typography>
              </Box>

              {properties.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  {properties.map((property) => {
                    const currentImageIndex = imageIndexes[property._id] || 0;
                    const hasMultipleImages = property.images.length > 1;
                    
                    return (
                      <Card
                        key={property._id}
                        sx={{
                          display: 'flex',
                          bgcolor: '#1a1d29',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                        }}
                        onClick={() => handlePropertyClick(property._id)}
                      >
                        <Box sx={{ 
                          position: 'relative', 
                          width: { xs: 100, sm: 120 }, 
                          height: { xs: 100, sm: 120 },
                          flexShrink: 0
                        }}>
                          <Box
                            component="img"
                            src={property.images[currentImageIndex] || '/defaultHome.png'}
                            alt={property.title[lang]}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          
                          {hasMultipleImages && (
                            <>
                              <IconButton
                                onClick={(e) => handlePrevImage(e, property._id, property.images.length)}
                                sx={{
                                  position: 'absolute',
                                  left: 4,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  bgcolor: 'rgba(0,0,0,0.5)',
                                  color: 'white',
                                  width: 24,
                                  height: 24,
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                  },
                                }}
                                size="small"
                              >
                                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                              
                              <IconButton
                                onClick={(e) => handleNextImage(e, property._id, property.images.length)}
                                sx={{
                                  position: 'absolute',
                                  right: 4,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  bgcolor: 'rgba(0,0,0,0.5)',
                                  color: 'white',
                                  width: 24,
                                  height: 24,
                                  '&:hover': {
                                    bgcolor: 'rgba(0,0,0,0.7)',
                                  },
                                }}
                                size="small"
                              >
                                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                              </IconButton>

                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 4,
                                  right: 4,
                                  bgcolor: 'rgba(0,0,0,0.6)',
                                  color: 'white',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.7rem',
                                }}
                              >
                                {currentImageIndex + 1}/{property.images.length}
                              </Box>
                            </>
                          )}
                        </Box>

                        <CardContent sx={{ flex: 1, py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="bold" 
                            color="white"
                            gutterBottom
                            noWrap
                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                          >
                            {property.title[lang]}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            color="rgba(255,255,255,0.6)" 
                            gutterBottom
                            noWrap
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            {property.address[lang]}
                          </Typography>

                          <Typography 
                            variant="h6" 
                            color="#ef4444" 
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '0.875rem', sm: '1.125rem' } }}
                          >
                            {new Intl.NumberFormat('vi-VN').format(property.price)} ₫
                          </Typography>

                          {property.area && (
                            <Typography 
                              variant="caption" 
                              color="rgba(255,255,255,0.6)"
                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                            >
                              {property.area} m²
                            </Typography>
                          )}
                        </CardContent>

                        <Box 
                          sx={{ 
                            position: 'relative',
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'flex-start',
                            p: 1
                          }}
                        >
                          <Chip
                            label={averageRating > 0 ? averageRating.toFixed(1) : '5.0'}
                            size="small"
                            sx={{
                              bgcolor: '#3b82f6',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body1" color="rgba(255,255,255,0.6)" textAlign="center">
                  {t('agentDetail:noProperties')}
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper 
              sx={{ 
                bgcolor: '#252836', 
                borderRadius: 3, 
                p: { xs: 2, md: 3 },
                minHeight: { xs: '300px', md: '400px' }
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                color="white" 
                mb={{ xs: 2, md: 3 }}
                sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
              >
                {t('customerReviews')}
              </Typography>

              {reviews.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={2}>
                  {reviews.map((review) => (
                    <Card
                      key={review._id}
                      sx={{
                        bgcolor: '#1a1d29',
                        p: 2,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Avatar
                          src={review.user_id.avatar || '/defaultUser.png'}
                          alt={review.user_id.fullName}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Box flex={1}>
                          <Typography variant="subtitle2" fontWeight="bold" color="white">
                            {review.user_id.fullName}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i} 
                                sx={{ 
                                  fontSize: 16, 
                                  color: i < review.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)' 
                                }} 
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>

                      <Typography 
                        variant="body2" 
                        color="rgba(255,255,255,0.8)"
                        sx={{ mb: 1 }}
                      >
                        {review.comment}
                      </Typography>

                      <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        {new Date(review.createdAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US')}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="rgba(255,255,255,0.6)" textAlign="center">
                  {t('noReviewsYet')}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AgentDetailPage;
