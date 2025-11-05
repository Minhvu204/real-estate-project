import { useEffect, useState } from "react";
import type { DetailProperty } from "../../../types/Property";
import {
  getDetailPropertiesById,
  hideProperty,
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
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

type HideProperty = {
  propertyId: string;
};

const HideProperties = ({ propertyId }: HideProperty) => {
  const [property, setProperty] = useState<DetailProperty | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<String>("");

  const handleOpen = async () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await getDetailPropertiesById(propertyId!);
        console.log("Data return is ", response);
        setProperty(response);
      } catch (error) {
        console.log("Cannot fetch properties for this role", error);
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
      const hidePropertyAndRestore = await hideProperty(propertyId, property);
      setProperty(hidePropertyAndRestore);
      console.log(hidePropertyAndRestore);
      if (hidePropertyAndRestore.deleted) {
        toast.success("hide property thành công!");
      } else {
        toast.success("restore thành công!");
      }
      setOpen(false);
    } catch (error) {
      toast.error(property.deleted ? "restore thất bại!" : "hide thất bại!");
      console.error(error);
    }
  };

  return (
    <>
      {property && (
        <>
          <Tooltip title="hide">
            <Button
              variant="contained"
              color="error"
              onClick={handleOpen}
              sx={{
                minWidth: "36px",
                height: "36px",
                padding: 0,
                borderRadius: "6px",
                fontSize: "0.85rem",
              }}
            >
              {property.status ? (
                <FontAwesomeIcon icon={faLockOpen} />
              ) : (
                <FontAwesomeIcon icon={faLock} />
              )}
            </Button>
          </Tooltip>
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold", color: "#1e293b" }}>
              Thông tin bất động sản
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
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  sx={{ mt: 1 }}
                />
              </div>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Hủy
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  console.log("Reason:", reason);
                  handleHideUser();
                }}
              >
                Xác nhận
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default HideProperties;
