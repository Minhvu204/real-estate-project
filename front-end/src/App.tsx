// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={
              <HomePage />
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
