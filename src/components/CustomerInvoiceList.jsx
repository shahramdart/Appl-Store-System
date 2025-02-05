import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Logo from "../assets/logo.jpg";
const CustomerInvoiceList = () => {
  const location = useLocation();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const customerId = location.state?.customerId;

  useEffect(() => {
    if (customerId) {
      getInvoiceDetails(customerId);
    } else {
      setError("Customer ID is missing");
    }
  }, [customerId]);

  const getInvoiceDetails = async (customerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/customers/${customerId}`
      );
      setInvoice(response.data);
    } catch (err) {
      setError("Error fetching invoice details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const printRef = useRef();
  const handlePrint = () => {
    // Backup original title
    const originalTitle = document.title;

    // Set new title for the print preview
    document.title = "BAKO PHONE";
    const now = new Date();
    const formattedDate = now.toLocaleDateString(); // e.g., "1/17/2025"
    const formattedTime = now.toLocaleTimeString(); // e.g., "10:34 AM"

    // Open print preview with right-aligned content
    const printContents = `
        <div style="text-align: right; direction: rtl; margin: 20px;">
          <header style="text-align: center; font-size: 15px; padding-top: 20px; font-family: "Times New Roman", Times, serif;">
            <strong>BAKO PHONE</strong>
          </header>
            <div style="text-align: end; margin-bottom: 10px; font-size: 10px">
          <span>${formattedDate}  ${formattedTime}</span>
        </div>
          ${printRef.current.innerHTML}
        </div>
      `;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();

    // Restore original content and title
    document.body.innerHTML = originalContents;
    document.title = originalTitle;

    window.location.reload(); // Reload to restore original content
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-row justify-center">
      <div className="div items-center min-w-[50%] max-w-[50%] mt-8 p-4">
        <div
          ref={printRef}
          className="flex flex-col justify-center items-center border border-gray-400 rounded-md"
        >
          <div className="relative flex flex-row justify-center items-center">
            {/* Image */}
            <img src={Logo} alt="Logo" className="h-80 w-full object-cover" />
          </div>
          {invoice &&
          Array.isArray(invoice.sales) &&
          invoice.sales.length > 0 ? (
            <>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200 border-b-2 border-gray-300">
                  <tr className="h-12">
                    <th className="p-2 text-right font-primaryRegular">#</th>
                    <th className="p-2 text-right font-primaryRegular">
                      کڕیار
                    </th>
                    <th className="p-2 text-right font-primaryRegular">کاڵا</th>
                    <th className="p-2 text-right font-primaryRegular">
                      بەروار
                    </th>
                    <th className="p-2 text-right font-primaryRegular">عدد</th>
                    <th className="p-2 text-right font-primaryRegular">
                      نرخ بە دینار
                    </th>
                    <th className="p-2 text-right font-primaryRegular">
                      نرخ بە دۆلار
                    </th>
                    <th className="p-2 text-right font-primaryRegular">
                      کۆی گشتی
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {invoice.sales.flatMap((sale, index) =>
                    sale.invoices.map((invoiceItem, subIndex) => (
                      <tr key={`${sale.id}-${subIndex}`} className="h-12">
                        <td className="text-right p-2">{index + 1}</td>
                        <td className="text-right p-2">
                          {invoice.sales[0]?.invoices[0]?.invoice_customer ||
                            "N/A"}
                        </td>
                        <td className="text-right p-2">
                          {sale.product || "N/A"}
                        </td>

                        <td className="text-right p-2">
                          {new Date(
                            invoiceItem?.invoice_date
                          ).toLocaleDateString("en-CA")}
                        </td>
                        <td className="text-right p-2">
                          {invoiceItem?.invoice_quantity || "N/A"}
                        </td>
                        <td className="text-right p-2">
                          IQD{" "}
                          {Number(invoiceItem?.invoice_pirce).toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          ${" "}
                          {Number(
                            invoiceItem?.invoice_pirce_dolar
                          ).toLocaleString()}
                        </td>
                        <td className="text-right p-2">
                          IQD{" "}
                          {Number(
                            invoiceItem?.invoice_total_pirce
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Invoice Summary */}
              <div className="flex flex-row justify-between w-full rounded-b-md bg-gray-200 h-12 p-2">
                <span className="font-primaryRegular text-lg">کۆی گشتی</span>
                <span className="font-primaryRegular pr-10 text-lg">
                  {invoice.sales.reduce(
                    (total, sale) =>
                      total +
                      sale.invoices.reduce(
                        (subTotal, invoice) =>
                          subTotal + invoice.invoice_quantity,
                        0
                      ),
                    0
                  )}
                  عدد
                </span>
                <span className="pl-2 text-right text-lg">
                  IQD{" "}
                  {invoice.sales
                    .reduce(
                      (total, sale) =>
                        total +
                        sale.invoices.reduce(
                          (subTotal, invoice) =>
                            subTotal + Number(invoice.invoice_total_pirce),
                          0
                        ),
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <p>No invoice found</p>
          )}
        </div>
        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="flex  items-center font-primaryRegular text-lg mt-10 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          چاپکردن{" "}
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
        </button>
      </div>
    </div>
  );
};

export default CustomerInvoiceList;
