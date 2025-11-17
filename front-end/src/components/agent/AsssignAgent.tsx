import React, { useEffect } from 'react'
import { useState } from 'react';
import { getAllAssignments } from '../../services/agent.service';
import type { AssignAgent } from '../../types/AsssignAgents';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
const AsssignAgent = () => {
    const [assignments, setAssignments] = useState<AssignAgent[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchAllAssign = async () => {
            try {
                const response = await getAllAssignments();
                setAssignments(response || []);
            } catch (error) {
                console.log('Cannot fetch assignments', error);
                toast.error('Cannot fetch assignments');
            } finally {
                setLoading(false);
            }
        };
        fetchAllAssign();
    }, []);
    return (
        <>
            {assignments.map((assignment) => (
                <Box key={assignment._id}>
                    <Typography variant="body1">{assignment.property_id.title.vi}</Typography>
                    <Typography variant="body1">{assignment.status}</Typography>
                </Box>
            ))}
        </>
    )
}

export default AsssignAgent