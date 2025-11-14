import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/SearchPage/registerPage";
import NotificationsPage from "../components/common/notification/NotificationPage";

export const LoginRoute = [
  { path: "/", element: <HomePage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/notifications", element: <NotificationsPage /> },
];
