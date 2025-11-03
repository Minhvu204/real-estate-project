
import AdminRoute from "./routes/AdminRoute";
import { useRoutes } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";
import { RegisterRoute } from "./routes/RegisterRoute";
import { MyPropertiesRoute } from "./routes/MyPropertiesRoute";

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);
  const updateProfileRoutes = useRoutes(UpdateProfileRoute);
  const registerRoutes = useRoutes(RegisterRoute);
  const myPropertiesRoutes = useRoutes(MyPropertiesRoute);

  return (
    <>
      <AdminRoute>
      </AdminRoute>
      <LoginRoute></LoginRoute >
      {/* <AdminRoute></AdminRoute> */}
      {search}
      {updateProfileRoutes}
      {propertyDetail}
      {registerRoutes}
      {myPropertiesRoutes}
    </>
  )
}

export default App;
