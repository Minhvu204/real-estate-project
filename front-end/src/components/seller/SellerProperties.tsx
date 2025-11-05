import type { Property } from '../../types/Property';
import React, { useEffect, useState } from 'react';
import { getAllProperties } from '../../services/propertyService';
import { getUser } from '../../utils/storage';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ButtonLanguage from '../common/ButtonLanguage';
import { getLanguage } from '../../utils/storage';
import type { Lang } from '../../utils/storage';
import { Button, Card, CardContent, CardMedia, Chip, Grid, Pagination, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { getPropertiesByAgentOrSeller } from '../../services/propertyService';

const SellerProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const { t } = useTranslation(['home', 'properties']);
    const currentLanguage: Lang = getLanguage();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                if (!user) return;
                const response = await getPropertiesByAgentOrSeller();
                setProperties(response || []);
            } catch (error) {
                console.log("Cannot fetch properties for this role", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (loading)
        return <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>;

    if (properties.length === 0)
        return <div className="text-center text-gray-600 mt-10">Không có bất động sản nào.</div>;

    const totalPages = Math.ceil(properties.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentProperties = properties.slice(startIndex, startIndex + itemsPerPage);

    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (

        <Box className="p-6 bg-gray-50 min-h-screen">
            <Box className="flex flex-wrap justify-between items-center mb-6">
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Danh sách Bất Động Sản
                </Typography>
                <ButtonLanguage />
            </Box>

            <Grid container spacing={3}>
                {currentProperties.map((p) => (
                    <Grid size={{ xs: 12, md: 4, sm: 6 }} key={p._id}>
                        <Card

                            sx={{
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.03)' }

                            }}
                        >
                            <CardMedia
                                component="img"
                                height="180"
                                image={p.images?.[0] || '/defaultHome.png'}
                                alt={p.title.en}
                                sx={{
                                    height: { xs: 160, sm: 180, md: 200 },
                                    objectFit: 'cover',
                                }}
                            />
                            <CardContent className="flex flex-col justify-between flex-grow">
                                <Box>
                                    <Box className="flex justify-between items-start mb-2">
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            color="primary.main"
                                            className="line-clamp-2"
                                        >
                                            {p.title[currentLanguage]}
                                        </Typography>
                                        <Chip
                                            label={p.status || 'Đang xử lý'}
                                            color={p.status === 'available' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        className="line-clamp-2 mb-1"
                                    >
                                        {p.address[currentLanguage]}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary" fontWeight="medium">
                                        {t('price', { ns: 'properties' })}: {p.price.toLocaleString()} VNĐ
                                    </Typography>
                                </Box>

                                <Box className="flex gap-2 mt-4">
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        component={Link}
                                        to={`${p._id}`}
                                        sx={{ borderRadius: 2, textTransform: 'none' }}
                                    >
                                        {t('insideProperty.viewDetail')}
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        component={Link}
                                        to={`${p._id}/agents`}
                                        sx={{ borderRadius: 2, textTransform: 'none' }}
                                    >
                                        {t('insideProperty.assignAgent')}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Box className="flex justify-center mt-10">
                <Pagination
                    count={totalPages}
                    page={page}
                    color="primary"
                    onChange={handleChangePage}
                    size="medium"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
};

export default SellerProperties;
