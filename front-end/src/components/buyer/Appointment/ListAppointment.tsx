import React, { useEffect } from 'react';
import { useState } from 'react';
import type { Appointment } from '@/types/Appointment';
import { getAllAppoinments } from '@/services/buyer.service';

const ListAppointment = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

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

    // group theo createdAt
    const grouped = filtered.reduce((acc: any, a) => {
        const day = formatDate(a.createdAt);
        acc[day] = acc[day] ? [...acc[day], a] : [a];
        return acc;
    }, {});
    const statusStyles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        accepted: "bg-blue-100 text-blue-700",
        rejected: "bg-red-100 text-red-700",
        cancelled: "bg-red-200 text-red-700",
        confirmed: "bg-green-100 text-green-700",
    };




    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="p-4">

            {/* Filter */}
            <div className="mb-4 flex gap-3">
                <select
                    className="border p-2 rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="accepted">Đã chấp nhận</option>
                    <option value="rejected">Bị từ chối</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse p-4 border rounded-xl flex gap-4">
                            <div className="bg-gray-300 w-24 h-20 rounded-lg"></div>
                            <div className="flex-1 space-y-3">
                                <div className="w-32 h-4 bg-gray-300 rounded"></div>
                                <div className="w-40 h-3 bg-gray-200 rounded"></div>
                                <div className="w-28 h-3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                    Không có lịch hẹn nào.
                </p>
            )}

            {/* Groups */}
            {!loading &&
                Object.keys(grouped).map((day) => (
                    <div key={day} className="mb-6">

                        <div className="text-lg font-semibold text-gray-800 mb-3">
                            📅 {day}
                        </div>

                        <div className="space-y-4">
                            {grouped[day].map((a: Appointment) => (
                                <div
                                    key={a._id}
                                    className="border p-4 rounded-xl shadow-sm flex gap-4 hover:shadow-md transition"
                                >


                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">
                                                {new Date(a.time).toLocaleTimeString("vi-VN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>

                                            <span
                                                className={`text-xs px-2 py-1 rounded capitalize ${statusStyles[a.status] || "bg-gray-200 text-gray-600"
                                                    }`}
                                            >
                                                {a.status}
                                            </span>
                                        </div>

                                        <p className="font-medium">{a.property_id.title.vi}</p>
                                        <p className="text-sm text-gray-600">
                                            {a.property_id.address.vi}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Agent: {a.agent_id.fullName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default ListAppointment