
import { DataGrid } from '@mui/x-data-grid';

import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { getAllProperties } from '../../services/propertyService';
import type { Property } from '../../types/Property';
import { useSearchParams } from 'react-router-dom';

const columns = [
    { field: "_id", headerName: "ID", width: 120, },
    { field: "title", headerName: "Title", width: 200 },
    { field: "price", headerName: "Price", width: 140 },
    { field: "address", headerName: "Address", width: 400 },
];



const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    
    const [rows, setRows] = useState<Property[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllProperties();
                
                setRows(data);
            } catch (error) {
                console.log("Cannot fetch users", error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    if (rows == null) return <p>Is loading...</p>
    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <h1 className='text-center pr-30 pb-7'>List All Properties</h1>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row._id}
                loading={loading}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
            />
        </Paper>
    );
}