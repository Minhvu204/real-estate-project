import { useState, useEffect } from 'react'
import { getAllAgents } from '../../services/seller.service';
import type { Agent } from '@/types/Agent';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useTranslation } from 'react-i18next';
import { assignAgent } from '../../services/seller.service';
import { useParams } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';

const ListAgent = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('home');
    const { id: propertyId } = useParams();

    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await getAllAgents();
                setAgents(response || []);
            } catch (error) {
                console.log('Cannot fetch agents', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);
    if (!propertyId) {
        console.log('Không tìm thấy ID bất động sản!');
        return;
    }
    const handleOpenConfirm = (agent: Agent) => {
        setSelectedAgent(agent);
        setOpenConfirm(true);

    }
    const handleConfirmAssign = async () => {
        if (!propertyId || !selectedAgent) return;
        try {
            const data = await assignAgent(propertyId, selectedAgent._id);
            console.log(data);
            toast.success(' Gán môi giới thành công!');

        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra';
                const statusCode = error.response?.status;
                console.error("Response error:", {
                    status: statusCode,
                    message: errorMessage,
                    data: error.response.data
                });
                toast.error(`Lỗi ${statusCode}: ${errorMessage}`);
            }
            else if (error.request) {
                console.error('Request error:', error.request);
                alert(' Không nhận được phản hồi từ server.');
            } else {
                console.error('Other error:', error.message);
                alert(` Lỗi: ${error.message}`);
            }

        } finally { 
            setOpenConfirm(false);
            setSelectedAgent(null);
        }
    };

    if (loading)
        return <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>;

    if (agents.length === 0)
        return (
            <Typography variant="body1" className="text-center text-gray-500 mt-6">
                Không có agent nào được tìm thấy.
            </Typography>
        );

    return (
        <Box className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <Typography
                variant="h5"
                fontWeight="bold"
                className="mb-6 text-gray-800 text-center sm:text-left"
            >
                Danh sách Agent
            </Typography>

            <Grid container spacing={3}>
                {agents.map((agent) => (
                    <Grid size={{ xs: 12, md: 6, sm: 6 }} key={agent._id}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: '100%',
                                borderRadius: 3,
                                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                                },
                            }}
                        >
                            <Box className="flex flex-col items-center text-center p-6 flex-grow">
                                <CardMedia
                                    component="img"
                                    image={agent.avatar || '/defaultUser.png'}
                                    alt={agent.fullName}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid #e5e7eb',
                                        marginBottom: 2,
                                    }}
                                />
                                <Chip
                                    label={agent.role?.toUpperCase() || 'AGENT'}
                                    color="warning"
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                                <Typography variant="h6" fontWeight="bold" className="text-gray-800 mb-1">
                                    {agent.fullName}
                                </Typography>
                                <Typography variant="body2" className="text-gray-600 mb-1">
                                    {agent.email}
                                </Typography>
                                {agent.phone && (
                                    <Typography
                                        variant="body2"
                                        className="text-gray-600 flex items-center justify-center gap-1"
                                    >
                                        <LocalPhoneIcon fontSize="small" />
                                        {agent.phone}
                                    </Typography>
                                )}
                                <Typography
                                    variant="body2"
                                    className={`mt-2 font-medium ${agent.isActive ? 'text-green-600' : 'text-red-500'
                                        }`}
                                >
                                    {agent.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                                </Typography>
                            </Box>

                            <CardContent
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    pb: 3,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenConfirm(agent)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        height: 44,
                                        fontWeight: 500,
                                        px: 3
                                    }}
                                >
                                    {t('insideProperty.assignAgent')}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận chỉ định</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn chỉ định agent{' '}
                        <strong>{selectedAgent?.fullName}</strong> cho bất động sản này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmAssign} color="primary" variant="contained">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </Box>
    );
};


export default ListAgent