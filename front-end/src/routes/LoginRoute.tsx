import { Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import HomePage from "../pages/Home";
import RegisterPage from "../pages/SearchPage/registerPage";

export const LoginRoute = [
    { path: "/", element: <HomePage /> },
    { path: "/login", element: <LoginPage /> },

    { path: "/register", element: <RegisterPage /> }
];
