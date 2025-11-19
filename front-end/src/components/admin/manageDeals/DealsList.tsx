import { approveOrRejectDeal, getAllDeal } from "../../../services/dealService";
import type { Deal } from "../../../types/Deal";
import type { pagination } from "../../../types/Contract";
import { Button, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const DealsList = () => {
  const [deal, setDeal] = useState<Deal[]>([]);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const res = await getAllDeal(currentPage);
        console.log(res);
        setDeal(res.deals);
        setPagination(res.pagination);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeal();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    console.log(page);
    if (!pagination) return;

    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await approveOrRejectDeal(id, status);
      const res = await getAllDeal(currentPage);
      setDeal(res.deals);
      setPagination(res.pagination);

      toast.success(
        status === "completed"
          ? "Duyệt deal thành công"
          : "Từ chối deal thành công"
      );
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  return (
    <>
      <div className="mt-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Property
                </th>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {deal &&
                deal.map((data) => (
                  <tr
                    key={data._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      <span className="line-clamp-2">
                        {data?.property_id?.title?.vi}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`
                    inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                    ${
                      data.status === "completed"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : data.status === "cancelled"
                        ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                    }
                  `}
                      >
                        {data.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-left gap-2">
                        <Button size="small" variant="outlined">
                          view
                        </Button>

                        {data.status === "awaiting_contract" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleUpdateStatus(data._id, "completed")
                              }
                            >
                              complete
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() =>
                                handleUpdateStatus(data._id, "cancelled")
                              }
                            >
                              cancel
                            </Button>
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

      {pagination && pagination.totalPages > 1 && (
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

export default DealsList;
