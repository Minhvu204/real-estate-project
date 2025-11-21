import { useNavigate, useParams } from "react-router-dom";
import { getDealById } from "../../../services/dealService";
import type { Deal } from "../../../types/Deal";
import { useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { Carousel } from "react-responsive-carousel";

const DealDetail = () => {
  const [deal, setDeal] = useState<Deal | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDetailDeal = async () => {
      const data = await getDealById(id!);
      console.log("deal: ", data);
      setDeal(data);
      setLoading(false);
    };
    fetchDetailDeal();
  }, [id]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center">
          <div>loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      {deal && (
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-5xl mx-auto">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Bất động sản: {deal.property_id.title.vi}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                deal.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              Trạng thái: {deal.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-600 mb-2"> Môi giới</h3>
              <div className="text-gray-800">{deal.agent_id?.fullName}</div>
              <div className="text-gray-500 text-sm">
                {deal.agent_id?.email}
              </div>
              <div className="text-gray-500 text-sm">
                {deal.agent_id?.phone}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-600 mb-2">Người mua</h3>
              <div className="text-gray-800">{deal.buyer_id.fullName}</div>
              <div className="text-gray-500 text-sm">{deal.buyer_id.email}</div>
              <div className="text-gray-500 text-sm">
                {deal.buyer_id?.phone}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-semibold text-gray-600 mb-2">Người bán</h3>
              <div className="text-gray-800">{deal.seller_id.fullName}</div>
              <div className="text-gray-500 text-sm">
                {deal.seller_id.email}
              </div>
              <div className="text-gray-500 text-sm">
                {deal.seller_id.phone}
              </div>
            </div>
          </div>
          <div className="mb-1">
            <span className="bg-green-500 p-2 rounded-2xl">
              giá tiền: {deal.property_id.price.toLocaleString()} VND
            </span>
          </div>
          <div>
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
              {deal.property_id.images.map((item, index) => (
                <div key={index}>
                  <img
                    src={item}
                    alt={`Bất động sản ${index + 1}`}
                    className="w-full h-[220px] sm:h-[350px] md:h-[450px] object-cover rounded-lg mt-4"
                  />
                </div>
              ))}
            </Carousel>

            <div className="flex justify-end mt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                onClick={() => navigate(`property/${deal.property_id._id}`)}
              >
                Xem chi tiết bất động sản
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DealDetail;
