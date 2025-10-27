import AdminRoute from "./routes/AdminRoute";
import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom"
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);

  return (
    <>
      <LoginRoute></LoginRoute>
      <AdminRoute></AdminRoute>
      {search}
      {propertyDetail}

    </>
  )
}

export default App;
