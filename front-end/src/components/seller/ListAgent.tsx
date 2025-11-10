// Updated ListAgent component with smaller item size, improved CSS, search & filter
import { useState, useEffect } from 'react'
import { getAllAgents } from '../../services/seller.service';
import type { Agent } from '@/types/Agent';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, PaginationItem, TextField, MenuItem } from '@mui/material';
import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useTranslation } from 'react-i18next';
import { assignAgent } from '../../services/seller.service';
import { useParams } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ListAgent = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('home');
    const { id: propertyId } = useParams();

    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

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
        return null;
    }

    const handleOpenConfirm = (agent: Agent) => {
        setSelectedAgent(agent);
        setOpenConfirm(true);
    };

    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleConfirmAssign = async () => {
        if (!propertyId || !selectedAgent) return;
        try {
            const data = await assignAgent(propertyId, selectedAgent._id);
            console.log(data);
            toast.success('Gán môi giới thành công!');
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
            } else if (error.request) {
                console.error('Request error:', error.request);
                alert('Không nhận được phản hồi từ server.');
            } else {
                console.error('Other error:', error.message);
                alert(`Lỗi: ${error.message}`);
            }
        } finally {
            setOpenConfirm(false);
            setSelectedAgent(null);
        }
    };

    // FILTER + SEARCH
    const filteredAgents = agents.filter(a => {
        const matchesSearch = a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'active' ? a.isActive : !a.isActive;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage);

    if (loading)
        return <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>;

    return (
        <Box className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
            <Typography variant="h5" fontWeight="bold" className="mb-6 text-gray-800 text-center sm:text-left">
                Danh sách Agent
            </Typography>

            <Box className="flex flex-col sm:flex-row gap-2 mb-4 max-w-3xl mx-auto">
                <TextField
                    label="Tìm kiếm agent..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <TextField
                    select
                    label="Trạng thái"
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="active">Đang hoạt động</MenuItem>
                    <MenuItem value="inactive">Ngưng hoạt động</MenuItem>
                </TextField>
            </Box>

            <Grid container spacing={2}>
                {currentAgents.map((agent) => (
                    <Grid size={{ xs: 12, md: 4, sm: 6 }} key={agent._id}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                borderRadius: 2,
                                padding: 2,
                                height: '100%',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={agent.avatar || '/defaultUser.png'}
                                alt={agent.fullName}
                                sx={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', mb: 1 }}
                            />

                            <Chip label={agent.role?.toUpperCase() || 'AGENT'} color="warning" size="small" sx={{ mb: 1 }} />

                            <Typography variant="subtitle1" fontWeight="bold">{agent.fullName}</Typography>
                            <Typography variant="body2" className="text-gray-600">{agent.email}</Typography>

                            {agent.phone && (
                                <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
                                    <LocalPhoneIcon fontSize="small" /> {agent.phone}
                                </Typography>
                            )}

                            <Typography variant="body2" className={agent.isActive ? 'text-green-600' : 'text-red-500'}>
                                {agent.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                            </Typography>

                            <CardContent sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Button variant="contained" color="primary" onClick={() => handleOpenConfirm(agent)} sx={{ borderRadius: 2, textTransform: 'none', height: 38 }}>
                                    {t('insideProperty.assignAgent')}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {currentAgents.length > 0 && (
                <Box className="flex justify-center items-center mt-8">
                    <Pagination count={totalPages} onChange={handleChangePage} renderItem={(item) => (
                        <PaginationItem slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
                    )} />
                </Box>
            )}

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận chỉ định</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn chỉ định agent <strong>{selectedAgent?.fullName}</strong> cho bất động sản này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">Hủy</Button>
                    <Button onClick={handleConfirmAssign} color="primary" variant="contained">Xác nhận</Button>
                </DialogActions>
            </Dialog>

            <ToastContainer position="top-right" autoClose={5000} theme="light" transition={Bounce} />
        </Box>
    );
};

export default ListAgent;
