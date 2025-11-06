import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Chip, Container, Divider, Grid, Paper, Stack, Typography, Avatar, } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState<any>(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev == property.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? property.images.length - 1 : prev - 1
        );
    };

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
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    {/* CAROUSEL */}
                    {property.images && property.images.length > 0 && (
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                height: "100%",
                                overflow: "hidden",
                                borderRadius: 2,
                            }}
                        >
                            {/* IMAGE */}
                            <img
                                src={property.images[currentIndex]}
                                alt="property"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "0.4s ease"
                                }}
                            />

                            {/* ONLY SHOW BUTTONS IF MORE THAN 1 IMAGE */}
                            {property.images.length > 1 && (
                                <>
                                    {/* PREV BTN */}
                                    <Box
                                        onClick={prevSlide}
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: 10,
                                            transform: "translateY(-50%)",
                                            background: "rgba(0,0,0,0.5)",
                                            color: "#fff",
                                            p: "6px 10px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {"<"}
                                    </Box>

                                    {/* NEXT BTN */}
                                    <Box
                                        onClick={nextSlide}
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            right: 10,
                                            transform: "translateY(-50%)",
                                            background: "rgba(0,0,0,0.5)",
                                            color: "#fff",
                                            p: "6px 10px",
                                            borderRadius: "50%",
                                            cursor: "pointer",
                                            userSelect: "none",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {">"}
                                    </Box>

                                    {/* DOTS */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 10,
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            gap: 1
                                        }}
                                    >
                                        {property.images.map((_: any, i: number) => (
                                            <Box
                                                key={i}
                                                onClick={() => setCurrentIndex(i)}
                                                sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    background: currentIndex === i ? "#fff" : "rgba(255,255,255,0.5)",
                                                    cursor: "pointer"
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    )
                    }
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>

                    {/* TITLE + PRICE */}
                    <Typography variant="h4" fontWeight="bold">
                        {property.title}
                    </Typography>

                    <Typography color="text.secondary" >
                        <PlaceIcon sx={{ fontSize: 20, mr: 1 }} />
                        {property.address}
                    </Typography>

                    <Typography variant="h5" color="primary" fontWeight="bold">
                        ${property.price}
                    </Typography>

                    {/* TAGS */}
                    <Stack direction="row" spacing={1}>
                        <Chip label={property.city?.city_name} />
                        <Chip label={property.category?.category_name} />
                        <Chip label={property.type?.type_name} />
                        <Chip label={property.status} color="success" />
                    </Stack>

                    {/* BED - BATH */}
                    <Stack direction="row" spacing={2} mt={1}>
                        <Chip icon={<BedIcon />} label={`${property.bedrooms} Bedrooms`} />
                        <Chip icon={<BathtubIcon />} label={`${property.bathrooms} Bathrooms`} />
                    </Stack>

                    {/* DESCRIPTION */}
                    <Typography variant="h6" fontWeight="bold" mt={2}>
                        Description
                    </Typography>
                    <Typography color="text.secondary">
                        {property.description}
                    </Typography>

                    {/* FEATURES */}
                    {
                        property.features?.length > 0 && (
                            <>
                                <Typography variant="h6" fontWeight="bold" mt={2}>
                                    Features
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {property.features.map((f: any) => (
                                        <Chip key={f._id} label={f.feature_name} variant="outlined" />
                                    ))}
                                </Stack>
                            </>
                        )
                    }

                    {/* OWNER & AGENT */}
                    <Grid container spacing={3} mt={0.1}>
                        <Grid size={{ xs: 12, md: 6 }}>
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

                        <Grid size={{ xs: 12, md: 6 }}>
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
                    {
                        property.coordinates?.lat && property.coordinates?.lng && (
                            <>
                                <Typography variant="h6" fontWeight="bold" mt={2}>
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
                        )
                    }

                    {/* CREATED AT */}
                    <Divider sx={{ mt: 2 }} />
                    <Typography color="text.secondary">
                        Posted on: {new Date(property.createdAt).toLocaleDateString()}
                    </Typography>
                </Grid >
            </Grid >
        </Container >
    );
};

export default PropertyDetail;
