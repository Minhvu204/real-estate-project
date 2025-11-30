import type { PaymentData } from "../types/PaymentData ";
import api from "./api";

interface CreatePaymentResponse {
    success: boolean;
    message: string;
    data: PaymentData;
}

export const createPayment = async (dealId: string): Promise<PaymentData> => {
    const res = await api.post<CreatePaymentResponse>("/api/client/buyer/payments/create", { dealId });
    return res.data.data;
};

export const paymentSuccess = async (paymentId: string) => {
    return api.post("/api/public/webhook/payos", {
        paymentId,
        status: "success",
    });
}

