import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllProperties,
  getAllPropertiesByPending,
  updateStatus,
} from "../../../services/propertyService";
import type { Property } from "../../../types/Property";
import { useEffect, useState } from "react";
import { Pagination, Tooltip } from "@mui/material";
import { getLanguage, type Lang } from "../../../utils/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import HideProperties from "./HideProperties";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

const ListProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const { t } = useTranslation("listProperties");

  const itemPerPages: number = 10;
  const currentLanguage: Lang = getLanguage();
  const status = searchParams.get("status");
  const isManageMode = status === "pending";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = isManageMode
          ? await getAllPropertiesByPending()
          : await getAllProperties();

        console.log("Data return is ", data);

        if (status && !isManageMode) {
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
  }, [status, isManageMode]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus);
      toast.success(
        currentLanguage === "en"
          ? `Property ${newStatus} successfully`
          : `Cập nhật trạng thái "${newStatus}" thành công!`
      );
      setProperties(properties.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(
        currentLanguage === "en"
          ? "Failed to update property status"
          : "Cập nhật trạng thái thất bại!"
      );
      console.error(error);
    }
  };

  const filteredProperties = properties.filter((item) => {
    const matchSearch =
      item.title?.[currentLanguage]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.address?.[currentLanguage]
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
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
          {t("loading")}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder={t("search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-3"
        />

        {!isManageMode && !status && (
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mr-3"
          >
            <option value="">{t("All status")}</option>
            <option value="approved">{t("Approved")}</option>
            <option value="pending">{t("Pending")}</option>
            <option value="available">{t("Available")}</option>
            <option value="rejected">{t("Rejected")}</option>
          </select>
        )}
      </div>

      <div className="mt-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("avatar")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("name")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("address")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("status")}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("action")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <img
                        src={item.images[0]}
                        alt={t("avatar")}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 max-w-[260px] text-sm font-medium text-gray-900">
                    <span className="line-clamp-2">
                      {item.title?.[currentLanguage]}
                    </span>
                  </td>

                  <td className="px-4 py-3 max-w-[280px] text-sm text-gray-700">
                    <span className="line-clamp-2">
                      {item.address?.[currentLanguage]}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
                ${
                  item.status === "approved"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    : item.status === "pending"
                    ? "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                    : item.status === "available"
                    ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                    : item.status === "rejected"
                    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                    : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {currentLanguage === "en"
                        ? item.status
                        : item.status === "approved"
                        ? "Đã duyệt"
                        : item.status === "pending"
                        ? "Chờ duyệt"
                        : item.status === "available"
                        ? "Có sẵn"
                        : "Bị từ chối"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-left gap-2">
                      <Tooltip title={t("view")}>
                        <button
                          onClick={() => navigate(`${item?._id}`)}
                          className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </Tooltip>

                      {isManageMode ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(item._id, "approved")
                            }
                            className="cursor-pointer px-3 h-9 flex items-center justify-center rounded-md text-white bg-green-500 hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-200 text-xs font-medium"
                          >
                            {t("approve")}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(item._id, "rejected")
                            }
                            className="cursor-pointer px-3 h-9 flex items-center justify-center rounded-md text-white bg-red-500 hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200 text-xs font-medium"
                          >
                            {t("reject")}
                          </button>
                        </>
                      ) : (
                        <HideProperties propertyId={item?._id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
