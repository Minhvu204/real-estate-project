import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Chip,
  InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getPublicAgents } from '../../services/publicAgent.service';
import { getAllPropertiesPublic, getAllCities } from '../../services/propertyService';
import type { Agent } from '../../types/Agent';
import type { Property } from '../../types/Property';
import type { City } from '../../types/City';
import useTitle from '@/hooks/useTitle';
import { getLanguage } from '@/utils/storage';

interface AgentWithLocation extends Agent {
  cities: Set<string>;
  propertyCount: number;
}

const AgentListPage = () => {
  const { t } = useTranslation('agentList');
  const navigate = useNavigate();
  const lang = getLanguage() as 'vi' | 'en';
  
  const [agents, setAgents] = useState<AgentWithLocation[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useTitle(t('pageTitle'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [agentsData, propertiesData, citiesData] = await Promise.all([
          getPublicAgents(),
          getAllPropertiesPublic(),
          getAllCities()
        ]);

        const agentLocationMap = new Map<string, { cities: Set<string>, count: number }>();
        
        propertiesData.forEach((property: Property) => {
          if (property.agent_id && typeof property.agent_id === 'object' && '_id' in property.agent_id) {
            const agentId = property.agent_id._id;
            if (!agentLocationMap.has(agentId)) {
              agentLocationMap.set(agentId, { cities: new Set(), count: 0 });
            }
            const agentData = agentLocationMap.get(agentId)!;
            
            if (property.city_id && typeof property.city_id === 'object' && '_id' in property.city_id) {
              agentData.cities.add(property.city_id._id);
            }
            agentData.count++;
          }
        });

        const agentsWithLocation: AgentWithLocation[] = agentsData.map((agent: Agent) => ({
          ...agent,
          cities: agentLocationMap.get(agent._id)?.cities || new Set(),
          propertyCount: agentLocationMap.get(agent._id)?.count || 0
        }));

        setAgents(agentsWithLocation);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      // Filter by search term (name or email)
      const matchesSearch = searchTerm === '' || 
        agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = selectedCity === 'all' || agent.cities.has(selectedCity);

      return matchesSearch && matchesCity;
    });
  }, [agents, searchTerm, selectedCity]);

  const handleAgentClick = (agentId: string) => {
    navigate(`/agents/${agentId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary.main"
            sx={{ 
              mb: 1.5, 
              fontSize: { xs: '1.5rem', md: '2rem' },
              lineHeight: 1.3
            }}
          >
            {t('title')}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', md: '1rem' },
              lineHeight: 1.5,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            {t('subtitle')}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2,
            bgcolor: 'white',
            p: 3,
            borderRadius: 2,
            boxShadow: 1
          }}
        >
          <TextField
            fullWidth
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
          
          <TextField
            select
            label={t('filterByLocation')}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            sx={{ minWidth: { xs: '100%', md: 250 } }}
          >
            <MenuItem value="all">{t('allLocations')}</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city._id} value={city._id}>
                {city.city_name[lang]}
              </MenuItem>
            ))}
          </TextField>

          {(searchTerm || selectedCity !== 'all') && (
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
              }}
              sx={{ minWidth: { xs: '100%', md: 'auto' } }}
            >
              {t('clearFilters')}
            </Button>
          )}
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t('found')} <strong>{filteredAgents.length}</strong> {t('agents')}
        </Typography>

        {filteredAgents.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              bgcolor: 'white', 
              borderRadius: 2,
              boxShadow: 1 
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('noAgentsFound')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('noResultsDescription')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredAgents.map((agent) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={agent._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(102, 126, 234, 0.15)',
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => handleAgentClick(agent._id)}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      p: 2.5,
                      flex: 1,
                      '&:last-child': { pb: 2.5 }
                    }}
                  >
                    <Avatar
                      src={agent.avatar || '/defaultUser.png'}
                      alt={agent.fullName}
                      sx={{
                        width: 90,
                        height: 90,
                        border: '3px solid',
                        borderColor: 'primary.main',
                        mb: 0.5,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                      }}
                    />

                    <Chip
                      label="AGENT"
                      color="primary"
                      size="small"
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 0.5,
                        px: 1,
                        height: 24,
                        fontSize: '0.7rem',
                        boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)',
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      align="center"
                      sx={{
                        minHeight: 50,
                        width: '100%',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 0.5
                      }}
                    >
                      {agent.fullName}
                    </Typography>

                    <Box sx={{ minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                      {agent.propertyCount > 0 && (
                        <Chip
                          label={`${agent.propertyCount} ${t('properties')}`}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                            borderWidth: 1.5,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.75, mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }}>
                        <EmailIcon 
                          fontSize="small" 
                          sx={{ color: '#1976d2', fontSize: '18px' }} 
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          sx={{ flex: 1, fontSize: '0.875rem' }}
                        >
                          {agent.email}
                        </Typography>
                      </Box>

                      {agent.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, width: '100%' }}>
                          <PhoneIcon 
                            fontSize="small" 
                            sx={{ color: '#2e7d32', fontSize: '18px' }} 
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: '0.875rem' }}
                          >
                            {agent.phone}
                          </Typography>
                        </Box>
                      )}

                      {agent.cities.size > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, width: '100%' }}>
                          <LocationOnIcon 
                            fontSize="small" 
                            sx={{ color: '#ed6c02', fontSize: '18px', mt: 0.25 }} 
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5, display: 'block' }}>
                              {t('activeAreas')}:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {Array.from(agent.cities).slice(0, 3).map((cityId) => {
                                const city = cities.find(c => c._id === cityId);
                                return city ? (
                                  <Chip
                                    key={cityId}
                                    label={city.city_name[lang]}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.7rem',
                                      cursor: 'pointer',
                                      '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                        borderColor: 'primary.main'
                                      }
                                    }}
                                  />
                                ) : null;
                              })}
                              {agent.cities.size > 3 && (
                                <Chip
                                  label={`+${agent.cities.size - 3}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: 'primary.light',
                                      color: 'white',
                                      borderColor: 'primary.main'
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 'auto',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.25,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                          boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                          transform: 'translateY(-2px)',
                        },
                        '&:active': {
                          transform: 'translateY(0)',
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgentClick(agent._id);
                      }}
                    >
                      {t('viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AgentListPage;

