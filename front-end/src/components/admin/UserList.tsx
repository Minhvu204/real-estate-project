import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../services/userService';
import type { User } from '../../types/Users';
const defaultUser = "/defaultUser.png";


const columns = (navigate: any) => [
    { field: "id", headerName: "ID", width: 180 },
    {
        field: "avatar",
        headerName: "Avatar",
        width: 80,
        renderCell: (params: any) => (
            <img
                src={params.value || defaultUser}
                alt="avatar"
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover"
                }}
            />
        )
    },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 240 },
    { field: "role", headerName: "Role", width: 120 },
    {
        field: "action",
        headerName: "Action",
        width: 120,
        renderCell: () => (
            <>
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => navigate}>
                    View
                </button >
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                    Update
                </button>
            </>
        )
    }
];

export default function DataTable() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role");
    const navigate = useNavigate();

    const [rows, setRows] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const users = await getAllUsers();

                if (role) {
                    setRows(users.filter((u) => u.role === role));
                } else {
                    setRows(users);
                }

            } catch (error) {
                console.error("Cannot fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [role]);

    return (
        <Paper sx={{ height: 500, width: '100%', p: 2 }}>
            <h2 className="text-center pb-4 text-lg font-bold">User Management</h2>

            <DataGrid
                rows={rows}
                columns={columns(navigate)}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}
