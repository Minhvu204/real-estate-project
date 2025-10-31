
import AdminRoute from "./routes/AdminRoute";
import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";
import { RegisterRoute } from "./routes/RegisterRoute";

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);
  const updateProfileRoutes = useRoutes(UpdateProfileRoute);
  const registerRoutes = useRoutes(RegisterRoute);

  return (
    <>
      <AdminRoute>
      </AdminRoute>
      <LoginRoute></LoginRoute >
      {search}
      {updateProfileRoutes}
      {propertyDetail}
      {registerRoutes}
    </>
  )
}

export default App;
