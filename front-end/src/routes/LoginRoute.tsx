import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/SearchPage/registerPage";
import { Navigate } from "react-router-dom";
import NotificationsPage from "../components/common/notification/NotificationPage";

export const LoginRoute = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/notifications", element: <NotificationsPage /> },
];
