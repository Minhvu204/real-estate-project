import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
    Alert,
    Tabs,
    Tab,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMyProperties, updateProperty, deleteProperty } from "../services/propertyService";
import type { Property } from "../types/Property";
import PropertyEditModal from "../components/PropertyManagement/PropertyEditModal";

const MyPropertiesPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        loadProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [properties, searchTerm, statusFilter]);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const data = await getMyProperties();
            console.log("✅ Loaded properties:", data);
            setProperties(data);
            
            if (data.length === 0) {
                toast.info("Bạn chưa có bất động sản nào hoặc backend chưa implement API");
            } else {
                toast.success(`Đã tải ${data.length} bất động sản`);
            }
        } catch (error: any) {
            console.error("❌ Error loading properties:", error);
            const status = error.response?.status;
            
            if (status === 401) {
                toast.error("❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else if (status === 403) {
                toast.error("❌ Bạn không có quyền truy cập chức năng này");
            } else if (status === 404 || status === 501) {
                toast.warning("⚠️ Backend chưa implement GET /api/client/properties");
            } else {
                toast.error(error.response?.data?.message || "Không thể tải danh sách bất động sản");
            }
        } finally {
            setLoading(false);
        }
    };

    const filterProperties = () => {
        let filtered = properties;

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.address.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProperties(filtered);
    };

    const handleEdit = (property: Property) => {
        setSelectedProperty(property);
        setEditModalOpen(true);
    };

    const handleUpdate = async (id: string, formData: FormData) => {
        try {
            const updated = await updateProperty(id, formData);
            toast.success("✅ Cập nhật bất động sản thành công!");
            setEditModalOpen(false);
            setProperties(prev => prev.map(p => p._id === id ? updated : p));
        } catch (error: any) {
            console.error("❌ Error updating property:", error);
            const message = error.response?.data?.message || "Không thể cập nhật bất động sản";
            toast.error(`❌ ${message}`);
            throw error;
        }
    };

    const handleDeleteClick = (property: Property) => {
        setSelectedProperty(property);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProperty) return;

        setDeletingId(selectedProperty._id);
        try {
            await deleteProperty(selectedProperty._id);
            toast.success("✅ Đã xóa bất động sản thành công!");
            setDeleteDialogOpen(false);
            setSelectedProperty(null);
            setProperties(prev => prev.filter(p => p._id !== selectedProperty._id));
        } catch (error: any) {
            console.error("❌ Error deleting property:", error);
            const message = error.response?.data?.message || "Không thể xóa bất động sản";
            if (error.response?.status === 403) {
                toast.error("❌ Bạn không có quyền xóa bất động sản này");
            } else if (message.includes("đang được sử dụng")) {
                toast.error(`❌ ${message}`);
            } else {
                toast.error(`❌ ${message}`);
            }
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "success";
            case "pending":
                return "warning";
            case "approved":
                return "info";
            case "sold":
                return "error";
            case "rejected":
                return "error";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "available":
                return "Có sẵn";
            case "pending":
                return "Chờ duyệt";
            case "approved":
                return "Đã duyệt";
            case "sold":
                return "Đã bán";
            case "rejected":
                return "Bị từ chối";
            default:
                return status;
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                Quản lý bất động sản của tôi
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng số: {properties.length} | Hiển thị: {filteredProperties.length}
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadProperties}
                            disabled={loading}
                        >
                            Làm mới
                        </Button>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm theo tiêu đề hoặc địa chỉ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />

                        <Tabs
                            value={statusFilter}
                            onChange={(_, newValue) => setStatusFilter(newValue)}
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                                "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
                            }}
                        >
                            <Tab label="Tất cả" value="all" />
                            <Tab label="Có sẵn" value="available" />
                            <Tab label="Chờ duyệt" value="pending" />
                            <Tab label="Đã duyệt" value="approved" />
                            <Tab label="Đã bán" value="sold" />
                        </Tabs>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : properties.length === 0 ? (
                        <Alert severity="info" sx={{ my: 3 }}>
                            Bạn chưa có bất động sản nào. Backend API GET chưa trả dữ liệu.
                        </Alert>
                    ) : filteredProperties.length === 0 ? (
                        <Alert severity="warning" sx={{ my: 3 }}>
                            Không tìm thấy bất động sản nào phù hợp với bộ lọc.
                        </Alert>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Tiêu đề</strong></TableCell>
                                        <TableCell><strong>Giá</strong></TableCell>
                                        <TableCell><strong>Địa chỉ</strong></TableCell>
                                        <TableCell><strong>Loại</strong></TableCell>
                                        <TableCell><strong>Trạng thái</strong></TableCell>
                                        <TableCell align="center"><strong>Thao tác</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProperties.map((property) => (
                                        <TableRow key={property._id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {property.title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="primary" fontWeight={600}>
                                                    {property.price.toLocaleString("vi-VN")} VNĐ
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {property.address}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={property.type_id?.type_name || "N/A"}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusLabel(property.status)}
                                                    color={getStatusColor(property.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(property)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteClick(property)}
                                                    title="Xóa"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>

                <PropertyEditModal
                    open={editModalOpen}
                    property={selectedProperty}
                    onClose={() => setEditModalOpen(false)}
                    onSubmit={handleUpdate}
                />

                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => !deletingId && setDeleteDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ bgcolor: "error.light", color: "error.contrastText" }}>
                        ⚠️ Xác nhận xóa
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            Bạn có chắc chắn muốn xóa bất động sản này?
                        </Alert>
                        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Tiêu đề:
                            </Typography>
                            <Typography variant="body1" fontWeight={600} gutterBottom>
                                {selectedProperty?.title}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                Địa chỉ:
                            </Typography>
                            <Typography variant="body2">
                                {selectedProperty?.address}
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                            ⚠️ Lưu ý: Thao tác này sẽ soft-delete (set deleted: true) và không thể hoàn tác.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deletingId !== null}
                            variant="outlined"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            color="error"
                            variant="contained"
                            disabled={deletingId !== null}
                            startIcon={deletingId ? <CircularProgress size={16} /> : <DeleteIcon />}
                        >
                            {deletingId ? "Đang xóa..." : "Xác nhận xóa"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer position="top-right" autoClose={3000} />
            </Container>
        </Box>
    );
};

export default MyPropertiesPage;

