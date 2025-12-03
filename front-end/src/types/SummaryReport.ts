

export type SummaryReport = {
    totalUsers: number,
    totalProperties: number,
    totalDealsCompleted: number,
    totalRevenue: number,
    totalLeads: number
}
export type topAgents = {
    agent_id: string,
    fullName: string,
    email: string,
    totalDeals: number,
    totalAgentFee: number
}
export type RevenueChart = {
    year: number,
    revenueByMonth: RevenueByMonth,
    dealsByMonth: DealsByMonth
};
export type RevenueByMonth = {
    _id: { month: number },
    revenue: number
}[];
export type DealsByMonth = {
    _id: { month: number },
    totalDeals: number
}[];
