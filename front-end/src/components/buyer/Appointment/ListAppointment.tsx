import React, { useEffect } from 'react';
import { useState } from 'react';
import type { Appointment } from '@/types/Appointment';
import { getAllAppoinments } from '@/services/buyer.service';

const ListAppointment = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getAllAppoinments();
                setAppointments(response);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
                throw new Error("Failed to fetch appointments");
            } finally {
                setLoading(false);
            }
        }
        fetchAppointments();
    }, []);
    const filtered = appointments
        .filter((a) => (statusFilter === "all" ? true : a.status === statusFilter))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());


    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="p-4">

        
            
            {!loading && filtered.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                    Không có lịch hẹn nào.
                </p>
            )}

        </div>
    );
}

export default ListAppointment