import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SearchPage from "./pages/searchPage/SearchPage"

const router = createBrowserRouter([{
  path: "/search",
  element: <SearchPage />
},
]);
function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App;
