import { AdminRoute } from "./routes/AdminRoute";
import { useRoutes } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute";
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";
import { RegisterRoute } from "./routes/RegisterRoute";
import { SellerRoute } from "./routes/SellerRoute";
import "./i18n/i18n";

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);
  const updateProfileRoutes = useRoutes(UpdateProfileRoute);
  const registerRoutes = useRoutes(RegisterRoute);
  const adminRoutes = useRoutes(AdminRoute);
  const sellerRoutes = useRoutes(SellerRoute);
  return (
    <>
      {adminRoutes}
      <LoginRoute></LoginRoute>
      {search}
      {updateProfileRoutes}
      {propertyDetail}
      {registerRoutes}
      {sellerRoutes}
    </>
  );
}

export default App;
