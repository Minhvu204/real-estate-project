import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Card, CardContent, Divider, Paper } from "@mui/material";
import { createPayment, paymentSuccess } from "../../api/paymentApi";
import type { PaymentData } from "../../types/PaymentData ";

const PaymentPage = () => {
    const { dealId } = useParams<{ dealId: string }>();
    const navigate = useNavigate();

    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [paying, setPaying] = useState<boolean>(false);

    useEffect(() => {
        if (!dealId) return;
        console.log("DEBUG dealId:", dealId);

        const loadPayment = async () => {
            try {
                const data = await createPayment(dealId);
                console.log("DEBUG paymentData:", data);
                setPaymentData(data);
            } catch (err) {
                console.error(err);
                alert("Không tạo được QR thanh toán!");
            } finally {
                setLoading(false);
            }
        };

        loadPayment();
    }, [dealId]);

    const handleFakePayment = async () => {
        if (!paymentData) return;

        try {
            setPaying(true);
            await paymentSuccess(paymentData.paymentId);
            alert("Thanh toán thành công!");
            navigate(`/deals/${dealId}`);
        } catch (err) {
            console.error(err);
            alert("Webhook lỗi!");
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (!paymentData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h6" color="text.secondary">
                    Không có dữ liệu thanh toán
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3
        }}>
            <Card sx={{
                maxWidth: 500,
                width: '100%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                borderRadius: 3,
                backgroundColor: '#fff',
                border: '1px solid #f8f9fa'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 3,
                            fontWeight: 600,
                            textAlign: 'center',
                            color: '#414141'
                        }}
                    >
                        Thanh toán Deal
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 3,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 2
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                Số tiền:
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {(paymentData.amount - paymentData.platformFee - paymentData.agentFee).toLocaleString()} VNĐ
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                Phí nền tảng:
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {paymentData.platformFee.toLocaleString()} VNĐ
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" color="text.secondary">
                                Phí môi giới:
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {paymentData.agentFee.toLocaleString()} VNĐ
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6" fontWeight={700}>
                                Tổng cộng:
                            </Typography>
                            <Typography variant="h6" fontWeight={700} color="#667eea">
                                {paymentData.amount.toLocaleString()} VNĐ
                            </Typography>
                        </Box>
                    </Paper>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3,
                        p: 2,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}>
                        <img
                            src={paymentData.qrUrl}
                            alt="QR Payment"
                            style={{
                                maxWidth: '280px',
                                width: '100%',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', mb: 3 }}
                    >
                        Nhấn nút bên dưới để thanh toán
                    </Typography>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleFakePayment}
                        disabled={paying}
                        sx={{
                            fontSize: 16,
                            fontWeight: 600,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
                            },
                            '&:disabled': {
                                background: '#ccc'
                            }
                        }}
                    >
                        {paying ? "Đang xử lý..." : "Xác nhận thanh toán"}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PaymentPage;