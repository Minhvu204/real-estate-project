import React, { useEffect, useState } from "react";
import { Box, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { ContractUploaderModal } from "./ContractUploaderModal";
import { contractApi, type Contract } from "../../../api/contractApi";

interface Props {
    dealId: string;
    token: string;
}

export const ContractList: React.FC<Props> = ({ dealId, token }) => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchContracts = async () => {
        try {
            const res = await contractApi.getContracts(dealId, true);
            setContracts(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [dealId]);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa hợp đồng này?")) return;
        try {
            await contractApi.deleteContract(dealId, token);
            fetchContracts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box>
            <Button variant="contained" onClick={() => setModalOpen(true)}>Upload Hợp Đồng</Button>

            <List>
                {contracts.map(c => (
                    <ListItem key={c._id} secondaryAction={
                        <Button color="error" onClick={() => handleDelete(c._id)}>Xóa</Button>
                    }>
                        <ListItemText
                            primary={c.original_filename}
                            secondary={`Loại: ${c.contract_type}, Trạng thái: ${c.status}, Ngày upload: ${new Date(c.createdAt).toLocaleString()}`}
                        />
                    </ListItem>
                ))}
            </List>

            <ContractUploaderModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                dealId={dealId}
                token={token}
                onUploaded={fetchContracts}
                existingContracts={contracts} // ✅ truyền danh sách hợp đồng
            />
        </Box>
    );
};
