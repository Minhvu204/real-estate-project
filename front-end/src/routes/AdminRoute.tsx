import AdminDashboard from '../components/admin/AdminDashboard';
import HomeList from '../components/admin/HomeList';
import DataTable from '../components/admin/UserList';
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import GradientTooltip from '../components/admin/Dashboard';
const AdminRoute = () => {
    return (
        <Routes>
            <Route path="/admin/*" element={<AdminDashboard />}>
                <Route path="dashboard" element={<GradientTooltip />} />
                <Route path="users" element={<DataTable />} />
                <Route path="properties" element={<HomeList />} />
                <Route index element={<HomeList />} /> {/* /admin → redirect hoặc default */}
            </Route>
        </Routes>
    )
}

export default AdminRoute