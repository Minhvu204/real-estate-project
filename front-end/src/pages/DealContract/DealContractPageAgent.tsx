import { ContractListAgent } from "../../components/upload/ContractListAgent";
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DealContractPageAgent: React.FC = () => {

    const { t } = useTranslation("dealContact");

    const { dealId } = useParams<{ dealId: string }>();


    const token = localStorage.getItem("auth_token") || "";

    if (!dealId) return <div>{t("dealUnavailable")}</div>;

    return (
        <div>
            <ContractListAgent dealId={dealId} token={token} />
        </div>
    );
};

export default DealContractPageAgent;
