import api from "./api";

export const contractApiAgent = {
    getContracts: (dealId: string) =>
        api.get(`/api/client/agent/contracts/deals/${dealId}/list`, {
        }),

    uploadOrReplaceContract: (dealId: string, data: FormData, hasExisting: boolean, token: string) =>
        hasExisting
            ? api.put(`/api/client/agent/contracts/deals/${dealId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            : api.post(`/api/client/agent/contracts/deals/${dealId}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }),

    deleteContract: (dealId: string, token: string, contractId: String) =>
        api.delete(`/api/client/agent/contracts/deals/${dealId}/contracts/${contractId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};
