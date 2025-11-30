import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/registerPage";
import { Navigate } from "react-router-dom";
import NotificationsPage from "../components/common/notification/NotificationPage";
import AgentDetailPage from "../pages/Agent/AgentDetailPage";

export const LoginRoute = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/home", element: <HomePage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/notifications", element: <NotificationsPage /> },
    { path: "/agents/:id", element: <AgentDetailPage /> },
];