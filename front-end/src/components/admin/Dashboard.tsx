import { getAllContractStatistic } from "../../services/contractService";
import { getAllDealStatistic } from "../../services/dealService";
import type { Contract } from "../../types/Contract";
import type { Deal } from "../../types/Deal";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";

export default function SimpleStatisticDashboard() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filterType, setFilterType] = useState("year"); // "month" | "year"
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealData = await getAllDealStatistic();
        const contractData = await getAllContractStatistic();
        setDeals(dealData);
        setContracts(contractData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Lấy danh sách năm từ dữ liệu
  const yearsSet = new Set();
  [...deals, ...contracts].forEach((item) => {
    if (item.createdAt) yearsSet.add(new Date(item.createdAt).getFullYear());
  });
  const years = Array.from(yearsSet).sort((a: any, b: any) => b - a);
  if (years.length === 0) years.push(today.getFullYear());

  // Lọc dữ liệu
  const filterByDate = (items: any) =>
    items.filter((item: any) => {
      if (!item.createdAt) return false;
      const date = new Date(item.createdAt);
      if (filterType === "month")
        return (
          date.getMonth() + 1 === Number(selectedMonth) &&
          date.getFullYear() === Number(selectedYear)
        );
      if (filterType === "year")
        return date.getFullYear() === Number(selectedYear);
      return true;
    });

  const dealCount = filterByDate(deals).length;
  const contractCount = filterByDate(contracts).length;

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-md shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Thống kê hợp đồng & giao dịch
      </h2>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button
          className={`px-3 py-1 rounded border ${
            filterType === "year"
              ? "bg-blue-500 text-white"
              : "bg-white border-gray-300 text-gray-800"
          }`}
          onClick={() => setFilterType("year")}
        >
          Theo năm
        </button>
        <button
          className={`px-3 py-1 rounded border ${
            filterType === "month"
              ? "bg-blue-500 text-white"
              : "bg-white border-gray-300 text-gray-800"
          }`}
          onClick={() => setFilterType("month")}
        >
          Theo tháng
        </button>
        {filterType === "month" && (
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        )}
        {(filterType === "month" || filterType === "year") && (
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((y: any) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex justify-center">
        <PieChart
          series={[
            {
              data: [
                { label: "Deals", value: dealCount },
                { label: "Contracts", value: contractCount },
              ],
            },
          ]}
          width={280}
          height={200}
        />
      </div>
      <div className="mt-4 flex justify-center gap-5">
        <span className="text-gray-600 font-medium">
          Deals: <b>{dealCount}</b>
        </span>
        <span className="text-gray-600 font-medium">
          Contracts: <b>{contractCount}</b>
        </span>
      </div>
    </div>
  );
}
