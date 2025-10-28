import AdminDashboard from '../components/admin/AdminDashboard';
import HomeList from '../components/admin/HomeList';
import DataTable from '../components/admin/UserList';
import { Route, Navigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import GradientTooltip from '../components/admin/Dashboard';
import UserDetails from '../components/admin/UserDetails';
import AdminProtectedRoute from './AdminProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
const AdminRoute = () => {
    return (
        <AuthProvider>
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
        </AuthProvider>

    )
}

export default AdminRoute