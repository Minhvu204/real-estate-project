import { ContractListBuyer } from "../components/agent/upload/ContractListBuyer";
import React from "react";
import { useParams } from "react-router-dom";

const DealContractPageBuyer: React.FC = () => {
    const { dealId } = useParams<{ dealId: string }>();

    if (!dealId) return <div>Không tìm thấy deal</div>;

    return (
        <div>
            <ContractListBuyer dealId={dealId} />
        </div>
    );
};

export default DealContractPageBuyer;
