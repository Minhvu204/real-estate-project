import React, { useEffect, useState } from "react";
import { Container, Box, Typography, CircularProgress, Alert, Card, CardContent, CardActions, Button, Chip, Stack, Avatar, Divider, } from "@mui/material";
import { dealApiBuyer } from "../../api/dealApiBuyer";
import type { Deal } from "../../types/Deal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLanguage } from "../../utils/storage";

const BuyerDealsPage: React.FC = () => {
    const { t } = useTranslation("dealContact");
    const lang = getLanguage();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        dealApiBuyer
            .getDeals()
            .then((data) => setDeals(data))
            .catch((err) => {
                console.error(err);
                setError("Không thể tải danh sách deal. Vui lòng thử lại sau.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    {t("listDeal")}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {t("manageAndTrackAllRealEstateTransactions")}
                </Typography>
            </Box>

            {deals.length === 0 ? (
                <Card sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        {t("noDealsAvailable")}
                    </Typography>
                </Card>
            ) : (
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={3} // khoảng cách giữa các card
                >
                    {deals.map((deal) => (
                        <Box
                            key={deal._id}
                            sx={{
                                flex: "1 1 300px", // card min-width 300px, tự co dãn
                                maxWidth: 350, // giới hạn card max-width
                                display: "flex",
                            }}
                        >
                            <Card
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    height: "100%", // đồng đều chiều cao
                                    borderRadius: 3,
                                    boxShadow: 6,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": { transform: "translateY(-5px)", boxShadow: 12 },
                                    width: "100%",
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box display="flex" justifyContent="space-between" height="35%" alignItems="center" mb={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: "#1976d2" }}>
                                                {deal.property_id.title[lang].charAt(0)}
                                            </Avatar>
                                            <Typography variant="h6">{deal.property_id.title[lang]}</Typography>
                                        </Stack>
                                        <Chip
                                            label={deal.status}
                                            color={
                                                deal.status === "completed"
                                                    ? "success"
                                                    : deal.status === "cancelled"
                                                        ? "error"
                                                        : deal.status === "contract_under_review"
                                                            ? "warning"
                                                            : deal.status === "escrow_funded"
                                                                ? "secondary"
                                                                : "default"
                                            }
                                            size="small"
                                        />
                                    </Box>

                                    <Stack spacing={1} divider={<Divider flexItem />}>

                                        {/* Property Info */}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("address")}:</strong> {deal.property_id.address[lang]}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("finalPrice")}:</strong> {deal.amounts.agreed_price.toLocaleString()} {deal.amounts.currency}
                                            </Typography>
                                        </Box>

                                        {/* Participants */}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("seller")}:</strong> {deal.seller_id.fullName} ({deal.seller_id.phone})
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("agent")}:</strong> {deal.agent_id.fullName} ({deal.agent_id.phone})
                                            </Typography>
                                        </Box>

                                        {/* Amount Details */}
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("platformFee")}:</strong> {deal.amounts.platform_fee.toLocaleString()} VND
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("agentFee")}:</strong> {deal.amounts.agent_fee.toLocaleString()} VND
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{t("sellerPayout")}:</strong> {deal.amounts.seller_payout.toLocaleString()} VND
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/buyer/contracts/deals/${deal._id}`)}
                                    >
                                        {t("viewContractDetails")}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default BuyerDealsPage;
