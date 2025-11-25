import type { AssignAgent } from "@/types/AsssignAgents";

import { httpClient } from "../utils/httpClient";
import type { AgentAppointment } from "@/types/AgentAppointment";

const RESOURCE = "/agent";
export const getAllAssignments = async (): Promise<AssignAgent[]> => {
    const res = await httpClient.get(`${RESOURCE}/assignments`);
    return res.data.data;
}

export const acceptAssignAgent = async (id: string) => {
    try {
        const response = await httpClient.patch(`${RESOURCE}/assignments/${id}/accept`);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error accept agent:", error);
        throw error;
    }
};
export const rejectAssignAgent = async (id: string, note: string) => {
    try {
        const response = await httpClient.patch(`${RESOURCE}/assignments/${id}/reject`,
            { note }
        );
        return response.data;
    } catch (error) {
        console.error("Error reject agent:", error);
        throw error;
    }
};
export const getAllAppointmentsByAgent = async (): Promise<AgentAppointment[]> => {
    try {
        const response = await httpClient.get(`${RESOURCE}/appointments`);
        return response.data.data.data;
    } catch (error) {
        console.log("Fetching agent appointments failed:", error);
        throw error;
    }
}
export const acceptAppointment = async (appointmentId: string, time: Date) => {
    try {
        const response = await httpClient.patch(`${RESOURCE}/appointments/${appointmentId}/accept`, {
            selectedTime: new Date(time).toISOString()
        });
        return response.data;
    } catch (error) {
        console.log("Cannot accept appointments. ");
        throw error;
    }
}
export const rejectAppointment = async (appointmentId: string) => {
    try {
        const response = await httpClient.patch(`${RESOURCE}/appointments/${appointmentId}/reject`);
        return response.data;
    } catch (error) {
        console.log("Cannot reject appointments");
        throw error;
    }
}