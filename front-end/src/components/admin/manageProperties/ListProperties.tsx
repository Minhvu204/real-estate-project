import { useNavigate } from "react-router-dom";
import { getAllProperties } from "../../../services/propertyService";
import type { Property } from "../../../types/Property";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";

const ListProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const itemPerPages: number = 5;

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getAllProperties();
      setProperties(data);
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((item) => {
    const matchSearch =
      item.title.vi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.vi.toLowerCase().includes(searchTerm.toLowerCase());
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

  if (!properties) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <span className="text-gray-500 animate-pulse text-lg">
          Đang tải dữ liệu...
        </span>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        manage Properties
      </h1>
      <div className="flex justify-between items-center mb-4 ">
        <input
          type="text"
          placeholder="Search by name or address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-3"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mr-3"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="available">Available</option>
          <option value="reject">Reject</option>
        </select>
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
              <td className="px-4 py-3 border-b max-w-[250px]">{item.title.vi}</td>
              <td className="px-4 py-3 border-b max-w-[250px]">
                {item.address.vi}
              </td>
              <td className="px-4 py-3 border-b">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.status === "approved"
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
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 border-b space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition cursor-pointer"
                  onClick={() => navigate(`${item?._id}`)}
                >
                  View
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition cursor-pointer"
                  onClick={() => navigate(`${item?._id}`)}
                >
                  Hide
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
                  onClick={() => navigate(`${item?._id}`)}
                >
                  Reason
                </button>
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
    </>
  );
};

export default ListProperties;
