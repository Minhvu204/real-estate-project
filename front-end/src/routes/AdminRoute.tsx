<<<<<<< HEAD
import AdminDashboard from '../components/admin/AdminDashboard';
import HomeList from '../components/admin/HomeList';
import DataTable from '../components/admin/UserList';
import { Route, Navigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import GradientTooltip from '../components/admin/Dashboard';
import UserDetails from '../components/admin/UserDetails';
import AdminProtectedRoute from './AdminProtectedRoute';
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
                </Route>
            </Route>
        </Routes>
    )
}
=======
import AdminDashboard from "../components/admin/AdminDashboard";
import HomeList from "../components/admin/HomeList";
import DataTable from "../components/admin/UserList";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import GradientTooltip from "../components/admin/Dashboard";
import UserDetails from "../components/admin/UserDetails";
import UpdateUser from "../components/admin/userInfor/UpdateUser";
import BlockUser from "../components/admin/userInfor/BlockUser";
>>>>>>> 323883bbf57c3bcf649faf95975a91161ac87e9e

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />}>
        <Route path="dashboard" element={<GradientTooltip />} />
        <Route path="users" element={<DataTable />} />
        <Route path="properties" element={<HomeList />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/edit/:id" element={<UpdateUser />} />
        <Route path="users/block" element={<BlockUser userId=""/>} />
        <Route index element={<HomeList />} />{" "}
        {/* /admin → redirect hoặc default */}
      </Route>
    </Routes>
  );
};

export default AdminRoute;
