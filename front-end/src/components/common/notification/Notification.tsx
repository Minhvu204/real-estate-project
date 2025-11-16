import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  IconButton,
  Badge,
  Menu,
  Box,
  Typography,
  ListItemButton,
  Avatar,
  CircularProgress,
  Button,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../../../services/notificationService";
import type { NotificationType } from "../../../types/Notification";
import { useNavigate } from "react-router-dom";

function debounce(fn: (...args: any[]) => void, delay: number) {
  let timer: number;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const isFetchingRef = useRef(false);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (anchorEl) {
      setPage(1);
      setNotifications([]);
      fetchNotifications(1, true);
    }
  }, [anchorEl]);

  useEffect(() => {
    if (page > 1) fetchNotifications(page, false);
  }, [page]);

  const fetchNotifications = async (page: number, reset = false) => {
    if (isFetchingRef.current) return;
    setLoading(true);
    isFetchingRef.current = true;
    try {
      const res = await getNotifications(page);
      setTotalPages(res.pagination?.totalPages || 1);
      setNotifications((prev) => (reset ? res.data : [...prev, ...res.data]));
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const fetchUnreadCount = async () => {
    const count = await getUnreadCount();
    setUnreadCount(count ?? 0);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleMarkAllAsRead = async () => {
    if (!notifications.some((n) => !n.is_read)) return;
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedHandleScroll = debounce(
    (event: React.UIEvent<HTMLUListElement>) => {
      const target = event.target as HTMLUListElement;
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (
        scrollHeight - scrollTop <= clientHeight + 50 &&
        !loading &&
        page < totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    },
    120
  );

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ "&:hover": { backgroundColor: "#1565c0" } }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon
            sx={{
              fontSize: 28,
              color: "black",
              "&:hover": { color: "white" },
            }}
          />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            mt: 1,
            p: 0,
            borderRadius: 2,
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        MenuListProps={{
          sx: {
            maxHeight: 400,
            overflow: "auto",
            py: 0,
          },
          onScroll: debouncedHandleScroll,
        }}
      >
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
              navigate("/notifications");
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
              "&:hover": { background: n.is_read ? "#f3f6f9" : "#dbeafe" },
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

        {notifications.length > 0 && notifications.some((n) => !n.is_read) && (
          <Box
            sx={{
              borderTop: "1px solid #eee",
              py: 1,
              px: 2,
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#fafafa",
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{ textTransform: "none" }}
            >
              Đánh dấu tất cả là đã đọc
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default Notification;
