import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllPropertiesByPending,
  updateStatus,
} from "../../../services/propertyService";
import type { Property } from "../../../types/Property";
import { useEffect, useState } from "react";
import { Pagination, Tooltip } from "@mui/material";
import { getLanguage, type Lang } from "../../../utils/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import ButtonLanguage from "../../common/ButtonLanguage";
import { useTranslation } from "react-i18next";
const ManageProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("listProperties");
  const itemPerPages: number = 5;
  const currentLanguage: Lang = getLanguage();
  const status = searchParams.get("status");
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllPropertiesByPending();
        console.log("Data return is ", data);
        if (status) {
          setProperties(
            data.filter((properties) => properties.status === status)
          );
        } else {
          setProperties(data || []);
        }
      } catch (error) {
        console.log("Cannot fetch properties for this role", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus(id, status);
      toast.success(
        currentLanguage === "en"
          ? `Property ${status} successfully`
          : `Cập nhật trạng thái "${status}" thành công!`
      );

      const refreshed = await getAllPropertiesByPending();
      if (status) {
        setProperties(refreshed.filter((p) => p.status === status));
      } else {
        setProperties(refreshed);
      }
    } catch (error) {
      toast.error(
        currentLanguage === "en"
          ? "Failed to update property status"
          : "Cập nhật trạng thái thất bại!"
      );
      console.error(error);
    }
  };

  const totalPages = Math.ceil(properties.length / itemPerPages);
  const startIndex = (currentPage - 1) * itemPerPages;
  const currentItems = properties.slice(startIndex, startIndex + itemPerPages);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <span className="text-gray-500 animate-pulse text-lg">
          {t("loading")}
        </span>
      </div>
    );
  }

  return (
    <>
      <ButtonLanguage />
      <h1 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        {t("text-ManageProperties")}
      </h1>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {t("avatar")}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {t("name")}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {t("address")}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {t("status")}
            </th>
            <th className="px-4 py-2 text-left text-gray-600 font-semibold border-b">
              {t("action")}
            </th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 border-b">
                <img
                  src={item.images[0]}
                  alt={t("avatar")}
                  className="rounded-full w-10 h-10"
                />
              </td>
              <td className="px-4 py-3 border-b max-w-[250px]">
                {item.title[currentLanguage]}
              </td>
              <td className="px-4 py-3 border-b max-w-[250px]">
                {item.address[currentLanguage]}
              </td>
              <td className="px-4 py-3 border-b">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                  {currentLanguage === "en" ? "pending" : "Chờ duyệt"}
                </span>
              </td>
              <td className="px-4 py-3 border-b space-x-2">
                <div className="flex gap-2">
                  <Tooltip title={t("view")}>
                    <button
                      onClick={() => navigate(`${item?._id}`)}
                      className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-md text-white bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </Tooltip>

                  <button
                    onClick={() => handleUpdateStatus(item._id, "approved")}
                    className="cursor-pointer w-17 h-9 flex items-center justify-center rounded-md text-white bg-green-500 hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {t("approve")}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item._id, "rejected")}
                    className="cursor-pointer w-17 h-9 flex items-center justify-center rounded-md text-white bg-red-500 hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {t("reject")}
                  </button>
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

export default ManageProperties;
