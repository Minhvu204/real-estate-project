import { deleteReview, getAllReview } from "../../../services/reviewService";
import type { Review, ReviewPagination } from "../../../types/Review";
import { Button, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const ReviewList = () => {
  const [review, setReview] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<ReviewPagination | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  useEffect(() => {
    const fetchReview = async () => {
      const res = await getAllReview(currentPage);
      console.log("review: ", res);
      setReview(res.reviews);
      setPagination(res.pagination);
    };
    fetchReview();
  }, []);

  const handlePageChange = (page: number) => {
    if (!pagination) return;

    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await deleteReview(id);
      toast.success("delete thành công");
      const res = await getAllReview(currentPage);
      setReview(res.reviews);
      setPagination(res.pagination);
    } catch (err) {
      toast.error("delete thất bại");
      console.log("err: ", err);
    }
  };

  return (
    <>
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
              name
            </th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
              comment
            </th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 border-b">
              action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {review &&
            review.map((data) => (
              <tr key={data._id} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {data.user_id.fullName}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {data.comment}
                </td>
                <td className="px-4 py-3">
                  <Button variant="outlined">View</Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDelete(data._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

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

export default ReviewList;
