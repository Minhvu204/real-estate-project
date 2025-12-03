import User from "../../models/user.model";
import Property from "../../models/property.model";
import Deal from "../../models/deal.model";
import Payment from "../../models/payment.model";
import Appointment from "../../models/appointment.model";

export const getSummary = async () => {
  const [
    totalUsers,
    totalProperties,
    totalDealsCompleted,
    totalRevenue,
    totalAppointments
  ] = await Promise.all([
    User.countDocuments({}),
    Property.countDocuments({ deleted: false }),
    Deal.countDocuments({ status: "completed" }),
    Payment.aggregate([
      { $match: { status: "completed", type: "platform_fee" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]),
    Appointment.countDocuments({}) // Leads = appointments
  ]);

  return {
    totalUsers,
    totalProperties,
    totalDealsCompleted,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalLeads: totalAppointments,
  };
};

export const getRevenueChart = async (
  year: number,
  month?: number,
  startDate?: Date,
  endDate?: Date
) => {
  let start: Date;
  let end: Date;

  if (startDate && endDate) {
    start = startDate;
    end = endDate;
  } else if (month) {
    start = new Date(year, month - 1, 1, 0, 0, 0);
    end = new Date(year, month, 0, 23, 59, 59);
  } else {
    start = new Date(year, 0, 1, 0, 0, 0);
    end = new Date(year, 11, 31, 23, 59, 59);
  }

  const revenueByMonth = await Payment.aggregate([
    {
      $match: {
        status: "completed",
        type: "platform_fee",
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  const dealsByMonth = await Deal.aggregate([
    {
      $match: {
        status: "completed",
        "audit.completed_at": { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$audit.completed_at" } },
        totalDeals: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  return {
    year,
    month: month || null,
    startDate: startDate || null,
    endDate: endDate || null,
    revenueByMonth,
    dealsByMonth,
  };
};

export const getTopAgents = async (limit: number) => {
  const result = await Deal.aggregate([
    { $match: { status: "completed" } },

    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "deal_id",
        as: "payments",
      },
    },
    { $unwind: { path: "$payments", preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: "$agent_id",
        totalDeals: { $sum: 1 },
        totalAgentFee: {
          $sum: {
            $cond: [
              { $eq: ["$payments.type", "agent_fee"] },
              "$payments.amount",
              0,
            ],
          },
        },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agent",
      },
    },
    { $unwind: "$agent" },

    {
      $project: {
        agent_id: "$agent._id",
        fullName: "$agent.fullName",
        email: "$agent.email",
        totalDeals: 1,
        totalAgentFee: 1,
      },
    },

    { $sort: { totalDeals: -1, totalAgentFee: -1 } },
    { $limit: limit },
  ]);

  return result;
};
