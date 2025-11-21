import React, { useEffect, useState } from 'react';
import { getAllAssignments } from '../../services/agent.service';
import type { AssignAgent } from '../../types/AsssignAgents';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { acceptAssignAgent } from '../../services/agent.service';
import { rejectAssignAgent } from '../../services/agent.service';

const AssignAgentPage = () => {
    const [assignments, setAssignments] = useState<AssignAgent[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

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

    const handleAccept = async (id: string) => {
        try {
            await acceptAssignAgent(id);
            toast.success("Accepted assignment successfully");
            setAssignments(prev =>
                prev.map(item =>
                    item._id === id ? { ...item, status: "accepted" } : item
                )
            );
        } catch (error) {
            console.error("Error accepting assignment:", error);
            toast.error("Error accepting assignment");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectAssignAgent(id);
            toast.error("Rejected assignment successfully");

            setAssignments(prev =>
                prev.map(item =>
                    item._id === id ? { ...item, status: "rejected" } : item
                )
            );
        } catch (error) {
            console.error("Error rejecting assignment:", error);
            toast.error("Error rejecting assignment");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Agent Assignments</h1>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse bg-gray-100 h-24" />
                    ))}
                </div>
            ) : assignments.length === 0 ? (
                <p className="text-gray-500">No assignments found.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map((item) => (
                        <div
                            key={item._id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-lg font-semibold">
                                        {item.property_id?.title.en}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        📍 {item.property_id?.address.en}
                                    </p>

                                    <p className="text-sm">
                                        Owner:{" "}
                                        <span className="font-medium">
                                            {item.owner_id.fullName}
                                        </span>{" "}
                                        - {item.owner_id.email}
                                    </p>

                                    {/* Status badge */}
                                    <span
                                        className={`
                                            px-3 py-1 text-sm rounded-full
                                            ${item.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : item.status === "accepted"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }
                                        `}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                {/* Buttons */}
                                {item.status === "pending" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(item._id)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(item._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignAgentPage;
