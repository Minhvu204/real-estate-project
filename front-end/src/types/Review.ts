export type Review = {
  _id: string;
  user_id: {
    _id: string;
    fullName: string;
    email: string;
    avatar: string;
  };
  target_id: {
    _id: string;
  };
  target_type: string;
  rating: number;
  comment: string;
  isComment: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ReviewPagination = {
  limit: number;
  totalPages: number;
  page: number;
};
