import { useRoutes } from "react-router-dom";
import LoginRoute from "./routes/LoginRoute";
import { SearchPropertiesRoute } from "./routes/SearchPropertiesRoute";
import { UpdateProfileRoute } from "./routes/UpdateProfileRoute";

function App() {
  const searchRoutes = useRoutes(SearchPropertiesRoute);
  const updateProfileRoutes = useRoutes(UpdateProfileRoute);

  return (
    <>
      <LoginRoute />
      {searchRoutes}
      {updateProfileRoutes}
    </>
  );
}

export default App;
