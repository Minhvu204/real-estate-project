import type { Property } from '../../types/Property';
import React, { useEffect, useState } from 'react';
import { getUser } from '../../utils/storage';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getLanguage } from '../../utils/storage';
import type { Lang } from '../../utils/storage';
import { Button, Card, CardContent, CardMedia, Chip, Pagination, Typography, TextField, MenuItem } from '@mui/material';
import { Box } from '@mui/material';
import { getPropertiesByAgentOrSeller } from '../../services/propertyService';
import type { Meta } from '../../types/Pagination';

const SellerProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filtered, setFiltered] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();
    const [page, setPage] = useState<Meta>();
    const [itemsPerPage] = useState(6);

    const { t } = useTranslation(['home', 'properties']);
    const currentLanguage: Lang = getLanguage();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                if (!user) return;
                const response = await getPropertiesByAgentOrSeller();
                setProperties(response || []);
                setFiltered(response || []);
                setPage({ currentPage: 1, totalPages: 1, totalItems: response?.length || 0 });
            } catch (error) {
                console.log("Cannot fetch properties for this role", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // 🔍 Apply search + filter
    useEffect(() => {
        let result = [...properties];

        if (search.trim() !== '') {
            result = result.filter(p =>
                p.title[currentLanguage].toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            result = result.filter(p => p.status === statusFilter);
        }

        setFiltered(result);
        setPage(prev => prev ? { ...prev, currentPage: 1 } : prev);

    }, [search, statusFilter, properties]);

    if (loading)
        return <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = ((page?.currentPage || 1) - 1) * itemsPerPage;
    const currentProperties = filtered.slice(startIndex, startIndex + itemsPerPage);

    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        if (!page) return;
        setPage({ ...page, currentPage: value });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <Box className="p-6 bg-gray-50 min-h-screen">
            <Box className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Danh sách Bất Động Sản
                </Typography>

                <Box className="flex gap-3">
                    <TextField
                        label="Tìm kiếm..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <TextField
                        label="Trạng thái"
                        select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ minWidth: 150 }}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                    </TextField>
                </Box>
            </Box>

            {/* LIST */}
            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                }}
            >
                {currentProperties.map((p) => (
                    <Card
                        key={p._id}
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
                                    {t('properties:price')}: {p.price.toLocaleString()} VNĐ
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
                ))}
            </Box>

            {/* Pagination */}
            {filtered.length > 0 && (
                <Box className="flex justify-center mt-10">
                    <Pagination
                        count={totalPages}
                        page={page?.currentPage}
                        color="primary"
                        onChange={handleChangePage}
                        size="medium"
                        shape="rounded"
                    />
                </Box>
            )}
        </Box>
    );
};

export default SellerProperties;
