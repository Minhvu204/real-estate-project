import { ContractListSeller } from "../../components/upload/ContractListSeller";
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DealContractPageSeller: React.FC = () => {
    const { t } = useTranslation("dealContact");
    const { dealId } = useParams<{ dealId: string }>();


    const token = localStorage.getItem("auth_token") || "";

    if (!dealId) return <div>{t("dealUnavailable")}</div>;

    return (
        <div>
            <ContractListSeller dealId={dealId} token={token} />
        </div>
    );
};

export default DealContractPageSeller;
