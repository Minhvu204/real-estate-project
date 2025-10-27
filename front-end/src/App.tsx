
import AdminRoute from "./routes/AdminRoute";
import SearchPage from "./pages/searchPage/SearchPage";
import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);

  return (
    <>
      <AdminRoute>
      </AdminRoute>
      <LoginRoute></LoginRoute >
      {/* <AdminRoute></AdminRoute> */}
      {search}
      {propertyDetail}
    </>
  )
}

export default App;
