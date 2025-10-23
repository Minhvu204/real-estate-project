import User from "../../models/user.model";

export const getAllUsers = async (role?: string, page = 1, limit = 10) => {
  const query: any = {};
  if (role) query.role = role;

  const skip = (page - 1) * limit;
  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("-password"); // ẩn mật khẩu

  const total = await User.countDocuments(query);

  return {
    meta: {
      totalUsers: total,
      currentPage: page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    },
    results: users.map((user) => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
    })),
  };
};
