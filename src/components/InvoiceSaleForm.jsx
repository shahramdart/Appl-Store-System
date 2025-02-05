import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function InvoiceSaleForm() {
  const [invoice, setInvoice] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch invoice data when component mounts
    getInvoice();
  }, []); // Empty dependency array to call only on mount

  const getInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/invoice");
      setInvoice(response.data); // Set invoice data
    } catch (err) {
      setError(err.message || "Error fetching invoices"); // Display actual error message if available
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // const filteredSales = selectedMonth
  //   ? sales.filter((sale) => {
  //       const saleDate = new Date(sale.createdAt);
  //       return saleDate.getMonth() === parseInt(selectedMonth) - 1; // Match the month (0-indexed)
  //     })
  //   : sales;

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
          لیستی پسوولەکان
        </h2>
      </div>

      {loading && (
        <p className="text-gray-500 text-center items-center">Loading...</p>
      )}

      {/* Month filter input */}
      <div className="mb-4 flex justify-between items-center">
        {/* <select
          id="month"
          className="flex-2 font-primaryRegular px-4 py-3 rounded-md bg-white shadow-md border border-gray-300"
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
        </select> */}
      </div>

      <div className="overflow-x-auto">
        {invoice.length === 0 ? (
          <p className="text-gray-500 font-primaryRegular text-center py-4">
            هیچ کاڵایەک نەفرۆشراوە
          </p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-black">
                <th className="px-4 py-2 text-right font-primaryRegular">#</th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  جۆری کاڵا
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  بڕاند
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  جۆر
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
                  کڕیار
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  بینین
                </th>
              </tr>
              <tr>
                <td colSpan="10">
                  <hr className="h-0.25 bg-gray-700" />
                </td>
              </tr>
            </thead>
            <tbody>
              {invoice.map((invoices, index) => (
                <React.Fragment key={invoices.id}>
                  <tr className="text-gray-900">
                    <td className="px-4 py-2">{invoices.id}</td>
                    <td className="px-4 py-2">
                      {invoices.products.product_name || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {invoices.products.brands?.brand_name}
                    </td>
                    <td className="px-4 py-2">
                      {invoices.products.category?.category_name || "N/A"}
                    </td>
                    <td className="px-4 py-2">{invoices.users.name}</td>
                    <td className="px-4 py-2">
                      {invoices.invoice_date
                        ? new Date(invoices.invoice_date).toLocaleDateString(
                            "en-CA"
                          )
                        : "N/A"}
                    </td>

                    <td className="px-4 py-2">{invoices.invoice_quantity}</td>

                    <td className="px-4 py-2">
                      IQD {Number(invoices.invoice_pirce).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      ${Number(invoices.invoice_pirce_dolar).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      IQD{" "}
                      {Number(invoices.invoice_total_pirce).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      $
                      {Number(
                        invoices.invoice_total_pirce_dolar
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">{invoices.invoice_customer}</td>
                    <td className="px-4 py-2 flex justify-start space-x-2">
                      {invoices?.id && (
                        <Link
                          to="/invoice/invoice-list"
                          state={{ id: invoices.id }}
                          className="text-gray-400  px-2 py-1 ml-2 rounded hover:text-gray-900 transition flex items-center"
                          aria-label={`View details of invoices ${invoices.id}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                            />
                          </svg>
                        </Link>
                      )}
                    </td>
                  </tr>
                  {index < invoice.length - 1 && (
                    <tr>
                      <td colSpan="10">
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

export default InvoiceSaleForm;
