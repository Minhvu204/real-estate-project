// src/pages/Home.tsx
import React from "react";
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";

const HomePage: React.FC = () => {
    return (
        <div>
            <Box sx={{
                height: 400,
                backgroundImage: 'url(https://cdnmedia.baotintuc.vn/Upload/GBzr0rzEkBb6ua36h4mJ9w/files/2022/09/P3.jpg)',
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
            }}>
                <Container>
                    <Typography variant="h3" color="white" sx={{ fontWeight: 700 }}>Your home, your future</Typography>
                    <Typography variant="h6" color="white" sx={{ mt: 1 }}>Find the best properties around you</Typography>
                </Container>
            </Box>

        </div>
    );
};

export default HomePage;
