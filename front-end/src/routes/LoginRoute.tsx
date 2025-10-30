import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import theme from "../theme";

const LoginRoute = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default LoginRoute;
