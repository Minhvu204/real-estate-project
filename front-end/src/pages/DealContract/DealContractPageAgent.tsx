import { ContractListAgent } from "../../components/upload/ContractListAgent";
import React from "react";
import { useParams } from "react-router-dom";

const DealContractPageAgent: React.FC = () => {
    const { dealId } = useParams<{ dealId: string }>();


    const token = localStorage.getItem("auth_token") || "";

    if (!dealId) return <div>Không tìm thấy deal</div>;

    return (
        <div>
            <ContractListAgent dealId={dealId} token={token} />
        </div>
    );
};

export default DealContractPageAgent;
