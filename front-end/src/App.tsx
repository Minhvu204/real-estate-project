import { useRoutes } from "react-router-dom"
import LoginRoute from "./routes/LoginRoute";
import AdminRoute from "./routes/AdminRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);
  const updateProfileRoutes = useRoutes(UpdateProfileRoute);

  return (
    <>
      <AdminRoute />
      <LoginRoute />
      {search}
      {updateProfileRoutes}
      {propertyDetail}
    </>
  );
}

export default App;
