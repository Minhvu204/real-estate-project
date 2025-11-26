import React, { useEffect, useState, useMemo } from 'react';
import type { Appointment } from '@/types/Appointment';
import { getAllAppoinments } from '@/services/buyer.service';
import { getLanguage } from '@/utils/storage';
import { Pagination, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

type FilterStatus = "all" | "pending" | "accepted" | "rejected";

const ListAppointment = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const statusOptions: FilterStatus[] = ["all", "pending", "accepted", "rejected"];
    const language = getLanguage();
    const { t } = useTranslation('bookAppointment');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await getAllAppoinments();
                setAppointments(response || []);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const stats = useMemo(() => {
        const totalPending = appointments.filter((a) => a.status === "pending").length;
        const totalAccepted = appointments.filter((a) => a.status === "accepted").length;
        const totalRejected = appointments.filter((a) => a.status === "rejected").length;
        return { totalPending, totalAccepted, totalRejected, total: appointments.length };
    }, [appointments]);

    const filteredAppointments = useMemo(() => {
        let filtered = appointments;
        if (statusFilter !== "all") {
            filtered = appointments.filter((a) => a.status === statusFilter);
        }
        return filtered.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    }, [appointments, statusFilter]);

    const paginatedAppointments = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAppointments.slice(startIndex, endIndex);
    }, [filteredAppointments, page]);

    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    const statusLabels = useMemo<Record<FilterStatus, string>>(() => ({
        all: t('appointment.filterAll') || "All",
        pending: t('appointment.pending') || "Pending",
        accepted: t('appointment.accepted') || "Accepted",
        rejected: t('appointment.rejected') || "Rejected",
    }), [t]);

    const getStatusLabel = (status: FilterStatus) => statusLabels[status];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                        {t('appointment.myAppointmentsTitle') || t('appointment.title') || 'Lịch hẹn của tôi'}
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base">
                        {t('appointment.subtitle') || 'Quản lý và theo dõi các lịch hẹn xem bất động sản'}
                    </p>
                </div>

                {!loading && appointments.length > 0 && (
                    <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <div>
                                <p className="text-sm uppercase tracking-wide text-slate-300 mb-1">
                                    {t('appointment.statusFilterLabel') || 'Bộ lọc trạng thái'}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {statusOptions.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setStatusFilter(item)}
                                            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${statusFilter === item
                                                ? "bg-white text-slate-900 shadow-lg"
                                                : "bg-white/10 text-white/70 hover:bg-white/20"
                                                }`}
                                        >
                                            {getStatusLabel(item)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur border border-white/20">
                                <p className="text-xs text-slate-300 mb-1">
                                    {t('appointment.totalAppointments') || 'Tổng số'}
                                </p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur border border-white/20">
                                <p className="text-xs text-slate-300 mb-1">{t('appointment.totalPending') || "Chờ duyệt"}</p>
                                <p className="text-2xl font-bold text-amber-200">{stats.totalPending}</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur border border-white/20">
                                <p className="text-xs text-slate-300 mb-1">{t('appointment.totalAccepted') || "Đã chấp nhận"}</p>
                                <p className="text-2xl font-bold text-emerald-200">{stats.totalAccepted}</p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur border border-white/20">
                                <p className="text-xs text-slate-300 mb-1">{t('appointment.totalRejected') || "Đã từ chối"}</p>
                                <p className="text-2xl font-bold text-rose-200">{stats.totalRejected}</p>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white shadow-md border border-slate-200" />
                        ))}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-slate-600">
                            {t('appointment.noAppointments') || "Không có lịch hẹn nào."}
                        </p>
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-slate-600">
                            {t('appointment.noStatusMatch', { status: getStatusLabel(statusFilter) }) ||
                                `Không tìm thấy lịch hẹn nào với trạng thái "${getStatusLabel(statusFilter)}"`}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 mb-8">
                            {paginatedAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex-1">
                                            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                                                {t('appointment.Real Estate') || "Bất động sản"}
                                            </p>
                                            <h2 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">
                                                {appointment.property_id?.title[language] || appointment.property_id?.title.en}
                                            </h2>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">

                                                <span className="line-clamp-1">
                                                    {appointment.property_id?.address[language] || appointment.property_id?.address.en}
                                                </span>
                                            </p>
                                            {appointment.property_id?.price && (
                                                <p className="text-lg font-semibold text-emerald-600 mt-2">
                                                    {appointment.property_id.price.toLocaleString('vi-VN')} VNĐ
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${appointment.status === "pending"
                                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                                : appointment.status === "accepted"
                                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                    : "bg-rose-100 text-rose-700 border border-rose-200"
                                                }`}
                                        >
                                            {appointment.status === "pending"
                                                ? t('appointment.pending') || "Chờ duyệt"
                                                : appointment.status === "accepted"
                                                    ? t('appointment.accepted') || "Đã chấp nhận"
                                                    : t('appointment.rejected') || "Đã từ chối"}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                                            <p className="text-xs text-slate-500 mb-2">
                                                {t('appointment.appointmentInfo') || 'Thông tin lịch hẹn'}
                                            </p>
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        {t('appointment.time') || 'Thời gian'}
                                                    </p>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {new Date(appointment.time).toLocaleString('vi-VN', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                {appointment.location && (
                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            {t('appointment.locationLabel') || 'Địa điểm'}
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {appointment.location}
                                                        </p>
                                                    </div>
                                                )}
                                                {appointment.note && (
                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            {t('appointment.noteLabel') || 'Ghi chú'}
                                                        </p>
                                                        <p className="text-sm text-slate-700">{appointment.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                                            <p className="text-xs text-slate-500 mb-2">
                                                {t('appointment.agentLabel') || 'Môi giới'}
                                            </p>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {appointment.agent_id?.fullName || t('appointment.noAgent') || "Chưa có môi giới"}
                                            </p>
                                            {appointment.agent_id?.email && (
                                                <p className="text-xs text-slate-500 mt-1">{appointment.agent_id.email}</p>
                                            )}
                                        </div>

                                        {appointment.seller_id && (
                                            <div className="rounded-xl bg-purple-50 p-4 border border-purple-100">
                                                <p className="text-xs text-slate-500 mb-2">
                                                    {t('appointment.sellerLabel') || 'Chủ sở hữu'}
                                                </p>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {appointment.seller_id.fullName}
                                                </p>
                                                {appointment.seller_id.email && (
                                                    <p className="text-xs text-slate-500 mt-1">{appointment.seller_id.email}</p>
                                                )}
                                                {appointment.seller_id.phone && (
                                                    <p className="text-xs text-slate-500">{appointment.seller_id.phone}</p>
                                                )}
                                            </div>
                                        )}

                                        {appointment.status === "accepted" && (
                                            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                                                <p className="text-xs font-semibold text-emerald-700 mb-1">
                                                    {t('appointment.acceptedTitle') || '✓ Lịch hẹn đã được chấp nhận'}
                                                </p>
                                                <p className="text-xs text-emerald-600">
                                                    {t('appointment.acceptedDescription') || 'Vui lòng đến đúng giờ và địa điểm đã hẹn'}
                                                </p>
                                            </div>
                                        )}

                                        {appointment.status === "rejected" && (
                                            <div className="rounded-xl bg-rose-50 p-4 border border-rose-200">
                                                <p className="text-xs font-semibold text-rose-700 mb-1">
                                                    {t('appointment.rejectedTitle') || '✗ Lịch hẹn đã bị từ chối'}
                                                </p>
                                                <p className="text-xs text-rose-600">
                                                    {t('appointment.rejectedDescription') || 'Lịch hẹn này đã bị từ chối. Vui lòng đặt lịch hẹn mới nếu cần.'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 pb-4">
                                <Stack spacing={2}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="large"
                                        showFirstButton
                                        showLastButton
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                            },
                                        }}
                                    />
                                </Stack>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ListAppointment;