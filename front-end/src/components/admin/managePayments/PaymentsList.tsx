import { getAllPayment } from "@/services/paymentService";
import type { Payment } from "../../../types/Payment";
import { Button, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import type { pagination } from "../../../types/Contract";

const PaymentsList = () => {
  const [payment, setPayment] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<pagination | null>(null);
  const [page, setPage] = useState<number>(1);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPayment(page);
      console.log(data);
      setPayment(data.payments);
      setPagination(data.pagination);
    };
    fetchData();
  }, []);

  const handlePageChange = (page: number) => {
    console.log(page);
    if (!pagination) return;

    if (page >= 1 && page <= pagination.totalPages) {
      setPage(page);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                initiated
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                amount
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                method
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                status
              </th>
              <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
                action
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
                    {data.amount} {data.currency}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {data.method}
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
                    <Button>View</Button>
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
            page={page}
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
