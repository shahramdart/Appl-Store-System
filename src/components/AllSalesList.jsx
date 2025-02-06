import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const AllSalesList = () => {
  const [sales, setSales] = useState([]);
  const [profit, setProfit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState({});
  const [error, setError] = useState(null);
  const [totalIQD, setTotalIQD] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);

  const [selectedMonth, setSelectedMonth] = useState(""); // State for selected month

  useEffect(() => {
    getSales();
  }, []);
  // Fetch all sales data
  useEffect(() => {
    getTotalProfit();
    getTotalSales();
  }, [selectedMonth]);

  const getSales = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a request
    try {
      const response = await axios.get("http://localhost:4000/api/sale");
      setSales(response.data);
    } catch (err) {
      setError("Error fetching sales: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalProfit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/total_profit"
      );
      setProfit(response.data);
    } catch (err) {
      setError("Error fetching total_profit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalSales = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/sale/total?month=${selectedMonth}`
      );
      console.log("Total Expenses Response:", response.data);

      // Extract values correctly
      const { total_purchase, total_purchase_dolar } =
        response.data.totalExpenses;

      setTotalIQD(total_purchase || 0);
      setTotalUSD(total_purchase_dolar || 0);
    } catch (error) {
      console.error("Error fetching total expenses:", error);
    }
  };

  // Filter sales by selected month
  const filteredSales = selectedMonth
    ? sales.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === parseInt(selectedMonth) - 1; // Match the month (0-indexed)
      })
    : sales;

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
          لیستی فرۆشتنەکان
        </h2>
        <h2 className="text-2xl text-gray-900 mb-6">
          IQD {Number(profit.total).toLocaleString()}
        </h2>
      </div>

      {loading && (
        <p className="text-gray-500 text-center items-center">Loading...</p>
      )}

      {/* Month filter input */}
      <div className="mb-4 flex justify-between items-center">
        <select
          id="month"
          className="flex-2 peer w-[300px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="" className="font-primaryRegular">
            هەموو مانگەکان
          </option>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <div className="flex flex-row text-gray-400 px-2 py-1 ml-2 rounded hover:text-gray-900 transition">
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button pl-2"
            table="table-to-xls"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Excel"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredSales.length === 0 ? (
          <p className="text-gray-500 font-primaryRegular text-center py-4">
            هیچ کاڵایەک نەفرۆشراوە
          </p>
        ) : (
          <>
            <table id="table-to-xls" className="min-w-full table-auto">
              <thead>
                <tr className="text-black">
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    جۆری کاڵا
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    بڕاند
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    ناو
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    لە لایەن
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    بەروار
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    دانە
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    نرخ بە دینار
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    نرخ بە دۆلار
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    کۆی گشتی IQD
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    کۆی گشتی $
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    قازانج
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    بینین
                  </th>
                </tr>
                <tr>
                  <td colSpan="8">
                    <hr className="h-0.25 bg-gray-700" />
                  </td>
                </tr>
              </thead>
              {filteredSales.map((sale, index) => (
                <tbody key={sale.id}>
                  {" "}
                  {/* Add key to tbody here */}
                  <tr key={sale.id} className="text-gray-900">
                    <td className="px-4 py-2">{sale.category_name || "N/A"}</td>
                    <td className="px-4 py-2">{sale.brand_name || "N/A"}</td>
                    <td className="px-4 py-2">{sale.product_name}</td>
                    <td className="px-4 py-2">{sale.user_name || "N/A"}</td>
                    <td className="px-4 py-2">
                      {sale.createdAt
                        ? new Date(sale.createdAt).toLocaleDateString("en-CA")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">{sale.quantity}</td>
                    <td className="px-4 py-2">
                      ${Number(sale.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      ${Number(sale.price_dolar).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      IQD {Number(sale.total_price).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      ${Number(sale.total_price_dolar).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      IQD {Number(sale.profit_amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 flex justify-start space-x-2">
                      {sale?.id && (
                        <Link
                          to="/invoice-list"
                          state={{ id: sale.id }}
                          className="text-gray-400  px-2 py-1 ml-2 rounded hover:text-gray-900 transition flex items-center"
                          aria-label={`View details of sale ${sale.id}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </Link>
                      )}
                    </td>
                  </tr>
                  {index < filteredSales.length - 1 && (
                    <tr>
                      <td colSpan="8">
                        <hr className="h-0.25 bg-gray-700 my-2" />
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </table>
            <div className="flex flex-row justify-between items-center px-4 ">
              <p className="text-gray-900  font-primaryRegular">
                کۆی گشتی کڕینەکان بە دینار: IQD {totalIQD.toLocaleString()}
              </p>
              <p className="text-gray-900 font-primaryRegular">
                کۆی گشتی کڕینەکان بە دۆلار: ${totalUSD.toLocaleString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllSalesList;
