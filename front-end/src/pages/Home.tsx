import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, Grid, Link, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const HomePage: React.FC = () => {
    const images = [
        "https://cdnmedia.baotintuc.vn/Upload/GBzr0rzEkBb6ua36h4mJ9w/files/2022/09/P3.jpg",
        "https://watermark.lovepik.com/photo/40191/1085.jpg_wh1200.jpg",
        "https://static1.cafeland.vn/cafelandData/upload/tintuc/thitruong/2022/10/tuan-03/shizen-nami-1666176055.jpg",
    ];

    const [current, setCurrent] = useState(0);

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + images.length) % images.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % images.length);
    };

    return (
        <>
            <Box sx={{ position: "relative", height: 400, overflow: "hidden" }}>
                {images.map((img, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: index === current ? "relative" : "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            transition: "opacity 1s ease-in-out",
                            opacity: index === current ? 1 : 0,
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Container>
                            <Typography variant="h3" color="white" sx={{ fontWeight: 700 }}>
                                Your home, your future
                            </Typography>
                            <Typography variant="h6" color="white" sx={{ mt: 1 }}>
                                Find the best properties around you
                            </Typography>
                        </Container>
                    </Box>
                ))}

                {/* Left arrow */}
                <IconButton
                    onClick={prevSlide}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: 16,
                        transform: "translateY(-50%)",
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                    }}
                >
                    <ArrowBackIosNewIcon />
                </IconButton>

                {/* Right arrow */}
                <IconButton
                    onClick={nextSlide}
                    sx={{
                        position: "absolute",
                        top: "50%",
                        right: 16,
                        transform: "translateY(-50%)",
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.5)" },
                    }}
                >
                    <ArrowForwardIosIcon />
                </IconButton>

                {/* Dots */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                    }}
                >
                    {images.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: idx === current ? "white" : "rgba(255,255,255,0.5)",
                                cursor: "pointer",
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/*Footer */}
            <Box sx={{ background: "#414141", color: "white", mt: 2, pt: 4, pb: 2 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={2}>

                        {/* Column 1 */}
                        <Grid item xs={12} md={4}>
                            <Typography variant="h5" fontWeight={700}>Dwello</Typography>
                            <Typography sx={{ mt: 1, color: "gray" }}>
                                Find your perfect home with comfort and trust.
                            </Typography>
                        </Grid>

                        {/* Column 2 */}
                        <Grid item xs={6} md={2}>
                            <Typography fontWeight={600}>Explore</Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                <Link color="gray" underline="hover">Buy</Link>
                                <Link color="gray" underline="hover">Rent</Link>
                                <Link color="gray" underline="hover">Sell</Link>
                                <Link color="gray" underline="hover">Agents</Link>
                            </Stack>
                        </Grid>

                        {/* Column 3 */}
                        <Grid item xs={6} md={2}>
                            <Typography fontWeight={600}>Support</Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                <Link color="gray" underline="hover">Help Center</Link>
                                <Link color="gray" underline="hover">Privacy Policy</Link>
                                <Link color="gray" underline="hover">Terms of Use</Link>
                            </Stack>
                        </Grid>

                        {/* Column 4 */}
                        <Grid item xs={12} md={4}>
                            <Typography fontWeight={600}>Follow Us</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <IconButton sx={{ color: "white" }} href="https://www.facebook.com/lopkstla16"><FacebookIcon /></IconButton>
                                <IconButton sx={{ color: "white" }} href="http://instagram.com/t.v.anh1910/"><InstagramIcon /></IconButton>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Bottom line */}
                    <Box sx={{ borderTop: "1px solid #333", mt: 4, pt: 2, textAlign: "center", color: "gray" }}>
                        © 2025 Dwello — All rights reserved
                    </Box>
                </Container>
            </Box>

        </>
    );
};

export default HomePage;
