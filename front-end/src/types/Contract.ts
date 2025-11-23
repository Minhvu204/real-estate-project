export type Contract = {
    _id: string;
    deal_id: string;
    file_url: string;
    version: number;
    uploaded_by: string;
    role_of_uploader: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    contract_type: string;
    status: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    approved_at?: string;
    approved_by?: string;
};
