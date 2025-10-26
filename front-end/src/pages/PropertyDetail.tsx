import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Chip, Container, Divider, Grid, Paper, Stack, Typography, Avatar, } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import Carousel from "../components/property/Carousel";


const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/public/properties/${id}`)
            .then(res => res.json())
            .then(data => setProperty(data.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!property) {
        return <Typography textAlign="center" mt={3}>Loading...</Typography>;
    }

    return (
        <Container sx={{ mt: 4, mb: 6 }}>
            {/* CAROUSEL */}
            <Carousel>
                {property.images?.map((img: string, index: number) => (
                    <img
                        key={index}
                        src={img}
                        style={{ width: "100%", height: 450, objectFit: "cover" }}
                    />
                ))}
            </Carousel>

            {/* TITLE + PRICE */}
            <Typography variant="h4" mt={3} fontWeight="bold">
                {property.title}
            </Typography>

            <Typography color="text.secondary" mt={1}>
                <PlaceIcon sx={{ fontSize: 20, mr: 1 }} />
                {property.address}
            </Typography>

            <Typography variant="h5" color="primary" fontWeight="bold" mt={2}>
                ${property.price}
            </Typography>

            {/* TAGS */}
            <Stack direction="row" spacing={1} mt={2}>
                <Chip label={property.city?.city_name} />
                <Chip label={property.category?.category_name} />
                <Chip label={property.type?.type_name} />
                <Chip label={property.status} color="success" />
            </Stack>

            {/* BED - BATH */}
            <Stack direction="row" spacing={2} mt={2}>
                <Chip icon={<BedIcon />} label={`${property.bedrooms} Bedrooms`} />
                <Chip icon={<BathtubIcon />} label={`${property.bathrooms} Bathrooms`} />
            </Stack>

            {/* DESCRIPTION */}
            <Typography variant="h6" fontWeight="bold" mt={4}>
                Description
            </Typography>
            <Typography color="text.secondary" mt={1}>
                {property.description}
            </Typography>

            {/* FEATURES */}
            {property.features?.length > 0 && (
                <>
                    <Typography variant="h6" fontWeight="bold" mt={4}>
                        Features
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                        {property.features.map((f: any) => (
                            <Chip key={f._id} label={f.feature_name} variant="outlined" />
                        ))}
                    </Stack>
                </>
            )}

            {/* OWNER & AGENT */}
            <Grid container spacing={3} mt={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Owner</Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Avatar>{property.owner?.fullName?.charAt(0)}</Avatar>
                            <Box>
                                <Typography fontWeight="bold">{property.owner?.fullName}</Typography>
                                <Typography color="text.secondary">{property.owner?.phone}</Typography>
                                <Typography color="text.secondary">{property.owner?.email}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Agent</Typography>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Avatar>{property.agent?.fullName?.charAt(0)}</Avatar>
                            <Box>
                                <Typography fontWeight="bold">{property.agent?.fullName}</Typography>
                                <Typography color="text.secondary">{property.agent?.phone}</Typography>
                                <Typography color="text.secondary">{property.agent?.email}</Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* MAP */}
            {property.coordinates?.lat && property.coordinates?.lng && (
                <>
                    <Typography variant="h6" fontWeight="bold" mt={4}>
                        Location
                    </Typography>
                    <Box mt={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                        <iframe
                            title="map"
                            src={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=15&output=embed`}
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                        />
                    </Box>
                </>
            )}

            {/* CREATED AT */}
            <Divider sx={{ mt: 4 }} />
            <Typography color="text.secondary" mt={2}>
                Posted on: {new Date(property.createdAt).toLocaleDateString()}
            </Typography>
        </Container>
    );
};

export default PropertyDetail;
