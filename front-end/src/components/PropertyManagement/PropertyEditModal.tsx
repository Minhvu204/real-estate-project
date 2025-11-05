import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Chip,
    OutlinedInput,
    InputAdornment,
    Stack,
} from "@mui/material";
import { Close as CloseIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import type { Property } from "../../types/Property";
import type { City } from "../../types/Cities";
import type { PropertyType } from "../../types/PropertyTypes";
import type { Feature } from "../../types/Features";
import { cityService, propertyTypeService, featureService } from "../../services/categoryService";
import { getText } from "../../utils/multilang";

interface PropertyEditModalProps {
    open: boolean;
    property: Property | null;
    onClose: () => void;
    onSubmit: (id: string, formData: FormData) => Promise<void>;
}

const PropertyEditModal: React.FC<PropertyEditModalProps> = ({
    open,
    property,
    onClose,
    onSubmit,
}) => {
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [types, setTypes] = useState<PropertyType[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        city_id: "",
        type_id: "",
        city_name: "",
        type_name: "",
        features: [] as string[],
        address: "",
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        unit: "m²",
        yearBuilt: new Date().getFullYear(),
        floors: 1,
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (property && open) {
            setFormData({
                title: getText(property.title as any, "vi") || "",
                description: getText(property.description as any, "vi") || "",
                price: property.price || 0,
                city_id: property.city_id?._id || "",
                type_id: property.type_id?._id || "",
                city_name: property.city_id?.city_name ? getText(property.city_id.city_name as any, "vi") : "",
                type_name: property.type_id?.type_name ? getText(property.type_id.type_name as any, "vi") : "",
                features: property.features?.map((f) => f._id) || [],
                address: getText(property.address as any, "vi") || "",
                bedrooms: property.bedrooms || 0,
                bathrooms: property.bathrooms || 0,
                area: property.area || 0,
                unit: property.unit || "m2",
                yearBuilt: property.yearBuilt || new Date().getFullYear(),
                floors: property.floors || 1,
            });
            setExistingImages(property.images || []);
            setImageFiles([]);
        }
    }, [property, open]);

    const loadCategories = async () => {
        try {
            const [citiesData, typesData, featuresData] = await Promise.all([
                cityService.getAll(),
                propertyTypeService.getAll(),
                featureService.getAll(),
            ]);
            setCities(citiesData);
            setTypes(typesData);
            setFeatures(featuresData);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setImageFiles((prev) => [...prev, ...files]);
        }
    };

    const handleRemoveNewImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!property) return;

        setLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price.toString());
            if (formData.city_id) {
                data.append("city_id", formData.city_id);
            }
            if (formData.city_name) {
                data.append("city_name", formData.city_name);
            }
            if (formData.type_id) {
                data.append("type_id", formData.type_id);
            }
            if (formData.type_name) {
                data.append("type_name", formData.type_name);
            }
            
            data.append("address", formData.address);
            data.append("bedrooms", formData.bedrooms.toString());
            data.append("bathrooms", formData.bathrooms.toString());
            data.append("area", formData.area.toString());
            data.append("unit", formData.unit);
            data.append("yearBuilt", formData.yearBuilt.toString());
            data.append("floors", formData.floors.toString());

            formData.features.forEach((featureId) => {
                data.append("features[]", featureId);
            });

            existingImages.forEach((url) => {
                data.append("existingImages[]", url);
            });

            imageFiles.forEach((file) => {
                data.append("images", file);
            });

            await onSubmit(property._id, data);
            onClose();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (!property) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6">Chỉnh sửa bất động sản</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={3}>
                        <TextField
                            label="Tiêu đề"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                        />

                    <TextField
                        label="Mô tả"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                    />

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                            label="Giá"
                            sx={{ flex: 1, minWidth: 200 }}
                            fullWidth
                            required
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">VNĐ</InputAdornment>,
                            }}
                        />

                        <TextField
                            label="Địa chỉ"
                            sx={{ flex: 1, minWidth: 200 }}
                            fullWidth
                            required
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                        />
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                            label="Thành phố"
                            sx={{ flex: 1, minWidth: 200 }}
                            fullWidth
                            required
                            value={formData.city_name}
                            onChange={(e) => handleChange("city_name", e.target.value)}
                            placeholder="VD: Thành phố Hồ Chí Minh"
                        />

                        <TextField
                            label="Loại bất động sản"
                            sx={{ flex: 1, minWidth: 200 }}
                            fullWidth
                            required
                            value={formData.type_name}
                            onChange={(e) => handleChange("type_name", e.target.value)}
                            placeholder="VD: Cho thuê, Bán"
                        />
                    </Box>

                    <FormControl fullWidth>
                        <InputLabel>Tiện ích</InputLabel>
                            <Select
                                multiple
                                value={formData.features}
                                onChange={(e) => handleChange("features", e.target.value)}
                                input={<OutlinedInput label="Tiện ích" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) => {
                                            const feature = features.find((f) => f._id === value);
                                            return (
                                                <Chip 
                                                    key={value} 
                                                    label={feature?.feature_name ? getText(feature.feature_name as any, "vi") : value} 
                                                    size="small" 
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {features.map((feature) => (
                                    <MenuItem key={feature._id} value={feature._id}>
                                        {getText(feature.feature_name as any, "vi")}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <TextField
                            label="Phòng ngủ"
                            sx={{ flex: 1, minWidth: 100 }}
                            fullWidth
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => handleChange("bedrooms", parseInt(e.target.value))}
                        />

                        <TextField
                            label="Phòng tắm"
                            sx={{ flex: 1, minWidth: 100 }}
                            fullWidth
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => handleChange("bathrooms", parseInt(e.target.value))}
                        />

                        <TextField
                            label="Diện tích"
                            sx={{ flex: 1, minWidth: 100 }}
                            fullWidth
                            type="number"
                            value={formData.area}
                            onChange={(e) => handleChange("area", parseFloat(e.target.value))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">m²</InputAdornment>,
                            }}
                        />

                        <TextField
                            label="Số tầng"
                            sx={{ flex: 1, minWidth: 100 }}
                            fullWidth
                            type="number"
                            value={formData.floors}
                            onChange={(e) => handleChange("floors", parseInt(e.target.value))}
                        />
                    </Box>

                    <TextField
                        label="Năm xây dựng"
                            fullWidth
                            type="number"
                            value={formData.yearBuilt}
                            onChange={(e) => handleChange("yearBuilt", parseInt(e.target.value))}
                    />

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Hình ảnh hiện tại
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                            {existingImages.map((url, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: "relative",
                                        width: 100,
                                        height: 100,
                                        border: "1px solid #ddd",
                                        borderRadius: 1,
                                        overflow: "hidden",
                                    }}
                                >
                                    <img src={url} alt={`Existing ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: "absolute",
                                            top: 2,
                                            right: 2,
                                            bgcolor: "rgba(255,255,255,0.8)",
                                        }}
                                        onClick={() => handleRemoveExistingImage(index)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                        >
                            Thêm hình ảnh mới
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>

                        {imageFiles.length > 0 && (
                            <>
                                <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                                    Hình ảnh mới ({imageFiles.length})
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                    {imageFiles.map((file, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: "relative",
                                                width: 100,
                                                height: 100,
                                                border: "1px solid #ddd",
                                                borderRadius: 1,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`New ${index}`}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 2,
                                                    right: 2,
                                                    bgcolor: "rgba(255,255,255,0.8)",
                                                }}
                                                onClick={() => handleRemoveNewImage(index)}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !formData.title || !formData.price}
                >
                    {loading ? "Đang lưu..." : "Lưu"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PropertyEditModal;

