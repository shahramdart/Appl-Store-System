import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // State for selected month
  const [totalIQD, setTotalIQD] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);

  // Fetch all expenses data
  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    getTotalExpensesMonth();
  }, [selectedMonth]);

  const getExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/expenses");
      setExpenses(response.data);
    } catch (err) {
      setError("Error fetching expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalExpensesMonth = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/expenses/total?month=${selectedMonth}`
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

  // Filter Expenses by selected month
  const filteredExpenses = selectedMonth
    ? expenses.filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate.getMonth() === parseInt(selectedMonth) - 1;
      })
    : expenses;

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl text-gray-900 mb-6">لیستی کڕینەکان</h2>

      {loading && <p className="text-white">Loading...</p>}

      {/* Month filter input */}
      <div className="mb-4 flex justify-between items-center">
        <select
          id="month"
          className="flex-2 font-primaryRegular px-4 py-3 rounded-md bg-white shadow-md border border-gray-300"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">هەموو مانگەکان</option>
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
            filename="expenses"
            sheet="expenses"
            buttonText="Excel"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4 font-primaryRegular">
            هیچ کڕینێک نەدۆزراندن
          </p>
        ) : (
          <>
            <table id="table-to-xls" className="min-w-full table-auto">
              <thead>
                <tr className="text-black">
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    جۆری کڕین
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    دانە
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    جۆر
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    بەروار
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
                    لەلایەن
                  </th>
                  <th className="px-4 py-2 text-right font-primaryRegular">
                    بینین
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <React.Fragment key={expense.id}>
                    <tr className="text-gray-900">
                      <td className="px-4 py-2">{expense.product_name}</td>
                      <td className="px-4 py-2">{expense.quantity}</td>
                      <td className="px-4 py-2">
                        {expense.category_name || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {expense.createdAt
                          ? new Date(expense.createdAt).toLocaleDateString(
                              "en-CA"
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        IQD {Number(expense.purchase_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        ${Number(expense.purchase_price_dolar).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {`IQD ${Number(
                          expense.total_purchase
                        ).toLocaleString()}`}
                      </td>
                      <td className="px-4 py-2">
                        {`$${Number(
                          expense.total_purchase_dolar
                        ).toLocaleString()}`}
                      </td>
                      <td className="px-4 py-2">
                        {expense.user_name || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {expense?.id && (
                          <Link
                            to="/expenses/view"
                            state={{ id: expense.id }}
                            className="text-gray-400 px-2 py-1 ml-2 rounded hover:bg-gray-4900 transition"
                            aria-label={`View details of expense ${expense.id}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6"
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
                  </React.Fragment>
                ))}
              </tbody>
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

export default ExpensesList;
