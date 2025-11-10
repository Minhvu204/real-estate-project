import { useNavigate, useParams } from "react-router-dom";
import type { DetailProperty } from "../../../types/Property";
import { useEffect, useState } from "react";
import { getDetailPropertiesById } from "../../../services/propertyService";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ViewDetailProperties = () => {
  const [property, setProperty] = useState<DetailProperty | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProperty = async () => {
      const data = await getDetailPropertiesById(id!);
      console.log(data);

      setProperty(data);
    };
    fetchProperty();
  }, [id]);

  if (!property) {
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
      <div className="relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full text-indigo-600 hover:bg-white hover:shadow-lg transition-all duration-300"
        >
          <span className="text-lg">←</span>
          <span className="font-medium hidden sm:inline">Trở lại</span>
        </button>
        <Carousel
          showArrows={true}
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3500}
          stopOnHover={true}
          swipeable={true}
        >
          {property?.images.map((item, index) => (
            <div key={index}>
              <img
                src={item}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-[250px] sm:h-[400px] md:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </Carousel>

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent text-white px-4 sm:px-8 py-4 sm:py-6">
          <h2 className="text-xl sm:text-3xl font-bold drop-shadow-lg">
            {property.title.vi}
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 italic mt-1">
            {property.address.vi}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-gray-200 pb-6 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Thông tin chi tiết
            </h3>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Cập nhật ngày:{" "}
              <span className="font-medium">
                {new Date(property.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 lg:mt-0">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              {property.price.toLocaleString()} VND
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                property.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : property.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : property.status === "available"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {property.status === "approved"
                ? "approved"
                : property.status === "pending"
                ? "pending"
                : property.status === "available"
                ? "available"
                : "reject"}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
            <span className="text-blue-600 text-2xl">🛏</span>
            <div>
              <p className="text-sm text-gray-500">Phòng ngủ</p>
              <p className="text-lg font-semibold">{property.bedrooms}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
            <span className="text-blue-600 text-2xl">🛁</span>
            <div>
              <p className="text-sm text-gray-500">Phòng tắm</p>
              <p className="text-lg font-semibold">{property.bathrooms}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border">
            <span className="text-blue-600 text-2xl">📍</span>
            <div>
              <p className="text-sm text-gray-500">Thành phố</p>
              <p className="text-lg font-semibold">
                {property.city.city_name.vi}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
            📝 Mô tả chi tiết
          </h4>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            {property.description.vi}
          </p>
        </div>

        {property.features?.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              🌟 Tiện ích nổi bật
            </h4>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {property.features.map((f) => (
                <span
                  key={f._id}
                  className="bg-indigo-50 text-indigo-700 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-indigo-100"
                >
                  {f.feature_name.vi}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img
            src={property.owner.avatar}
            alt={property.owner.fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
              👤 {property.owner.fullName}
            </h4>
            <p className="text-gray-500 text-sm sm:text-base">
              {property.owner.email}
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              {property.owner.phone}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDetailProperties;
