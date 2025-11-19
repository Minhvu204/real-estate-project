import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";

const PaymentsList = () => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        manage payments
      </h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="search"
          className="border px-3 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-3"
        />
      </div>

      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              avatar
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              name
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              address
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              status
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              action
            </th>
          </tr>
        </thead>
      </table>

      {5 > 1 && (
        <div className="flex justify-center items-center mt-6">
          <Pagination
            count={5}
            page={1}
            // onChange={(_, value) => handlePageChange(value)}
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

export default PaymentsList;
