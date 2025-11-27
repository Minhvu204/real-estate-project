import type { AssignAgent } from "@/types/AsssignAgents";
import type { Agent } from "../types/Agent";
import { httpClient } from "../utils/httpClient";

const RESOURCE = "/agent";

export const getAllAssignments = async (): Promise<AssignAgent[]> => {
    const res = await httpClient.get(`${RESOURCE}/assignments`);
    return res.data.data;
}


export const acceptAssignAgent = async (id: string) => {
    try {
        const response = await httpClient.patch(`${RESOURCE}/assignments/${id}/accept`);
        return response.data;
    } catch (error) {
        console.error("Error accept agent:", error);
        throw error;
    }
};
export const rejectAssignAgent = async (id: string) => {
    try {
        const response = await httpClient.patch(`${RESOURCE}/assignments/${id}/reject`);
        return response.data;
    } catch (error) {
        console.error("Error reject agent:", error);
        throw error;
    }
};

