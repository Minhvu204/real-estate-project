<<<<<<< HEAD
import AdminRoute from "./routes/AdminRoute";
import SearchPage from "./pages/searchPage/SearchPage";
=======
import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom"
import SearchPage from "./pages/SearchPage/SearchPage";
import LoginRoute from "./routes/LoginRoute";
import AdminRoute from "./routes/AdminRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"
>>>>>>> 38cc38fa4e4bfe52c8e1ff369eb540f8ad8641bc

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);

  return (
    <>
<<<<<<< HEAD
      <AdminRoute>
      </AdminRoute>
    </>)
=======

      <LoginRoute></LoginRoute>
      {/* <AdminRoute></AdminRoute> */}
      {search}
      {propertyDetail}

    </>
  )
>>>>>>> 38cc38fa4e4bfe52c8e1ff369eb540f8ad8641bc
}

export default App;
