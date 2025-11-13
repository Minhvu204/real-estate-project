import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  IconButton,
  Badge,
  Menu,
  Box,
  Typography,
  List,
  ListItemButton,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
} from "../../services/notificationService";
import type { NotificationType } from "../../types/Notification";

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (anchorEl) {
      setPage(1);
      setNotifications([]);
      fetchNotifications(1, true);
    }
  }, [anchorEl]);

  const fetchNotifications = async (p = 1, reset = false) => {
    setLoading(true);
    const res = await getNotifications(p, 10);
    // res.data: array, res.pagination: object
    const fetched = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : [];
    setTotalPages(res?.pagination?.totalPages || 1);
    setNotifications((prev) => (reset ? fetched : [...prev, ...fetched]));
    setLoading(false);
  };

  const fetchUnreadCount = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 60000) return "Vừa xong";
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleNotificationClick = async (notification: NotificationType) => {
    if (!notification.is_read) {
      await markAsRead(notification._id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notification._id ? { ...n, is_read: true } : n
        )
      );
    }
    handleClose();
    if (notification.action_url) window.location.href = notification.action_url;
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      fetchNotifications(page + 1);
      setPage(page + 1);
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ fontSize: 28, color: "black" }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1,
            p: 0,
            borderRadius: 2,
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {/* HEADER có nút "Xem tất cả" bên phải */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #eee",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Thông báo</Typography>
          <Button
            color="primary"
            size="small"
            sx={{ ml: 2, textTransform: "none", minWidth: 0 }}
            onClick={() => {
              window.location.href = "/notifications";
              handleClose();
            }}
          >
            Xem tất cả
          </Button>
        </Box>

        {notifications.length === 0 && !loading && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography color="text.secondary">
              Không có thông báo mới
            </Typography>
          </Box>
        )}
        <List sx={{ width: "100%", py: 0 }}>
          {notifications.map((n) => (
            <ListItemButton
              key={n._id}
              alignItems="flex-start"
              onClick={() => handleNotificationClick(n)}
              sx={{
                background: n.is_read ? "white" : "#e8f0fe",
                borderLeft: n.is_read
                  ? "4px solid transparent"
                  : "4px solid #1976d2",
                mb: 0.5,
                borderRadius: 1,
                "&:hover": {
                  background: n.is_read ? "#f3f6f9" : "#dbeafe",
                },
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: n.is_read ? "grey.300" : "primary.main",
                  width: 36,
                  height: 36,
                  mr: 1.5,
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={n.is_read ? 400 : 700}
                  sx={{ maxWidth: "100%" }}
                >
                  {n.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {n.message}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {formatTime(n.createdAt)}
                </Typography>
              </Box>
            </ListItemButton>
          ))}
          {loading && (
            <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </List>
        <Box sx={{ textAlign: "center", py: 1 }}>
          {page < totalPages ? (
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              variant="text"
              color="primary"
              sx={{ textTransform: "none" }}
            >
              {loading ? (
                <CircularProgress variant="determinate" value={30} size={18} />
              ) : (
                "Xem thêm"
              )}
            </Button>
          ) : null}
        </Box>
      </Menu>
    </>
  );
};

export default Notification;
