import {
  approveContract,
  getAllContract,
  rejectContract,
} from "../../../services/contractService";
import type { Contract, pagination } from "../../../types/Contract";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
const ContractsList = () => {
  const [contract, setContract] = useState<Contract[]>([]);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    null
  );
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await getAllContract(currentPage);
        console.log("Data return is ", res);
        console.log("Data return is ", res.contracts);
        console.log("Data return is ", res.pagination);
        if (status) {
          setContract(
            res.contracts.filter((contract) => contract.status === status)
          );
        } else {
          setContract(res.contracts);
        }
        setPagination(res.pagination);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchContract();
  }, [currentPage, status]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handlePageChange = (page: number) => {
    if (pagination) {
      if (pagination.page >= 1 && page <= pagination.totalPages) {
        setCurrentPage(page);
      }
    }
  };

  const handleApproveContract = async (id: string) => {
    if (!id) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }
    try {
      await approveContract(id);
      const res = await getAllContract(currentPage);
      setContract(res.contracts);
      setPagination(res.pagination);
      toast.success("đồng ý thành công!");
    } catch (error) {
      console.log("error: ", error);
      toast.error("đồng ý thất bại");
    }
  };

  const handleRejectContract = async (id: string) => {
    if (!id) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }
    try {
      await rejectContract(id, rejectReason);
      const res = await getAllContract(currentPage);
      setContract(res.contracts);
      setPagination(res.pagination);
      setOpen(false);
      toast.success("từ chối thành công!");
    } catch (error) {
      console.log("error: ", error);
      toast.error("từ chối thất bại");
    }
  };

  const handleOpen = (id: string) => {
    setSelectedContractId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setRejectReason("");
    setSelectedContractId(null);
  };

  return (
    <>
      <div className="mt-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Upload by
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {contract &&
                contract.map((data) => (
                  <tr
                    key={data._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {data.uploaded_by.fullName}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      <span className="break-all">
                        {data.uploaded_by.email}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          data.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                            : data.status === "rejected"
                            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                        }`}
                      >
                        {data.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-left gap-2">
                        <Tooltip title="view">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`${data.file_url}`)}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </Button>
                        </Tooltip>

                        {data.status === "superseded" && (
                          <>
                            <Tooltip title="approve">
                              <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() => handleApproveContract(data._id)}
                              >
                                approve
                              </Button>
                            </Tooltip>
                            <Tooltip title="reject">
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleOpen(data._id)}
                              >
                                reject
                              </Button>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination?.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <Pagination
            count={pagination.totalPages}
            page={currentPage}
            onChange={(_, value) => handlePageChange(value)}
            variant="outlined"
            shape="rounded"
            color="primary"
          />
        </div>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Lý do từ chối hợp đồng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nhập lý do từ chối"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() =>
              selectedContractId && handleRejectContract(selectedContractId)
            }
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default ContractsList;
