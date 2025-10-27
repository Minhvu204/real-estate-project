<<<<<<< HEAD
import AdminRoute from "./routes/AdminRoute";
import { createBrowserRouter, RouterProvider, useRoutes } from "react-router-dom"
=======
import { useRoutes } from "react-router-dom"
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { PropertyDetailRoute } from "./routes/PropertyDetailRoute"
<<<<<<< HEAD
=======
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";
import { RegisterRoute } from "./routes/RegisterRoute";
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e

function App() {
  const search = useRoutes(SearchPropertiesRoute);
  const propertyDetail = useRoutes(PropertyDetailRoute);
  const updateProfileRoutes = useRoutes(UpdateProfileRoute);
  const registerRoutes = useRoutes(RegisterRoute);

  return (
    <>
<<<<<<< HEAD
      <LoginRoute></LoginRoute>
      <AdminRoute></AdminRoute>
=======
      <AdminRoute />
      <LoginRoute />
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e
      {search}
      {updateProfileRoutes}
      {propertyDetail}
<<<<<<< HEAD
    </>
  )
=======
      {registerRoutes}
    </>
  );
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e
}

export default App;
