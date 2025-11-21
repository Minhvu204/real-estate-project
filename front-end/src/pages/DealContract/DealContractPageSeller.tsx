import { ContractListSeller } from "../../components/upload/ContractListSeller";
import React from "react";
import { useParams } from "react-router-dom";

const DealContractPageSeller: React.FC = () => {
    const { dealId } = useParams<{ dealId: string }>();


    const token = localStorage.getItem("auth_token") || "";

    if (!dealId) return <div>Không tìm thấy deal</div>;

    return (
        <div>
            <ContractListSeller dealId={dealId} token={token} />
        </div>
    );
};

export default DealContractPageSeller;
