
import { useRoutes, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import { AdminRoute } from "./routes/AdminRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";
import { RegisterRoute } from "./routes/RegisterRoute";
import { SellerRoute } from "./routes/SellerRoute";
import theme from "./theme";
import './i18n/i18n';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const allRoutes = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/home", element: <HomePage /> },
    ...SearchPropertiesRoute,
    ...PropertyDetailRoute,
    ...UpdateProfileRoute,
    ...RegisterRoute,
    ...AdminRoute,
    ...SellerRoute,
  ];

  const routing = useRoutes(allRoutes);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {/* {!isAdmin && <Navbar />} */}
        {routing}
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
