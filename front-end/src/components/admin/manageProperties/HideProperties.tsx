import { useEffect, useState } from "react";
import type { DetailProperty } from "../../../types/Property";
import {
  getDetailPropertiesById,
  hideProperty,
  restoreProperty,
} from "../../../services/propertyService";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faLockOpen,
  faCommentDots,
  faHouse,
  faCoins,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type HideProperty = {
  propertyId: string;
};

const HideProperties = ({ propertyId }: HideProperty) => {
  const [property, setProperty] = useState<DetailProperty | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const navigate = useNavigate();

  const handleOpen = async () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getDetailPropertiesById(propertyId!);
        console.log("getDetailPropertiesById: ", data);
        setProperty(data);
      } catch (error) {
        console.log("không thể fetch data cho role này: ", error);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleHideUser = async () => {
    if (!propertyId) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }
    if (!property) return;

    try {
      const hideProperties = await hideProperty(propertyId, note);
      console.log("hide property:", hideProperties);
      setProperty((prev) => ({
        ...prev!,
        deleted: hideProperties.deleted,
        status: hideProperties.status,
        hiddenNote: hideProperties.hiddenNote,
      }));
      if (hideProperties.deleted) {
        toast.success("Ẩn bất động sản thành công!");
      } else {
        toast.success("Ẩn bất động sản thất bại!");
      }
      setOpen(false);
      navigate("/admin/properties", { state: { refresh: true } });
    } catch (error) {
      toast.error(property.deleted ? "hide thành công!" : "hide thất bại!");
      console.error(error);
    }
  };

  const handleRestoreUser = async () => {
    if (!propertyId) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }
    if (!property) return;

    try {
      const restoreProperties = await restoreProperty(propertyId);
      console.log("restore property:", restoreProperties);
      setProperty((prev) => ({
        ...prev!,
        deleted: restoreProperties.deleted,
        status: restoreProperties.status,
        hiddenNote: "",
      }));
      if (restoreProperties.deleted) {
        toast.success("Khôi phục bất động sản thất bại!");
      } else {
        toast.success("Khôi phục bất động sản thành công!");
      }
      setOpen(false);
      navigate("/admin/properties", { state: { refresh: true } });
    } catch (error) {
      toast.error(property.deleted ? "restore thất bại!" : "");
      console.error(error);
    }
  };

  return (
    <>
      {property && (
        <>
          <Tooltip title={property.deleted ? "Khôi phục" : "Ẩn"}>
            <button
              onClick={handleOpen}
              className={`w-9 h-9 cursor-pointer flex items-center justify-center rounded-md text-white shadow-sm hover:shadow-md transition-all duration-200 
      ${
        property.deleted
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
            >
              <FontAwesomeIcon icon={property.deleted ? faLock : faLockOpen} />
            </button>
          </Tooltip>
          {property.deleted && (
            <Tooltip title={property.hiddenNote || "Không có ghi chú"}>
              <button className="w-9 h-9 flex items-center cursor-pointer justify-center bg-amber-500 text-white rounded-md hover:bg-amber-600 shadow-sm hover:shadow-md transition-all duration-200">
                <FontAwesomeIcon icon={faCircleInfo} />
              </button>
            </Tooltip>
          )}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1e293b" }}>
              {property.deleted
                ? "Mở ẩn thông tin bất động sản"
                : "Ẩn thông tin bất động sản "}
            </DialogTitle>

            <DialogContent dividers>
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={property.images?.[0] || "image"}
                  alt={property.title.vi}
                  className="w-full sm:w-1/2 h-[180px] object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <Typography variant="h6" color="primary">
                    {property.title.vi}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.address.vi}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    <FontAwesomeIcon icon={faCoins} />{" "}
                    {property.price.toLocaleString()} VND
                  </Typography>
                  <Chip
                    label={
                      property.status === "approved"
                        ? "Approved"
                        : property.status === "pending"
                        ? "Pending"
                        : property.status === "available"
                        ? "Available"
                        : "Reject"
                    }
                    color={
                      property.status === "approved"
                        ? "success"
                        : property.status === "pending"
                        ? "warning"
                        : property.status === "available"
                        ? "info"
                        : "default"
                    }
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    <FontAwesomeIcon icon={faHouse} /> Thành phố:{" "}
                    {property.city.city_name.vi}
                  </Typography>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                <Typography variant="subtitle2" color="text.secondary">
                  Chủ sở hữu
                </Typography>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={property.owner.avatar}
                    alt={property.owner.fullName}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div>
                    <Typography fontWeight={600}>
                      {property.owner.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.owner.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.owner.phone}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {property.deleted === false && (
                  <>
                    <Typography
                      variant="subtitle1"
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <FontAwesomeIcon
                        icon={faCommentDots}
                        style={{ color: "#2563eb" }}
                      />
                      Lý do ẩn bất động sản
                    </Typography>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      placeholder="Nhập lý do ẩn hoặc từ chối bất động sản này..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      sx={{ mt: 1 }}
                    />
                  </>
                )}
              </div>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Hủy
              </Button>
              {property.deleted ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleRestoreUser();
                  }}
                >
                  Xác nhận
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleHideUser();
                  }}
                >
                  Xác nhận
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default HideProperties;
