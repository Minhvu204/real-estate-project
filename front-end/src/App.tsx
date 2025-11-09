
import { useRoutes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { AdminRoute } from "./routes/AdminRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { BuyerRoute } from "./routes/BuyerRoute";
import { SellerRoute } from "./routes/SellerRoute";
import { AgentRoute } from "./routes/AgentRoute";
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";
import theme from "./theme";
import './i18n/i18n';
import AssignAgent from "./components/seller/ListAgent";
import ListAgent from "./components/seller/ListAgent";
import { ToastContainer } from "react-toastify";
function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const allRoutes = [
    ...LoginRoute,
    ...BuyerRoute,
    ...SellerRoute,
    ...AdminRoute,
    ...AgentRoute,
    ...UpdateProfileRoute,
  ];

  const routing = useRoutes(allRoutes);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {!isAdmin && <Navbar />}
        {routing}
        <ToastContainer />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
