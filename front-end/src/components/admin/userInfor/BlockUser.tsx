import type { User } from "@/types/Users";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
type BlockUserProps = {
  userId: string;
};
const BlockUser = ({ userId }: BlockUserProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/admin/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.data);
      });
  }, [user]);

  const handleBlockUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...user, isActive: !user.isActive }),
        }
      );
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        alert("Cập nhật thành công!");
        setOpen(false);
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

  return (
    <>
      {user && (
        <Button
          variant="contained"
          size="small"
          color={user.isActive ? "error" : "success"}
          onClick={handleOpen}
          sx={{
            px: 1.5,
            fontSize: "0.75rem",
            borderRadius: "4px",
            textTransform: "none",
            minWidth: "auto",
            height: "28px",
          }}
        >
          {user.isActive ? "Block" : "Unblock"}
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
      >
        {user && (
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                alt={user.fullName}
                src={user.avatar}
                sx={{
                  width: 140,
                  height: 140,
                  border: "3px solid #1976d2",
                  mb: 2,
                }}
              />
            </Box>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Table
                sx={{
                  minWidth: 300,
                  width: "100%",
                  "@media (max-width:600px)": {
                    "& td, & th": {
                      display: "block",
                      width: "100%",
                      boxSizing: "border-box",
                    },
                    "& tr": {
                      display: "block",
                      marginBottom: "12px",
                      borderBottom: "1px solid #eee",
                    },
                    "& td:first-of-type": {
                      fontWeight: 600,
                      color: "text.secondary",
                      pb: 0.5,
                    },
                    "& td:last-of-type": {
                      pb: 1,
                    },
                  },
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Full Name</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Email</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Phone</TableCell>
                    <TableCell>{user.phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Role</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </DialogContent>
        )}

        <DialogTitle
          sx={{
            mt: -1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
            fontWeight: 600,
          }}
        >
          {user?.isActive
            ? "Do you want to block this account?"
            : "Do you want to unblock this account?"}
        </DialogTitle>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBlockUser}
            variant="contained"
            color="error"
            sx={{ textTransform: "none", borderRadius: 2 }}
            autoFocus
          >
            {user?.isActive ? "Block" : "Unblock"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlockUser;
