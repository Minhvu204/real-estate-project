export type User = {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "buyer" | "seller" | "agent";
  phone: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
