import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Outlet } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import Collapse from "@mui/material/Collapse";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HailIcon from "@mui/icons-material/Hail";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
const drawerWidth = 240;
const paddingLeft = 150;

const AdminDashboard = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuItem = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/admin/dashboard",
    },
    {
      text: "List User",
      icon: <PersonIcon />,
      path: "/admin/users",
    },
    {
      text: "List Properties",
      icon: <HomeIcon />,
      path: "/admin/properties",
    },
  ];
  const bottemItem = [
    {
      text: "Logout",
      icon: <LogoutIcon />,
      path: "/",
    },
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
    {
      text: "Seller",
      icon: <HailIcon />,
      path: "/admin/users?role=seller",
    },
    {
      text: "Agent",
      icon: <RealEstateAgentIcon />,
      path: "/admin/users?role=agent",
    },
  ];

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Drawer bên trái */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#475569",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontFamily: "Akaya Telivigala, cursive" }}
          className="text-center py-2 text-blue-500 font-bold"
        >
          Dwello
        </Typography>
        <Typography
          variant="h6"
          className="text-center text-xl text-gray-300 pb-3 italic"
        >
          Your Home Your Future
        </Typography>
        <Divider></Divider>
        <List>
          {menuItem.map((item) => (
            <Box key={item.text}>
              <ListItem disablePadding className="text-white">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={item.text === "List User" ? handleClick : undefined}
                  className={`rounded-lg ${
                    location.search.includes(item.path.split("=")[1])
                      ? "bg-blue-500!"
                      : ""
                  }`}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {item.text === "List User" ? (
                    open ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : null}
                </ListItemButton>
              </ListItem>

              {item.text === "List User" && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {listUserItem.map((i) => (
                      <ListItemButton
                        key={i.text}
                        component={Link}
                        to={i.path}
                        className={`rounded-lg ${
                          location.pathname.startsWith(i.path)
                            ? "bg-blue-500!"
                            : ""
                        }`}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>{i.icon}</ListItemIcon>
                        <ListItemText primary={i.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>

        <Divider />
        <List className="pt-4">
          {bottemItem.map((item) => (
            <ListItem key={item.text} disablePadding className="text-white">
              <ListItemButton
                component={Link}
                to={item.path}
                className="rounded-lg"
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text}></ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Nội dung chính bên phải */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingLeft: `${paddingLeft}px`,
          bgcolor: "#fff",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
