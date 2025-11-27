import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import { Navigate } from "react-router-dom";
import NotificationsPage from "../components/common/notification/NotificationPage";
import RegisterPage from "../pages/SearchPage/registerPage";

export const LoginRoute = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/home", element: <HomePage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/notifications", element: <NotificationsPage /> },
];