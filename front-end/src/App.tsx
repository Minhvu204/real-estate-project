
import { useRoutes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { AdminRoute } from "./routes/AdminRoute";
import { LoginRoute } from "./routes/LoginRoute";
import { BuyerRoute } from "./routes/BuyerRoute";
import { SellerRoute } from "./routes/SellerRoute";
import { AgentRoute } from "./routes/AgentRoute";

import theme from "./theme";
import './i18n/i18n';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const allRoutes = [
    ...LoginRoute,
    ...BuyerRoute,
    ...SellerRoute,
    ...AdminRoute,
    ...AgentRoute,

  ];

  const routing = useRoutes(allRoutes);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {!isAdmin && <Navbar />}
        {routing}
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
