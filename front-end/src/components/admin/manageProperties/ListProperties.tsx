import { useLocation, useNavigate } from "react-router-dom";
import { getAllProperties } from "../../../services/propertyService";
import type { Property } from "../../../types/Property";
import { useEffect, useState } from "react";
import { Pagination, Tooltip } from "@mui/material";
import { getLanguage } from "../../../utils/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import HideProperties from "./HideProperties";
import { ToastContainer } from "react-toastify";

const ListProperties = () => {
  const currentLanguage = getLanguage();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const itemPerPages: number = 5;
  console.log(currentLanguage);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getAllProperties();
        console.log("Data return is ", response);
        setProperties(response || []);
      } catch (error) {
        console.log("Cannot fetch properties for this role", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [location.state?.refresh]);

  const filteredProperties = properties.filter((item) => {
    const matchSearch =
      item.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemPerPages);
  const startIndex = (currentPage - 1) * itemPerPages;
  const currentItems = filteredProperties.slice(
    startIndex,
    startIndex + itemPerPages
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <span className="text-gray-500 animate-pulse text-lg">
          {currentLanguage === "vi" ? "Đang tải dữ liệu..." : "loading..."}
        </span>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        {currentLanguage === "en"
          ? "Manage properties"
          : "Quản lí bất động sản"}
      </h1>
      <div className="flex justify-between items-center mb-4 ">
        <input
          type="text"
          placeholder={
            currentLanguage === "en"
              ? "Search by name or address"
              : "tìm kiếm tên hoặc địa chỉ"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-3"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mr-3"
        >
          <option value="">
            {currentLanguage === "en" ? "All status" : "Tất cả"}
          </option>
          <option value="approved">
            {" "}
            {currentLanguage === "en" ? "approved" : "đã phê duyệt"}
          </option>
          <option value="pending">
            {" "}
            {currentLanguage === "en" ? "pending" : "đợi phê duyệt"}
          </option>
          <option value="available">
            {currentLanguage === "en" ? "available" : "có sẵn"}
          </option>
          <option value="rejected">
            {currentLanguage === "en" ? "rejected" : "đã hủy"}
          </option>
        </select>
      </div>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {currentLanguage === "en" ? "avatar" : "ảnh đại diện"}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {currentLanguage === "en" ? "name" : "tên bđs"}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {currentLanguage === "en" ? "address" : "địa chỉ"}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {currentLanguage === "en" ? "status" : "trạng thái"}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {currentLanguage === "en" ? "action" : "chức năng"}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 border-b">
                <img
                  src={item.images[0]}
                  alt="Avatar"
                  className="rounded-full w-10 h-10"
                />
              </td>
              <td className="px-4 py-3 border-b max-w-[250px]">
                {currentLanguage === "en" ? item.title.en : item.title.vi}
              </td>
              <td className="px-4 py-3 border-b max-w-[250px]">
                {currentLanguage === "en" ? item.address.en : item.address.vi}
              </td>
              <td className="px-4 py-3 border-b">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "available"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "reject"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {currentLanguage === "en"
                    ? item.status
                    : item.status === "approved"
                      ? "Đã duyệt"
                      : item.status === "pending"
                        ? "Chờ duyệt"
                        : item.status === "available"
                          ? "có sẵn"
                          : "Bị từ chối"}
                </span>
              </td>
              <td className="px-4 py-3 border-b space-x-2">
                <div className="flex gap-2">
                  <Tooltip
                    title={currentLanguage === "vi" ? "Xem chi tiết" : "View"}
                  >
                    <button
                      onClick={() => navigate(`${item?._id}`)}
                      className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-md text-white bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>

                  </Tooltip>


                  <HideProperties propertyId={item?._id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <Pagination
            count={totalPages}
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

export default ListProperties;
