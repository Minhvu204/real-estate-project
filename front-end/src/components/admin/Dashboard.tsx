import React, { useState, useEffect, useMemo } from "react";
import { getReportSummary, getTopAgents, getRevenueChart } from "@/services/admin.service";
import type { SummaryReport, topAgents, RevenueChart } from "@/types/SummaryReport";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


export const Dashboard: React.FC = () => {
    const [summary, setSummary] = useState<SummaryReport>();
    const [topAgents, setTopAgents] = useState<topAgents[]>();
    const [revenue, setRevenue] = useState<RevenueChart>();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    // Tạo danh sách năm (5 năm gần đây)
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, topAgentsData, revenueData] = await Promise.all([
                    getReportSummary(),
                    getTopAgents(),
                    getRevenueChart(selectedYear),
                ]);

                setSummary(summaryData);
                setTopAgents(topAgentsData as any);
                setRevenue(revenueData);
            } catch (error) {
                console.log("Cannot fetch data", error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Fetch revenue chart when year changes
    const handleYearChange = async (year: number) => {
        setSelectedYear(year);
        setChartLoading(true);
        try {
            const revenueData = await getRevenueChart(year);
            setRevenue(revenueData);
        } catch (error) {
            console.error("Cannot fetch revenue chart", error);
        } finally {
            setChartLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    // Prepare chart data from revenue
    const chartData = useMemo(() => {
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

        if (!revenue) {
            return { labels: months, revenueData: Array(12).fill(0), dealsData: Array(12).fill(0), year: new Date().getFullYear() };
        }

        const revenueByMonth = Array(12).fill(0);
        const dealsByMonth = Array(12).fill(0);

        if (revenue.revenueByMonth && Array.isArray(revenue.revenueByMonth)) {
            revenue.revenueByMonth.forEach(item => {
                if (item._id?.month) revenueByMonth[item._id.month - 1] = item.revenue || 0;
            });
        }

        if (revenue.dealsByMonth && Array.isArray(revenue.dealsByMonth)) {
            revenue.dealsByMonth.forEach(item => {
                if (item._id?.month) dealsByMonth[item._id.month - 1] = item.totalDeals || 0;
            });
        }

        return { labels: months, revenueData: revenueByMonth, dealsData: dealsByMonth, year: revenue.year };
    }, [revenue]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white shadow-md" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                        <div className="lg:col-span-7 h-[450px] animate-pulse rounded-2xl bg-white shadow-md" />
                        <div className="lg:col-span-3 h-[450px] animate-pulse rounded-2xl bg-white shadow-md" />
                    </div>
                </div>
            </div>
        );
    }

    const statsCards = [
        {
            title: "Tổng Người Dùng",
            value: summary?.totalUsers || 0,
            icon: <PeopleOutlineIcon className="text-4xl" />,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600"
        },
        {
            title: "Tổng Bất Động Sản",
            value: summary?.totalProperties || 0,
            icon: <HomeWorkOutlinedIcon className="text-4xl" />,
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600"
        },
        {
            title: "Giao Dịch Hoàn Thành",
            value: summary?.totalDealsCompleted || 0,
            icon: <HandshakeOutlinedIcon className="text-4xl" />,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600"
        },
        {
            title: "Tổng Doanh Thu",
            value: formatCurrency(summary?.totalRevenue || 0),
            icon: <AttachMoneyOutlinedIcon className="text-4xl" />,
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            textColor: "text-amber-600",
            isRevenue: true
        },
        {
            title: "Tổng Leads",
            value: summary?.totalLeads || 0,
            icon: <TrendingUpOutlinedIcon className="text-4xl" />,
            color: "from-rose-500 to-rose-600",
            bgColor: "bg-rose-50",
            textColor: "text-rose-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                        Dashboard Quản Trị
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Tổng quan về hiệu suất và hoạt động của hệ thống
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    {statsCards.map((stat, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200"
                        >
                            <div className={`absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 ${stat.bgColor} rounded-full -mr-10 -mt-10 sm:-mr-16 sm:-mt-16 opacity-50`} />
                            <div className={`${stat.textColor} mb-2 sm:mb-4 relative z-10 text-2xl sm:text-4xl`}>
                                {stat.icon}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">{stat.title}</p>
                            <p className={`text-lg sm:text-2xl font-bold ${stat.textColor} relative z-10`}>
                                {stat.isRevenue ? stat.value : formatNumber(stat.value as number)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Chart (70%) + Top Agents (30%) */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
                    {/* Revenue Chart - 70% */}
                    <div className="lg:col-span-7 bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900">Biểu Đồ Doanh Thu & Giao Dịch</h2>
                                <p className="text-xs sm:text-sm text-slate-500">Theo dõi xu hướng theo tháng</p>
                            </div>
                            <select
                                value={selectedYear}
                                onChange={(e) => handleYearChange(Number(e.target.value))}
                                disabled={chartLoading}
                                className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {availableYears.map(year => (
                                    <option key={year} value={year}>Năm {year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="h-[250px] sm:h-[300px] relative">
                            {chartLoading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                            <Line
                                data={{
                                    labels: chartData.labels,
                                    datasets: [
                                        {
                                            label: 'Doanh Thu (VNĐ)',
                                            data: chartData.revenueData,
                                            borderColor: '#3b82f6',
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            tension: 0.3,
                                            fill: true,
                                            yAxisID: 'y',
                                        },
                                        {
                                            label: 'Số Giao Dịch',
                                            data: chartData.dealsData,
                                            borderColor: '#10b981',
                                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                            tension: 0.3,
                                            fill: true,
                                            yAxisID: 'y1',
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { position: 'top' }
                                    },
                                    scales: {
                                        y: { position: 'left' },
                                        y1: { position: 'right', grid: { drawOnChartArea: false } }
                                    }
                                }}
                            />
                        </div>

                        {/* Summary */}
                        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-200">
                            <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200">
                                <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Tổng Doanh Thu {chartData.year}</p>
                                <p className="text-sm sm:text-lg font-bold text-blue-600">
                                    {formatCurrency(chartData.revenueData.reduce((a, b) => a + b, 0))}
                                </p>
                            </div>
                            <div className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-200">
                                <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Tổng Giao Dịch {chartData.year}</p>
                                <p className="text-sm sm:text-lg font-bold text-emerald-600">
                                    {chartData.dealsData.reduce((a, b) => a + b, 0)} deals
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Top Agents - 30% */}
                    <div className="lg:col-span-3 bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-slate-200 h-fit">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                            <EmojiEventsOutlinedIcon className="text-amber-500 text-lg sm:text-xl" />
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">Top Agents</h2>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            {topAgents && Array.isArray(topAgents) && topAgents.slice(0, 5).map((agent, index) => (
                                <div
                                    key={agent.agent_id}
                                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-slate-200"
                                >
                                    <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-white text-xs sm:text-sm ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                                'bg-gradient-to-br from-blue-400 to-blue-600'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{agent.fullName}</p>
                                        <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                            <span className="text-[10px] sm:text-xs font-bold text-emerald-600">{agent.totalDeals} deals</span>
                                            <span className="text-[10px] sm:text-xs text-slate-400">•</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-blue-600">{formatCurrency(agent.totalAgentFee)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(!topAgents || !Array.isArray(topAgents) || topAgents.length === 0) && (
                                <div className="text-center py-6 text-slate-400">
                                    <EmojiEventsOutlinedIcon className="text-4xl mb-2 opacity-30" />
                                    <p className="text-sm">Chưa có dữ liệu</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}