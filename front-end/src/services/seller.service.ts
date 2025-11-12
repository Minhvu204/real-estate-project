import type { Agent } from "../types/Agent";
import { httpClient } from "../utils/httpClient";

const RESOURCE = "/seller";

export const getAllAgents = async (): Promise<Agent[]> => {
  const res = await httpClient.get(`${RESOURCE}/agents`);
  return res.data.data.data;
}
export const assignAgent = async (id: string, agentId: string) => {
  try {
    const response = await httpClient.post(`${RESOURCE}/properties/${id}/assign-agent`, {
      agent_id: agentId,
    });
    console.log("Request body:", { agent_id: agentId });
    return response.data;
  } catch (error) {
    console.error("Error assigning agent:", error);

    throw error;
  }
};