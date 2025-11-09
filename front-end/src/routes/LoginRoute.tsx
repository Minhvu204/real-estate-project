import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/SearchPage/registerPage";
import { Navigate } from "react-router-dom";

export const LoginRoute = [
    { path: "/", element: <Navigate to="/home" /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/home", element: <HomePage /> },
    { path: "/register", element: <RegisterPage /> },
];