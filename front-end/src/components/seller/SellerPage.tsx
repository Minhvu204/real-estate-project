
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Collapse,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Home as HomeIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    ExpandLess,
    ExpandMore,
    SupervisorAccount as SupervisorAccountIcon,
    ShoppingBag as ShoppingBagIcon,
    Hail as HailIcon,
    RealEstateAgent as RealEstateAgentIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../../utils/storage";

const drawerWidth = 240;

export default function SellerPage() {
    const location = useLocation();
    // const user = getUser();
    const isActive = (path: string) => location.pathname + location.search === path;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [userListOpen, setUserListOpen] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };
    const handleDrawerTransitionEnd = () => setIsClosing(false);
    const handleDrawerToggle = () => !isClosing && setMobileOpen(!mobileOpen);
    const handleUserListToggle = () => setUserListOpen(!userListOpen);

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/seller/dashboard" },
        { text: "My properties", icon: <HomeIcon />, path: "/seller/properties" },

    ];


    const bottomItems = [{ text: "Logout", icon: <LogoutIcon />, path: "/login" }];

    const drawer = (
        <div>
            <List>
                {menuItems.map((item) => (
                    <Box key={item?.text}>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item?.path}
                                onClick={item?.text === "List User" ? handleUserListToggle : undefined}
                                sx={{
                                    borderRadius: "12px",
                                    mx: 1,
                                    mt: 1,
                                    color: "#1e293b",
                                    bgcolor: isActive(item?.path) ? "#dbeafe" : "inherit",
                                    "&:hover": {
                                        bgcolor: "#bfdbfe",
                                        transform: "scale(1.02)",
                                        transition: "all 0.2s ease",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: "#2563eb" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>

                    </Box>
                ))}
            </List>

            <Divider />
            <List sx={{ mt: 2 }}>
                {bottomItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            sx={{
                                color: "#dc2626",
                                borderRadius: "12px",
                                mx: 1,
                                "&:hover": { bgcolor: "#fee2e2" },
                            }}
                        >
                            <ListItemIcon sx={{ color: "#dc2626" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
                    width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { xs: 0, sm: `${drawerWidth}px` },
                    boxShadow: 2,
                }}
            >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                {/* <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Hello, <strong>{user.fullName}</strong>
                    </Typography> */}

            </AppBar>


            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            bgcolor: "#f8fafc",
                            boxShadow: 3,
                        },
                    }}
                >
                    {drawer}
                </Drawer>


                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            bgcolor: "#f8fafc",
                            borderRight: "1px solid #e2e8f0",
                            boxShadow: 2,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: "#f1f5f9",
                    minHeight: "100vh",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
