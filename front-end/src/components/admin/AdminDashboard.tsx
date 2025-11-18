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
    CategoryOutlined as CategoryOutlinedIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../../utils/storage";
import ButtonLanguage from "../common/ButtonLanguage";

const drawerWidth = 240;

export default function AdminDashboard() {
  const location = useLocation();
  const user = getUser();
  const isActive = (path: string) =>
    location.pathname + location.search === path;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [userListOpen, setUserListOpen] = useState(false);
  const [userPropertyOpen, setUserPropertyOpen] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };
  const handleDrawerTransitionEnd = () => setIsClosing(false);
  const handleDrawerToggle = () => !isClosing && setMobileOpen(!mobileOpen);
  const handleUserListToggle = () => setUserListOpen(!userListOpen);
  const handlePropertyListToggle = () => setUserPropertyOpen(!userPropertyOpen);

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
        { text: "List User", icon: <PersonIcon />, path: "/admin/users" },
        { text: "List Properties", icon: <HomeIcon />, path: "/admin/properties" },
        { text: "Taxonomies", icon: <CategoryOutlinedIcon />, path: "/admin/taxonomies" },
    ];

  const listUserItem = [
    {
      text: "Admin",
      icon: <SupervisorAccountIcon />,
      path: "/admin/users?role=admin",
    },
    {
      text: "Buyer",
      icon: <ShoppingBagIcon />,
      path: "/admin/users?role=buyer",
    },
    { text: "Seller", icon: <HailIcon />, path: "/admin/users?role=seller" },
    {
      text: "Agent",
      icon: <RealEstateAgentIcon />,
      path: "/admin/users?role=agent",
    },
  ];

  const listPropertyItem = [
    {
      text: "Available",
      icon: <SupervisorAccountIcon />,
      path: "/admin/properties?status=available",
    },
    {
      text: "Approved",
      icon: <ShoppingBagIcon />,
      path: "/admin/properties?status=approved",
    },
    {
      text: "Pending",
      icon: <HailIcon />,
      path: "/admin/properties?status=pending",
    },
    {
      text: "Rejected",
      icon: <RealEstateAgentIcon />,
      path: "/admin/properties?status=rejected",
    },
  ];

  const bottomItems = [
    { text: "Logout", icon: <LogoutIcon />, path: "/login" },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: "#f0f4ff" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Akaya Telivigala, cursive",
            color: "#2563eb",
            fontWeight: "bold",
            width: "100%",
            textAlign: "center",
          }}
        >
          Dwello
        </Typography>
      </Toolbar>
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          color: "#64748b",
          fontStyle: "italic",
          mb: 1,
        }}
      >
        Your Home Your Future
      </Typography>

      <Divider />
      <List>
        {menuItems.map((item) => (
          <Box key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={
                  item.text === "List User"
                    ? handleUserListToggle
                    : item.text === "List Properties"
                    ? handlePropertyListToggle
                    : undefined
                }
                sx={{
                  borderRadius: "12px",
                  mx: 1,
                  mt: 1,
                  color: "#1e293b",
                  bgcolor: isActive(item.path) ? "#dbeafe" : "inherit",
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
                {item.text === "List User" &&
                  (userListOpen ? <ExpandLess /> : <ExpandMore />)}
                {item.text === "List Properties" &&
                  (userListOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>

            {item.text === "List User" && (
              <Collapse in={userListOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {listUserItem.map((sub) => (
                    <ListItemButton
                      key={sub.text}
                      component={Link}
                      to={sub.path}
                      sx={{
                        pl: 6,
                        borderRadius: "12px",
                        mx: 1,
                        mt: 0.5,
                        color: "#1e293b",
                        bgcolor: isActive(sub.path) ? "#e0f2fe" : "inherit",
                        "&:hover": {
                          bgcolor: "#bae6fd",
                          transform: "scale(1.02)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: "#0284c7" }}>
                        {sub.icon}
                      </ListItemIcon>
                      <ListItemText primary={sub.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
            {item.text === "List Properties" && (
              <Collapse in={userPropertyOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {listPropertyItem.map((sub) => (
                    <ListItemButton
                      key={sub.text}
                      component={Link}
                      to={sub.path}
                      sx={{
                        pl: 6,
                        borderRadius: "12px",
                        mx: 1,
                        mt: 0.5,
                        color: "#1e293b",
                        bgcolor: isActive(sub.path) ? "#e0f2fe" : "inherit",
                        "&:hover": {
                          bgcolor: "#bae6fd",
                          transform: "scale(1.02)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: "#0284c7" }}>
                        {sub.icon}
                      </ListItemIcon>
                      <ListItemText primary={sub.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
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
              <ListItemIcon sx={{ color: "#dc2626" }}>{item.icon}</ListItemIcon>
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
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    boxShadow: 2,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Hello, <strong>{user.fullName}</strong>
                    </Typography>
                    <ButtonLanguage />
                </Toolbar>
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

        {/* Permanent Drawer */}
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
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
