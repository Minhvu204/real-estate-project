import { getPaymentDetail } from "../../../services/paymentService";
import type { Payment } from "../../../types/Payment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const PaymentDetail = () => {
  const { id } = useParams<string>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPaymentDetail = async () => {
      const res = await getPaymentDetail(id!);
      console.log(res);
      setPayment(res);
    };
    fetchPaymentDetail();
  }, [id]);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          {payment ? (
            <Box>
              {/* Thông tin cơ bản */}
              {[
                {
                  label: "Initiated by",
                  value: payment.initiated_by?.fullName,
                },
                {
                  label: "Amount",
                  value: `${payment.amount?.toLocaleString()} ${
                    payment.currency
                  }`,
                  color: "primary.main",
                },
                { label: "Method", value: payment.method },
                {
                  label: "Status",
                  value: payment.status,
                  color:
                    payment.status === "completed"
                      ? "success.main"
                      : payment.status === "cancelled"
                      ? "error.main"
                      : "warning.main",
                },
                { label: "Type", value: payment.type },
              ].map((row, idx) => (
                <Box
                  key={row.label}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  py={1}
                  sx={idx === 0 ? { mt: 0 } : { mt: 1 }}
                >
                  <Typography color="text.secondary">{row.label}</Typography>
                  <Typography
                    fontWeight="medium"
                    sx={
                      row.color
                        ? { color: row.color, textTransform: "capitalize" }
                        : {}
                    }
                  >
                    {row.value}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              {/* Notes riêng biệt */}
              <Typography color="text.secondary" gutterBottom>
                Notes
              </Typography>
              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-line", color: "text.primary" }}
              >
                {payment.notes ? payment.notes : "(No notes)"}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentDetail;
