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
  comment: {
    vi: string;
    en: string;
  };
  isComment: boolean;
  canReview: boolean;
  createdAt: Date;
  updatedAt: Date;
};
