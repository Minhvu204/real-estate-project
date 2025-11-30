import type { Deal } from "./Deal";

export type Contract = {
  _id: string;
  contract_type: string;
  deal_id: {
    _id: string;
    status: string;
  };
  deleted: boolean;
  file_size: number;
  file_url: string;
  mime_type: string;
  notes: string;
  original_filename: string;
  replaced_at: Date;
  role_of_uploader: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  uploaded_by: {
    email: string;
    fullName: string;
    role: string;
    _id: string;
  };
  version: number;
};

export type pagination = {
  limit: number;
  page: number;
  totalDocs: number;
  totalPages: number;
};
