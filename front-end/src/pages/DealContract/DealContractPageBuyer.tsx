import { ContractListBuyer } from "../../components/upload/ContractListBuyer";
import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DealContractPageBuyer: React.FC = () => {
    const { t } = useTranslation("dealContact");
    const { dealId } = useParams<{ dealId: string }>();

    if (!dealId) return <div>{t("dealUnavailable")}</div>;

    return (
        <div>
            <ContractListBuyer dealId={dealId} />
        </div>
    );
};

export default DealContractPageBuyer;
