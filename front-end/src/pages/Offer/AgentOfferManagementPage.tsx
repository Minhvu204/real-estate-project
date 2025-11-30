import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AgentOfferList } from '../../components/Offer/AgentOfferList';
import { OfferService } from '../../services/offerService';
import type { Offer, OfferStatus } from '../../types/Offer';
import AuthContext from '../../context/AuthContext';
import { getStatusColorConfig } from '../../utils/offerUtils';
import { getLanguage } from '../../utils/storage';

interface PropertyGroup {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  offers: Offer[];
}

const AgentOfferManagementPage: React.FC = () => {
  const { t } = useTranslation('offerManagement');
  const lang = getLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OfferStatus | undefined>();
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'list'>('list');
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    if (isMobile && viewMode !== 'list') {
      setViewMode('list');
    }
  }, [isMobile, viewMode]);

  useEffect(() => {
    if (!state.loading && (!state.user || state.user.role?.toLowerCase() !== 'agent')) {
      toast.error(t('error.noPermission'));
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }
  }, [state.loading, state.user, navigate]);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        setIsLoading(true);
        const statusParam = searchParams.get('status') as OfferStatus | null;
        const propertyIdParam = searchParams.get('property_id');
        
        const filters: { status?: OfferStatus; property_id?: string } = {};
        if (statusParam) filters.status = statusParam;
        if (propertyIdParam) filters.property_id = propertyIdParam;
        
        const data = await OfferService.getAgentOffers(filters);
        setOffers(Array.isArray(data) ? data : []);
        setStatusFilter(filters.status);
      } catch (error: any) {
        console.error('Load offers error:', error);
        toast.error(error?.message || t('error.loadFailed'));
        setOffers([]); 
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!state.loading) {
      loadOffers();
    }
  }, [searchParams, state.loading]);

  const openForwardDialog = (offerId: string) => {
    setSelectedOfferId(offerId);
    setForwardDialogOpen(true);
  };

  const closeForwardDialog = () => {
    setForwardDialogOpen(false);
    setSelectedOfferId('');
  };

  const handleForwardOffer = async (offerId: string) => {
    try {
      await OfferService.forwardOffer(offerId);
      toast.success(t('agentList.forwardSuccess'));
      
      const statusParam = searchParams.get('status') as OfferStatus | null;
      const propertyIdParam = searchParams.get('property_id');
      const filters: { status?: OfferStatus; property_id?: string } = {};
      if (statusParam) filters.status = statusParam;
      if (propertyIdParam) filters.property_id = propertyIdParam;
      
      const updatedOffers = await OfferService.getAgentOffers(filters);
      setOffers(Array.isArray(updatedOffers) ? updatedOffers : []);
    } catch (error: any) {
      console.error('Forward offer error:', error);
      toast.error(error?.message || t('agentList.forwardError'));
    }
  };

  const handleForwardOfferInTable = async () => {
    try {
      setProcessing(true);
      await OfferService.forwardOffer(selectedOfferId);
      toast.success(t('agentList.forwardSuccess'));
      
      const statusParam = searchParams.get('status') as OfferStatus | null;
      const propertyIdParam = searchParams.get('property_id');
      const filters: { status?: OfferStatus; property_id?: string } = {};
      if (statusParam) filters.status = statusParam;
      if (propertyIdParam) filters.property_id = propertyIdParam;
      
      const updatedOffers = await OfferService.getAgentOffers(filters);
      setOffers(Array.isArray(updatedOffers) ? updatedOffers : []);
      closeForwardDialog();
    } catch (error: any) {
      console.error('Forward offer error:', error);
      toast.error(error?.message || t('agentList.forwardError'));
    } finally {
      setProcessing(false);
    }
  };

  const handleFilterChange = (status?: OfferStatus) => {
    setStatusFilter(status);
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    setSearchParams(params);
  };

  const handleViewDetail = (offerId: string) => {
    navigate(`/agent/offers/${offerId}`);
  };

  const togglePropertyExpanded = (propertyId: string) => {
    const newExpanded = new Set(expandedProperties);
    if (newExpanded.has(propertyId)) {
      newExpanded.delete(propertyId);
    } else {
      newExpanded.add(propertyId);
    }
    setExpandedProperties(newExpanded);
  };

  const groupedOffers: PropertyGroup[] = offers.reduce((acc, offer) => {
    const property = typeof offer.property_id === 'object' ? offer.property_id : null;
    if (!property) return acc;

    const propertyId = property._id;
    const propertyTitle = typeof property.title === 'object' 
      ? property.title[lang] 
      : property.title || 'Unknown Property';
    const propertyAddress = typeof property.address === 'object'
      ? property.address[lang]
      : property.address || '';

    const existingGroup = acc.find(g => g.propertyId === propertyId);
    if (existingGroup) {
      existingGroup.offers.push(offer);
    } else {
      acc.push({
        propertyId,
        propertyTitle,
        propertyAddress,
        offers: [offer],
      });
    }
    return acc;
  }, [] as PropertyGroup[]);

  return (
    <Container
      sx={{
        mt: isMobile ? 2 : 4,
        mb: isMobile ? 3 : 4,
        px: isMobile ? 2 : 0,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography 
            variant={isMobile ? 'h5' : 'h4'} 
            fontWeight="bold"
            sx={{ 
              color: '#1976D2',
              letterSpacing: '-0.02em',
            }}
          >
            {t('agentList.title')}
          </Typography>
          <Typography 
            variant="body1" 
            mt={1}
            sx={{ 
              color: '#424242',
              fontSize: '0.95rem',
            }}
          >
            {t('agentList.subtitle')}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: 2,
          mb: isMobile ? 2 : 3,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: isMobile ? 'stretch' : 'flex-start' }}>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                size="small"
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('list')}
                size="small"
              >
                List
              </Button>
            </Box>
          )}
        </Box>
        
        <FormControl
          sx={{ minWidth: isMobile ? '100%' : 200 }}
          size={isMobile ? 'small' : 'medium'}
        >
          <InputLabel>{t('list.filter.filterByStatus')}</InputLabel>
          <Select
            value={statusFilter || 'all'}
            label={t('list.filter.filterByStatus')}
            onChange={(e) => handleFilterChange(e.target.value === 'all' ? undefined : (e.target.value as OfferStatus))}
            MenuProps={{
              PaperProps: {
                sx: { maxHeight: 360 },
              },
            }}
          >
            <MenuItem value="all">{t('list.filter.all')}</MenuItem>
            <MenuItem value="pending">{t('list.status.pending')}</MenuItem>
            <MenuItem value="forwarded_to_seller">{t('list.status.forwarded_to_seller')}</MenuItem>
            <MenuItem value="seller_reviewing">{t('list.status.seller_reviewing')}</MenuItem>
            <MenuItem value="accepted">{t('list.status.accepted')}</MenuItem>
            <MenuItem value="rejected">{t('list.status.rejected')}</MenuItem>
            <MenuItem value="cancelled">{t('list.status.cancelled')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {viewMode === 'table' ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            borderRadius: 2,
            overflowX: 'auto',
          }}
        >
          <Table sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', border: 0, borderBottom: 1, borderColor: 'primary.dark' }}>Property</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', border: 0, borderBottom: 1, borderColor: 'primary.dark' }}>Buyer</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', border: 0, borderBottom: 1, borderColor: 'primary.dark' }}>Proposed Amount</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', border: 0, borderBottom: 1, borderColor: 'primary.dark' }}>Status</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', border: 0, borderBottom: 1, borderColor: 'primary.dark' }}>Created At</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', border: 0, borderBottom: 1, borderColor: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : groupedOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">{t('agentList.noOffers')}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                groupedOffers.map((group) => (
                  <React.Fragment key={group.propertyId}>
                    <TableRow 
                      sx={{ 
                        bgcolor: 'grey.100',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.200' },
                      }}
                      onClick={() => togglePropertyExpanded(group.propertyId)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small">
                            {expandedProperties.has(group.propertyId) ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                          <Box>
                            <Typography fontWeight="bold">{group.propertyTitle}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {group.propertyAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={`${group.offers.length} offers`}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell colSpan={4} />
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
                        <Collapse in={expandedProperties.has(group.propertyId)} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2 }}>
                            {group.offers.map((offer) => {
                              const buyer = typeof offer.buyer_id === 'object' ? offer.buyer_id : null;
                              const statusColors = getStatusColorConfig(offer.status);
                              const canForward = offer.status === 'pending';

                              return (
                                <TableRow key={offer._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                  <TableCell />
                                  <TableCell>
                                    {buyer ? (
                                      <Box>
                                        <Typography variant="body2" fontWeight="medium">
                                          {buyer.fullName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {buyer.email}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Typography variant="body2" color="text.secondary">
                                        Unknown Buyer
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                      {new Intl.NumberFormat('vi-VN').format(offer.amount)} ₫
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={t(`list.status.${offer.status}`)}
                                      size="small"
                                      sx={{
                                        backgroundColor: statusColors.backgroundColor,
                                        color: statusColors.color,
                                        border: `1px solid ${statusColors.borderColor}`,
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleViewDetail(offer._id);
                                        }}
                                      >
                                        View
                                      </Button>
                                      {canForward && (
                                        <Button
                                          size="small"
                                          variant="contained"
                                          color="primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openForwardDialog(offer._id);
                                          }}
                                        >
                                          {t('agentList.forward')}
                                        </Button>
                                      )}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <AgentOfferList
          offers={offers}
          onForwardOffer={handleForwardOffer}
          isLoading={isLoading}
          onViewDetail={handleViewDetail}
        />
      )}

      <Dialog 
        open={forwardDialogOpen} 
        onClose={closeForwardDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Forward Offer
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to forward this offer to the seller?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForwardDialog} color="inherit" disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleForwardOfferInTable} 
            color="primary" 
            variant="contained"
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Confirm Forward'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AgentOfferManagementPage;

