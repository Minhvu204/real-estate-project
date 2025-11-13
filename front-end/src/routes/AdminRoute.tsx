import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../utils/storage";
import AdminDashboard from "../components/admin/AdminDashboard";
import DataTable from "../components/admin/UserList";
import GradientTooltip from "../components/admin/Dashboard";
import UserDetails from "../components/admin/UserDetails";
import UpdateUser from "../components/admin/userInfor/UpdateUser";
import BlockUser from "../components/admin/userInfor/BlockUser";
import ListProperties from "../components/admin/manageProperties/ListProperties";
import ViewDetailProperties from "../components/admin/manageProperties/ViewDetailProperties";
import HideProperties from "../components/admin/manageProperties/HideProperties";

const AdminProtectedRoute = () => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = [
  {
    path: "/admin",
    element: <AdminProtectedRoute />,
    children: [
      {
        element: <AdminDashboard />,
        children: [
          { path: "dashboard", element: <GradientTooltip /> },
          { path: "users", element: <DataTable /> },
          { path: "users/:id", element: <UserDetails /> },
          { path: "users/edit/:id", element: <UpdateUser /> },
          { path: "users/block", element: <BlockUser userId="" /> },
          { path: "properties", element: <ListProperties /> },
          {
            path: "properties/:id",
            element: <ViewDetailProperties />,
          },
          {
            path: "properties/hide",
            element: <HideProperties propertyId="" />,
          },
          {
            path: "manageProperties/:id",
            element: <ViewDetailProperties />,
          },
        ],
      },
    ],
  },
];
