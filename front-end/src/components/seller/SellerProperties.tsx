import type { Property } from '../../types/Property';
import React, { useEffect, useState } from 'react';
import { getAllProperties } from '../../services/propertyService';
import { getUser } from '../../utils/storage';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import { Pagination, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ButtonLanguage from '../common/ButtonLanguage';
import { getLanguage } from '../../utils/storage';
import type { Lang } from '../../utils/storage';

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
                const response = await getAllProperties();
                console.log("Data return is ", response);
                setProperties(response || []);
            } catch (error) {
                console.log("Cannot fetch properties for this role", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (properties.length === 0) return <div>Không có bất động sản nào.</div>;
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProperties = properties.slice(startIndex, endIndex);

    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return (
        <>
            <ButtonLanguage></ButtonLanguage>
            <Grid container spacing={3} alignItems="stretch">
                {currentProperties.map((p) => (
                    <Grid key={p._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                maxWidth: 345,
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.03)' },
                            }}
                        >
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={p.images?.[0] || '/defaultHome.png'}
                                    alt={p.title.en}
                                    sx={{
                                        height: 200,
                                        width: '100%',
                                        objectFit: 'cover',
                                        borderBottom: '1px solid #eee',
                                    }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" className='text-blue-500'>
                                        {p.title[currentLanguage]}
                                        {p.title[currentLanguage]}
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {p.address[currentLanguage]}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('price', { ns: 'properties' })}: {p.price.toLocaleString()} VNĐ
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('status', { ns: 'properties' })}: {p.status}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions className='m-3'>
                                <Button component={Link} to={`/properties/${p._id}`}
                                    size="small" variant='outlined' color="primary">
                                    {t('insideProperty.viewDetail')}
                                </Button>
                                <Button
                                    size="small" variant='contained' color="primary">
                                    {t('insideProperty.assignAgent')}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

            </Grid>
            <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    color="primary"
                    onChange={handleChangePage}
                />
            </Stack>
        </>
    );
};

export default SellerProperties;
