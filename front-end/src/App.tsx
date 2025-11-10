import { useRoutes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { LoginRoute } from "./routes/LoginRoute";
import { AdminRoute } from "./routes/AdminRoute";
import { SellerRoute } from "./routes/SellerRoute";
import { BuyerRoute } from "./routes/BuyerRoute";
import { AgentRoute } from "./routes/AgentRoute";

import theme from "./theme";
import './i18n/i18n';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const allRoutes = [
    ...LoginRoute,
    ...BuyerRoute,
    ...AdminRoute,
    ...SellerRoute,
    ...AgentRoute,

  ];

  const routing = useRoutes(allRoutes);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        {!isAdmin && <Navbar />}
        {routing}
        {/* <ToastContainer position="top-right" autoClose={2000} theme="colored" /> */}
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
