import React, { useState } from "react";
import {
    Box,
    Container,
    Paper,
    Tabs,
    Tab,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Alert,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
};

const CategoryManagementPreview: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    const mockCities = [
        { _id: "1", city_name: "Hà Nội", createdAt: "2024-01-15T00:00:00.000Z" },
        { _id: "2", city_name: "Hồ Chí Minh", createdAt: "2024-01-16T00:00:00.000Z" },
        { _id: "3", city_name: "Đà Nẵng", createdAt: "2024-01-17T00:00:00.000Z" },
        { _id: "4", city_name: "Hải Phòng", createdAt: "2024-01-18T00:00:00.000Z" },
        { _id: "5", city_name: "Cần Thơ", createdAt: "2024-01-19T00:00:00.000Z" },
    ];

    const mockTypes = [
        { _id: "1", type_name: "Nhà phố", createdAt: "2024-01-15T00:00:00.000Z" },
        { _id: "2", type_name: "Chung cư", createdAt: "2024-01-16T00:00:00.000Z" },
        { _id: "3", type_name: "Biệt thự", createdAt: "2024-01-17T00:00:00.000Z" },
        { _id: "4", type_name: "Đất nền", createdAt: "2024-01-18T00:00:00.000Z" },
        { _id: "5", type_name: "Shophouse", createdAt: "2024-01-19T00:00:00.000Z" },
    ];

    const mockFeatures = [
        { _id: "1", feature_name: "Bể bơi", createdAt: "2024-01-15T00:00:00.000Z" },
        { _id: "2", feature_name: "Gym", createdAt: "2024-01-16T00:00:00.000Z" },
        { _id: "3", feature_name: "Sân tennis", createdAt: "2024-01-17T00:00:00.000Z" },
        { _id: "4", feature_name: "Gara", createdAt: "2024-01-18T00:00:00.000Z" },
        { _id: "5", feature_name: "Công viên", createdAt: "2024-01-19T00:00:00.000Z" },
    ];

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const renderTable = (data: any[], type: "city" | "type" | "feature") => {
        const getColumnName = () => {
            if (type === "city") return "Tên thành phố";
            if (type === "type") return "Tên loại";
            return "Tên tiện ích";
        };

        const getValue = (item: any) => {
            if (type === "city") return item.city_name;
            if (type === "type") return item.type_name;
            return item.feature_name;
        };

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>{getColumnName()}</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={item._id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Chip label={getValue(item)} color="primary" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => alert("Chức năng Edit - Demo mode")}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => alert("Chức năng Delete - Demo mode")}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
                <strong>🎨 PREVIEW MODE</strong> - Đây là giao diện preview với mock data. 
                Để sử dụng chức năng thực, vui lòng dùng component CategoryManagement.
            </Alert>

            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Quản lý danh mục
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={() => alert("Chức năng Refresh - Demo mode")}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => alert("Chức năng Add New - Demo mode")}
                    >
                        Thêm mới
                    </Button>
                </Box>
            </Box>

            <Paper elevation={2}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Thành phố" />
                        <Tab label="Loại bất động sản" />
                        <Tab label="Tiện ích" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    {renderTable(mockCities, "city")}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {renderTable(mockTypes, "type")}
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                    {renderTable(mockFeatures, "feature")}
                </TabPanel>
            </Paper>

            <Box sx={{ mt: 4, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    📋 Hướng dẫn sử dụng Preview
                </Typography>
                <Typography variant="body2" component="div">
                    <ul>
                        <li>Component này chỉ để xem trước giao diện với mock data</li>
                        <li>Không có kết nối API thực</li>
                        <li>Các button chỉ hiển thị alert thông báo</li>
                        <li>Để sử dụng chức năng thực, import <code>CategoryManagement</code></li>
                    </ul>
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Cách sử dụng component thực:</strong>
                </Typography>
                <Box
                    component="pre"
                    sx={{
                        p: 2,
                        bgcolor: "grey.900",
                        color: "white",
                        borderRadius: 1,
                        overflow: "auto",
                        fontSize: "0.875rem",
                        mt: 1,
                    }}
                >
                </Box>
            </Box>
        </Container>
    );
};

export default CategoryManagementPreview;

