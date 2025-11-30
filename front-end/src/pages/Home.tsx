import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, Stack, CardMedia, CardContent, Card, Chip, Button, Menu, MenuItem, Avatar, ListItemAvatar, ListItemText } from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getAllPropertiesPublic } from "../services/propertyService";
import { getPublicAgents } from "../services/publicAgent.service";
import type { Property } from "@/types/Property";
import type { Agent } from "@/types/Agent";
import { getLanguage } from "../utils/storage";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
const HomePage: React.FC = () => {
    const images = [
        "https://cdnmedia.baotintuc.vn/Upload/GBzr0rzEkBb6ua36h4mJ9w/files/2022/09/P3.jpg",
        "https://watermark.lovepik.com/photo/40191/1085.jpg_wh1200.jpg",
        "https://static1.cafeland.vn/cafelandData/upload/tintuc/thitruong/2022/10/tuan-03/shizen-nami-1666176055.jpg",
    ];

    const [current, setCurrent] = useState(0);
    const [properties, setProperties] = useState<Property[]>();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [activeTab, setActiveTab] = useState<'properties' | 'agents'>('properties');
    const currentLanguage = getLanguage();
    const { t } = useTranslation(['home', 'properties']);
    const navigate = useNavigate();

    // Auto slide
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertiesData, agentsData] = await Promise.all([
                    getAllPropertiesPublic(),
                    getPublicAgents()
                ]);
                console.log(propertiesData)
                setProperties(propertiesData);
                setAgents(agentsData);
            } catch (error) {
                console.log("Cannot fetch data", error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAgentMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setActiveTab('agents');
    };

    const handleAgentMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAgentClick = (agentId: string) => {
        navigate(`/agents/${agentId}`);
        handleAgentMenuClose();
    };

    const handlePropertiesTabClick = () => {
        setActiveTab('properties');
        setAnchorEl(null);
    };

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

            {/* Tab Section */}
            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: 2,
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                        pb: 1
                    }}
                >
                    <Button
                        variant={activeTab === 'properties' ? 'contained' : 'outlined'}
                        startIcon={<HomeWorkIcon />}
                        onClick={handlePropertiesTabClick}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: activeTab === 'properties' 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'transparent',
                            border: activeTab === 'properties' ? 'none' : '2px solid',
                            borderColor: activeTab === 'properties' ? 'none' : 'primary.main',
                            color: activeTab === 'properties' ? 'white' : 'primary.main',
                            '&:hover': {
                                background: activeTab === 'properties'
                                    ? 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)'
                                    : 'rgba(102,126,234,0.08)',
                            },
                        }}
                    >
                        Bất động sản nổi bật
                    </Button>

                    <Button
                        variant={activeTab === 'agents' ? 'contained' : 'outlined'}
                        startIcon={<PeopleIcon />}
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={handleAgentMenuClick}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                            background: activeTab === 'agents'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'transparent',
                            border: activeTab === 'agents' ? 'none' : '2px solid',
                            borderColor: activeTab === 'agents' ? 'none' : 'primary.main',
                            color: activeTab === 'agents' ? 'white' : 'primary.main',
                            '&:hover': {
                                background: activeTab === 'agents'
                                    ? 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)'
                                    : 'rgba(102,126,234,0.08)',
                            },
                        }}
                    >
                        Môi giới uy tín
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleAgentMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 350,
                                maxHeight: 500,
                                borderRadius: 2,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            },
                        }}
                        MenuListProps={{
                            sx: {
                                maxHeight: 440,
                                overflow: 'auto',
                                py: 0,
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: '#f1f1f1',
                                    borderRadius: '10px',
                                    margin: '8px 0',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: '#888',
                                    borderRadius: '10px',
                                    '&:hover': {
                                        background: '#555',
                                    },
                                },
                            },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {agents.length} môi giới uy tín
                            </Typography>
                        </Box>
                        {agents.map((agent) => (
                            <MenuItem
                                key={agent._id}
                                onClick={() => handleAgentClick(agent._id)}
                                sx={{
                                    py: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(102,126,234,0.08)',
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        src={agent.avatar || '/defaultUser.png'}
                                        alt={agent.fullName}
                                        sx={{ width: 48, height: 48 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {agent.fullName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            {agent.email}
                                        </Typography>
                                    }
                                />
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Container>

            {/*List property*/}
            <Container maxWidth="xl">
                <Box paddingY={6}>
                <Grid container spacing={3}>
                    {properties?.filter((p) => p.status !== "pending").map((p) => (
                        <Grid size={{ xs: 12, md: 4, sm: 6 }} key={p._id}>
                            <Card
                                component={Link}
                                to={`/property/detail/${p._id}`}
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
                                    height="1"
                                    image={p.images?.[0] || '/defaultHome.png'}
                                    alt={p.title.en}
                                    sx={{
                                        height: { xs: 160, sm: 180, md: 200 },
                                        objectFit: 'cover',
                                    }}
                                />
                                <CardContent className="flex flex-col justify-between ">
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

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            </Container>


            {/*Footer */}
            <Box sx={{ background: "#414141", color: "white", mt: 2, pt: 4, pb: 2 }}>
                <Container maxWidth="xl">
                    <Grid container spacing={2}>

                        {/* Column 1 */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="h5" fontWeight={700}>Dwello</Typography>
                            <Typography sx={{ mt: 1, color: "gray" }}>
                                Find your perfect home with comfort and trust.
                            </Typography>
                        </Grid>

                        {/* Column 2 */}
                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography fontWeight={600}>Explore</Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Buy</Typography>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Rent</Typography>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Sell</Typography>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Agents</Typography>
                            </Stack>
                        </Grid>

                        {/* Column 3 */}
                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography fontWeight={600}>Support</Typography>
                            <Stack spacing={1} sx={{ mt: 1 }}>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Help Center</Typography>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Privacy Policy</Typography>
                                <Typography sx={{ color: "gray", cursor: "pointer" }}>Terms of Use</Typography>
                            </Stack>
                        </Grid>

                        {/* Column 4 */}
                        <Grid size={{ xs: 12, md: 4 }}>
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
