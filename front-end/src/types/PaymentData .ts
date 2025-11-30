export interface PaymentData {
    paymentId: string;
    qrUrl: string;
    amount: number;
    platformFee: number;
    agentFee: number;
}
