import HomePage from "../pages/SearchPage/HomePage";
import RegisterPage from "../pages/SearchPage/registerPage";
import Navbar from "../components/Navbar";

export const RegisterRoute = [
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <HomePage />
      </>
    ),
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
];