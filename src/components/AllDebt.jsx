import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AllDebt() {
  const [sales, setSales] = useState([]);
  const [profit, setProfit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all sales data
  useEffect(() => {
    getSales();
    getTotalProfit();
  }, []);

  const getSales = async () => {
    setLoading(true);
    setError(null); // Reset error state before making a request
    try {
      const response = await axios.get("http://localhost:4000/api/payment");
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

  // Filter sales by selected month
  const filteredProducts = sales.filter((product) => {
    const customerName =
      typeof product.customer_name === "string"
        ? product.customer_name.toLowerCase()
        : "";

    return customerName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
          لیستی قەرزەکان
        </h2>
      </div>

      {loading && (
        <p className="text-gray-500 text-center items-center">Loading...</p>
      )}

      {/* Month filter input */}
      <div className="flex items-center justify-between mb-4">
        {/* Search Input */}
        <input
          type="text"
          className="flex-2 peer bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
          placeholder="گەڕان بکە..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 font-primaryRegular text-center py-4">
            هیچ قەرزێک بوونی نییە!
          </p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-black">
                <th className="px-4 py-2 text-right font-primaryRegular">
                  جۆری کاڵا
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  براند
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  ناو
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  لە بەرواری
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  بۆ بەرواری
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  دانە
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  نرخ
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  پێشەکی
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  زیدکراو
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  پارەی ماوە
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  کۆی گشتی
                </th>

                <th className="px-4 w-32 py-2 text-right font-primaryRegular">
                  قیستی ماوە
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  کڕیار
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  بینین
                </th>
              </tr>
              <tr>
                <td colSpan="13">
                  <hr className="h-0.25 bg-gray-700" />
                </td>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((sale, index) => (
                <React.Fragment key={sale.id}>
                  <tr className="text-gray-900">
                    <td className="px-4 py-2">
                      {sale.products.category.category_name || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {sale.products.brands.brand_name || "N/A"}
                    </td>
                    <td className="px-4 py-2">{sale.products.product_name}</td>
                    <td className="px-4 py-2">
                      {sale.date
                        ? new Date(sale.date).toLocaleDateString("en-CA")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {sale.final_date
                        ? new Date(sale.final_date).toLocaleDateString("en-CA")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">{sale.quantity}</td>
                    <td className="px-4 py-2">${sale.product_price}</td>
                    <td className="px-4 py-2">${sale.peshaky_payment}</td>
                    <td className="px-4 py-2">${sale.paray_zyada}</td>
                    <td className="px-4 py-2">${sale.paray_mawa}</td>
                    <td className="px-4 py-2">${sale.total_price}</td>
                    <td className="px-4 py-2">{sale.qisty_mawa}</td>
                    <td className="px-4 py-2">{sale.customer_name}</td>
                    <td className="px-4 py-2 flex justify-start space-x-2">
                      {sale?.id && (
                        <Link
                          to="/debt/invoice-list"
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
                  {index < filteredProducts.length - 1 && (
                    <tr>
                      <td colSpan="8">
                        <hr className="h-0.25 bg-gray-700 my-2" />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AllDebt;
