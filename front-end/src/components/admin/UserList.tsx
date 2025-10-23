import * as React from 'react';
import { DataGrid, renderActionsCell } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from '@mui/material/Select';


const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
    { field: "action", headerName: "Action", width: 100,




     }
];



const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    const baseUrl = "http://localhost:3000"
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`${baseUrl}/users`)
            .then((res) => {
                setRows(res.data);
                setLoading(false);
            }).catch((err) => {
                console.log('Cannot fetch data', err);
            })
    }, [])
    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <h1 className='text-center pr-30 pb-7'>List All Users</h1>
            <DataGrid
                rows={rows}
                columns={columns}
                loading={loading}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}