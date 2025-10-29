import AdminDashboard from "../components/admin/AdminDashboard";
import HomeList from "../components/admin/HomeList";
import DataTable from "../components/admin/UserList";
import { Routes, Route, Navigate } from "react-router-dom";
import GradientTooltip from "../components/admin/Dashboard";
import UserDetails from "../components/admin/UserDetails";
import UpdateUser from "../components/admin/userInfor/UpdateUser";
import BlockUser from "../components/admin/userInfor/BlockUser";
import AdminProtectedRoute from "./AdminProtectedRoute";
const AdminRoute = () => {
  return (
    <Routes>
      <Route element={<AdminProtectedRoute></AdminProtectedRoute>}>
        <Route path="/admin/*" element={<AdminDashboard />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<GradientTooltip />} />
          <Route path="users" element={<DataTable />} />
          <Route path="properties" element={<HomeList />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="users/edit/:id" element={<UpdateUser />} />
          <Route path="users/block" element={<BlockUser userId="" />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoute;
