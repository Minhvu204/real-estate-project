export interface Contract {
    _id: string;
    file_url: string;
    original_filename: string;
    createdAt: string;
    contract_type: string;
    status: string;
}

import api from "./api";

export const contractApi = {
    getContracts: (dealId: string, history = false) =>
        api.get(`/api/client/agent/deals/${dealId}/contract`, {
            params: { history: history ? "true" : undefined },
        }),

    uploadOrReplaceContract: (dealId: string, data: FormData, hasExisting: boolean, token: string) =>
        hasExisting
            ? api.put(`/api/client/agent/deals/${dealId}/contract`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            : api.post(`/api/client/agent/deals/${dealId}/contract`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }),

    deleteContract: (dealId: string, token: string) =>
        api.delete(`/api/client/agent/deals/${dealId}/contract`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};
