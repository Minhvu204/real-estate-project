// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import { ProfileLayout } from "./pages/Profile/ProfileLayout";
import { PersonalInfo } from "./pages/Profile/PersonalInfo";
import { ChangePassword } from "./pages/Profile/ChangePassword";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<Navigate to="info" />} />
              <Route path="info" element={<PersonalInfo />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false}
            pauseOnFocusLoss draggable  pauseOnHover  theme="colored"
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
