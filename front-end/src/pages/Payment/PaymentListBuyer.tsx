import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, useMediaQuery, Divider, Button, Stack } from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import { toast } from "react-toastify";
import { getPayments } from "../../api/paymentApi";
import type { Payment } from "../../types/PaymentData ";
import PaymentDetailListBuyer from "./PaymentDetailListBuyer";
import { useTranslation } from "react-i18next";

const PaymentListBuyer = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<Payment | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const isMobile = useMediaQuery("(max-width:768px)");
    const { t } = useTranslation("payment");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(payments.length / itemsPerPage);

    const paginatedPayments = payments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatMoney = (value: number) =>
        value.toLocaleString("vi-VN") + " ₫";

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("vi-VN");

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPayments();
                setPayments(data);
            } catch (err) {
                console.error(err);
                toast.error(t("detail.failedToLoadPayments"));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const openDetails = (p: Payment) => {
        setSelected(p);
        setOpenDrawer(true);
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );

    return (
        <Box p={3}>
            <Typography align="center" variant="h4" fontWeight={700} mb={3}>
                💵 {t("listPayment.paymentHistory")}
            </Typography>

            {isMobile ? (
                <Box display="flex" flexDirection="column" gap={2}>
                    {paginatedPayments.map((p) => (
                        <Paper key={p._id} elevation={2} sx={{ borderRadius: 2, p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CreditScoreIcon color="success" />
                                    <Typography fontWeight={600}>#{p._id.slice(-6)}</Typography>
                                </Box>
                                <IconButton onClick={() => openDetails(p)} color="primary" size="small">
                                    <InfoIcon />
                                </IconButton>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" flexDirection="column" gap={0.5}>
                                <Typography>
                                    <strong>{t("listPayment.amount")}:</strong> {formatMoney(p.amount)}
                                </Typography>
                                <Typography>
                                    <strong>{t("listPayment.status")}:</strong>{" "}
                                    <Chip
                                        label={p.status}
                                        color={p.status === "completed" ? "success" : "warning"}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Typography>
                                <Typography>
                                    <strong>{t("listPayment.method")}:</strong>{" "}
                                    {p.method === "payos_qr" ? (
                                        <Box display="inline-flex" alignItems="center" gap={0.5}>
                                            <QrCode2Icon color="primary" fontSize="small" />
                                            {t("listPayment.payosQr")}
                                        </Box>
                                    ) : (
                                        p.method
                                    )}
                                </Typography>
                                <Typography>
                                    <strong>{t("listPayment.date")}:</strong> {formatDate(p.payment_date)}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            ) : (
                <Paper elevation={2} sx={{ borderRadius: "12px", marginLeft: "50px", marginRight: "50px" }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("listPayment.payment")}</TableCell>
                                    <TableCell>{t("listPayment.amount")}</TableCell>
                                    <TableCell>{t("listPayment.status")}</TableCell>
                                    <TableCell>{t("listPayment.method")}</TableCell>
                                    <TableCell>{t("listPayment.date")}</TableCell>
                                    <TableCell align="center">{t("listPayment.detail")}</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedPayments.map((p) => (
                                    <TableRow key={p._id} hover>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <CreditScoreIcon color="success" />
                                                #{p._id.slice(-6)}
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                {formatMoney(p.amount)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={p.status}
                                                color={p.status === "completed" ? "success" : "warning"}
                                                size="small"
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {p.method === "payos_qr" ? (
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <QrCode2Icon color="primary" />
                                                    {t("listPayment.payosQr")}
                                                </Box>
                                            ) : (
                                                p.method
                                            )}
                                        </TableCell>

                                        <TableCell>{formatDate(p.payment_date)}</TableCell>

                                        <TableCell align="center">
                                            <IconButton onClick={() => openDetails(p)} color="primary">
                                                <InfoIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {payments.length > itemsPerPage && (
                <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="outlined" onClick={handlePrev} disabled={currentPage === 1}>
                        {t("listPayment.prev")}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ pt: 1 }}>
                        {currentPage} / {totalPages}
                    </Typography>
                    <Button variant="outlined" onClick={handleNext} disabled={currentPage === totalPages}>
                        {t("listPayment.next")}
                    </Button>
                </Stack>
            )}

            <PaymentDetailListBuyer
                open={openDrawer}
                payment={selected}
                onClose={() => setOpenDrawer(false)}
            />
        </Box>
    );
};

export default PaymentListBuyer;
