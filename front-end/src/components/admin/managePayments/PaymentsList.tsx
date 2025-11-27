import { getAllPayment } from "@/services/paymentService";
import type { Payment } from "../../../types/Payment";
import { Button, Pagination, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import type { pagination } from "../../../types/Contract";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentsList = () => {
  const [payment, setPayment] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const { t } = useTranslation("payment");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPayment(currentPage, status || undefined);
      console.log("PaymentList return is: ", data);
      setPayment(data.payments);
      setPagination(data.pagination);
    };
    fetchData();
  }, [status, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handlePageChange = (page: number) => {
    if (!pagination) return;

    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                {t("initiated")}
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                {t("method")}
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                {t("status")}
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                {t("action")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {payment &&
              payment.map((data) => (
                <tr
                  key={data._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {data.initiated_by?.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {data.method === "payos_qr"
                      ? t("payos_qr")
                      : data.method === "internal_release"
                      ? t("internal_release")
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`
                    inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                    ${
                      data.status === "completed"
                        ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                        : data.status === "cancelled"
                        ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                        : data.status === "failed"
                        ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                        : data.status === "processing"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                        : data.status === "pending"
                        ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100"
                        : "bg-gray-50 text-gray-700 ring-1 ring-gray-100"
                    }
                  `}
                    >
                      {data.status === "completed"
                        ? t("completed")
                        : data.status === "cancelled"
                        ? t("cancelled")
                        : data.status === "failed"
                        ? t("cancelled")
                        : data.status === "processing"
                        ? t("processing")
                        : data.status === "pending"
                        ? t("pending")
                        : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Tooltip title={t("view_tooltip")}>
                      <Button onClick={() => navigate(`${data._id}`)}>
                        {t("view_btn")}
                      </Button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
    </>
  );
};

export default PaymentsList;
