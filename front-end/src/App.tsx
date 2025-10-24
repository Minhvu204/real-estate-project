import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom"
import SearchPage from "./pages/SearchPage/SearchPage";
import LoginRoute from "./routes/LoginRoute";
import AdminRoute from "./routes/AdminRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);

  return (
    <>

      <LoginRoute></LoginRoute>
      {/* <AdminRoute></AdminRoute> */}
      {search}
      {propertyDetail}

    </>
  )
}

export default App
