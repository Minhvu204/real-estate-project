import { ContractList } from "../components/agent/upload/ContractList";
import React from "react";
import { useParams } from "react-router-dom";

const DealContractPage: React.FC = () => {
    const { dealId } = useParams<{ dealId: string }>();


    const token = localStorage.getItem("auth_token") || "";

    if (!dealId) return <div>Không tìm thấy deal</div>;

    return (
        <div>
            <ContractList dealId={dealId} token={token} />
        </div>
    );
};

export default DealContractPage;
