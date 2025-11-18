import { ContractList } from "../components/agent/upload/ContractList";
import React from "react";
import { useParams } from "react-router-dom";

const DealContractPage: React.FC = () => {
    const { dealId } = useParams<{ dealId: string }>();


    const token = localStorage.getItem("auth_token") || "";

    if (!dealId) return <div>Không tìm thấy deal</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý hợp đồng cho deal: {dealId}</h2>
            <ContractList dealId={dealId} token={token} />
        </div>
    );
};

export default DealContractPage;
