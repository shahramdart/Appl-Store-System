import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CustomersInvoiceList = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSales, setCustomerSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/customer");
      setCustomers(res.data);
    } catch (error) {
      setError("Error fetching customers");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerSales = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/customers/${id}`);

      setCustomerSales(res.data);
      setSelectedCustomer(res.data.customer);
    } catch (error) {
      setError("Error fetching customer sales");
      console.error("Error fetching customer sales:", error);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="overflow-x-auto">
        {customerSales && customerSales.length === 0 ? (
          <p className="text-gray-500 font-primaryRegular text-center py-4">
            هیچ کاڵایەک نەفرۆشراوە
          </p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-black">
                <th className="px-4 py-2 text-right font-primaryRegular">#</th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  ناو
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  ناونیشان
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  ژ.موبایل
                </th>
                <th className="px-4 py-2 text-right font-primaryRegular">
                  بینین
                </th>
              </tr>
              <tr>
                <td colSpan="4">
                  <hr className="h-0.25 bg-gray-700" />
                </td>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <React.Fragment key={customer.id}>
                  <tr className="text-gray-900">
                    <td className="px-4 py-2">{customer.invoice_id || "0"}</td>
                    <td className="px-4 py-2">{customer.customer_name}</td>
                    <td className="px-4 py-2">
                      {customer.customer_address || "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {customer.customer_phoneNo || "N/A"}
                    </td>
                    <td className="px-4 py-2 flex justify-start space-x-2">
                      {customer?.id ? (
                        <Link
                          to="/customer/invoice"
                          state={{ customerId: customer.id }}
                          className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-gray-900 transition flex items-center"
                          aria-label={`View details of invoices for ${customer.customer_name}`}
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
                      ) : (
                        <p>Customer ID is missing!</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4">
                      <hr className="h-0.25 bg-gray-700 my-2" />
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomersInvoiceList;
