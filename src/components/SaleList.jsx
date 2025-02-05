import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useScanDetection from "use-scan-detection";

function SaleList() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [salesRecords, setSalesRecords] = useState([]);
  const [product_qrcode, setProductQrCode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // ? for datepicker
  const [selectedDate, setSelectedDate] = useState(null); // Initialize the date state
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  useScanDetection({
    onComplete: setProductQrCode,
    minLength: 1,
  });

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/product");
      setProducts(response.data);
    } catch (err) {
      setError("Error fetching products");
      console.error(err);
    }
  };

  useEffect(() => {
    // Check if any product has 0 quantity and disable the button
    const checkProductStock = async () => {
      const product_id = selectedProduct?.id; // Assuming you have selectedProduct with the ID

      if (product_id) {
        const productResponse = await axios.get(
          `http://localhost:4000/api/product/${product_id}`
        );
        const product = productResponse.data;

        if (product.product_qty === 0) {
          setIsButtonDisabled(true);
        } else {
          setIsButtonDisabled(false); // Enable the button if quantity is available
        }
      }
    };

    checkProductStock(); // Check stock whenever the selectedProduct changes
  }, [selectedProduct]); // Triggered every time selectedProduct changes

  // ? Getting data by qrcode
  const handleQrCodeChange = async (e) => {
    const enteredQrcode = e.target.value.trim(); // Remove extra spaces
    setProductQrCode(enteredQrcode);

    if (enteredQrcode === "") {
      setSelectedProduct(null);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/product/qrcode/${enteredQrcode}`
      );

      const fetchedProduct = response.data;

      // Check if the product is already in salesRecords
      const isAlreadyAdded = salesRecords.some(
        (record) => record.productQrcode === fetchedProduct.product_qrcode
      );

      if (isAlreadyAdded) {
        alert("ئەم بەرهەمە پێشتر زیاد کراوە");
      } else {
        // Add fetched product to the salesRecords array with default values
        const newSale = {
          productName: fetchedProduct.product_name,
          categoryName: fetchedProduct.category?.category_name,
          brandName: fetchedProduct.brands?.brand_name,
          quantity: 1, // Default quantity
          price: 0, // Default price
          totalPrice: 0, // Calculated based on quantity and price
          discount: 0,
          productQrcode: fetchedProduct.product_qrcode,
          productId: fetchedProduct.id, // Assuming the product ID is available in fetchedProduct
        };
        setSalesRecords((prevRecords) => [...prevRecords, newSale]);
        setProductQrCode("");
      }

      setSelectedProduct(fetchedProduct);
      setError(null);
    } catch (err) {
      setError("Product not found");
      setSelectedProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // ? salling items
  const handleInsertSalesData = async () => {
    try {
      if (isButtonDisabled) {
        return; // Stop further execution if the button is disabled
      }

      for (const record of salesRecords) {
        const product_id = parseInt(record.productId, 10);

        if (!product_id || isNaN(product_id)) {
          console.error(
            `Invalid product_id for record with productId: ${record.productId}`
          );
          continue; // Skip invalid product IDs
        }

        // Proceed with the sale data insertion
        const salesData = {
          salling_date: formattedDate, // Current date
          salling_quantity: record.quantity || 1,
          salling_price: record.price || null,
          salling_discount: record.discount || selectedProduct?.discount || 0,
          salling_description:
            record.description || selectedProduct?.description || "",
          salling_status: record.status || selectedProduct?.status || "کاش",
          product_id: record.productId, // Use `record.productId` instead of `selectedProduct.id`
          invoice_customer: record.invoice_customer || "Walk-in",
          customer_phoneNo: record.customer_phoneNo || "Walk-in",
          customer_address: record.customer_address || "Walk-in",
          salling_price_dolar: record.salling_price_dolar || 0,
        };

        const response = await axios.post(
          "http://localhost:4000/api/salling",
          salesData
        );

        if (response.status >= 200 && response.status < 300) {
          console.log("Sale data inserted successfully:", response.data);
        } else {
          console.error("Error inserting sale data:", response.data);
        }
      }

      // Refresh the page after data insertion
      window.location.reload();
    } catch (error) {
      console.error("Unexpected error:", error.response?.data || error.message);
    }
  };

  //? Update quantity or price dynamically
  const handleInputChange = (index, field, value) => {
    const updatedRecords = [...salesRecords];

    // Handle updating the field (including description which can be null)
    if (field === "description") {
      updatedRecords[index][field] = value === "" ? null : value; // Set null if value is empty string
    } else {
      updatedRecords[index][field] = value;
    }

    // Update total price when quantity or price changes
    if (
      field === "quantity" ||
      field === "price" ||
      field === "invoice_customer" ||
      field === "salling_price_dolar" ||
      field === "customer_phoneNo" ||
      field === "customer_address"
    ) {
      const quantity = parseFloat(updatedRecords[index].quantity) || null;
      const price = parseFloat(updatedRecords[index].price) || null;
      updatedRecords[index].totalPrice = quantity * price;
    }

    setSalesRecords(updatedRecords);
  };

  const totalQuantity = salesRecords.reduce(
    (sum, record) => sum + (parseFloat(record.quantity) || 0),
    0
  );

  // ? add more record tbody in table
  const handleAddSale = () => {
    if (!productId) {
      alert("Please select a product first.");
      return;
    }

    // Find the selected product based on its `id`
    const selectedProduct = products.find(
      (product) => product.id === productId
    );

    if (!selectedProduct) {
      alert("Selected product is not found in the available list.");
      return;
    }

    // Check if the product is already in salesRecords
    const isAlreadyAdded = salesRecords.some(
      (record) => record.productId === selectedProduct.id
    );

    if (isAlreadyAdded) {
      alert("This product is already added.");
      return;
    }

    // Add selected product to the salesRecords array
    const newSale = {
      productName: selectedProduct.product_name,
      categoryName: selectedProduct.category?.category_name || "N/A",
      brandName: selectedProduct.brands?.brand_name || "N/A",
      quantity: 1, // Default quantity
      price: selectedProduct.price || 0, // Default price
      totalPrice: selectedProduct.price || 0, // Default total
      productId: selectedProduct.id,
    };

    setSalesRecords((prevRecords) => [...prevRecords, newSale]);
    setProductId(""); // Reset selection
  };

  const totalAmount = salesRecords.reduce((acc, record) => {
    // Ensure totalPrice is a number before adding
    return acc + (record.totalPrice || 0);
  }, 0);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-CA") // "YYYY-MM-DD" format without timezone issues
    : new Date().toLocaleDateString("en-CA");

  return (
    <div className="realtive px-6 py-8">
      <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
        بەشی فرۆشتنی نەقد
      </h2>
      {/* // ? Flex container for datepicker and table */}
      <div className="flex flex-row items-start justify-start gap-16">
        {/* // ? rows for table and datepicker */}
        <div className="flex flex-col">
          {/* // ? Datepicker section */}
          <div className="relative max-w-[213px]">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-2 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
            />
            {/* // ? Calendar Icon */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="absolute left-1 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
          </div>
          {/* // ? add new record */}
          <div className="max-w-[212px] mt-10">
            <div className="relative group">
              {/* SVG Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-6 h-6 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                />
              </svg>
              {/* Button */}
              <button
                onClick={handleInsertSalesData}
                disabled={isButtonDisabled}
                className={`w-full font-primaryRegular bg-gray-700 text-start placeholder:text-slate-100 text-slate-100 text-sm border border-slate-200 rounded-md px-6 py-4 transition duration-300 ease-in-out focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900 active:bg-gray-100 active:scale-95"
                }`}
              >
                پاشەکەوت
              </button>
            </div>
            {/* // ? sale and print  */}
          </div>
        </div>

        <div className="">
          <div className="flex flex-row items-start justify-start gap-10">
            {/* // ? qrcode input */}
            <div className="max-w-sm w-64">
              <div className="relative">
                {/* // ? <!-- SVG Icon --> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                  />
                </svg>

                {/* // ? <!-- Input Field --> */}
                <input
                  className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                  value={product_qrcode}
                  onChange={handleQrCodeChange} // Handle barcode input change
                />
                {/* // ? <!-- Label --> */}
                <label className="absolute font-primaryRegular cursor-text bg-white px-1 right-2.5 top-3.5 text-slate-400 text-sm transition-all transform origin-right peer-focus:-top-2 peer-focus:right-2.5 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90">
                  باڕکۆد
                </label>
              </div>
            </div>
            {/* // ? Category Selection (Select Dropdown) */}
            {/* Category Selection */}
            <div className="max-w-sm w-64">
              <div className="relative">
                <select
                  className="peer font-primaryRegular text-sm w-full bg-transparent placeholder:text-slate-400 text-slate-400 border border-slate-200 rounded-md py-[18px] transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                  value={productId}
                  onChange={(e) => {
                    const selectedProductId = Number(e.target.value);
                    setProductId(selectedProductId);
                    console.log("Selected Product ID:", selectedProductId);
                  }}
                >
                  <option value="">هەموو کاڵاکان</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Add New Sale Button */}
            <button
              className="flex font-primaryRegular flex-row justify-center w-36 items-center rounded-md bg-slate-800 py-3 px-4 border border-transparent text-center text-lg text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="button"
              onClick={handleAddSale}
              disabled={!productId} // Disable button if no product is selected
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              زیادکردن
            </button>
            {/* New button for printing items */}
          </div>

          {/* // ? Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto mt-12">
              <thead>
                <tr className="text-slate-500">
                  <th className="px-2 py-2 w-36 text-right font-primaryRegular">
                    ناو
                  </th>
                  <th className="px-2 py-2 text-right font-primaryRegular">
                    عەدەد
                  </th>
                  <th className="px-2 py-2 text-right font-primaryRegular">
                    نرخ بە دۆلار
                  </th>
                  <th className="px-2 py-2 text-right font-primaryRegular">
                    نرخ بە دینار
                  </th>
                  <th className="px-2 py-2 text-right font-primaryRegular">
                    ناوی کڕیار
                  </th>
                  <th className="px-2 py-2 text-right font-primaryRegular">
                    ناونیشان
                  </th>
                  <th className="px-2 py-2 text-right font-primaryRegular">
                    ژ.موبایل
                  </th>

                  <th className="px-2 py-2 text-right font-primaryRegular">
                    تێبینی
                  </th>
                </tr>
                <tr>
                  <td colSpan="10">
                    <hr className="h-0.25 bg-gray-700" />
                  </td>
                </tr>
              </thead>
              <tbody>
                {salesRecords.map((sale, index) => (
                  <tr key={index} className="text-gray-900">
                    <td className="px-2 py-2 w-48 text-sm text-right">
                      {sale.productName}
                    </td>
                    <td className="px-2 py-2 text-sm text-right">
                      {selectedProduct && selectedProduct.length === 0 ? (
                        <input
                          value={sale.quantity} // Ensure there's a default value in case quantity is undefined
                          disabled
                          onChange={(e) =>
                            handleInputChange(index, "quantity", e.target.value)
                          }
                          className="w-24 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                          type="number" // Ensure the input accepts only numbers
                          min="1" // Ensure the minimum value is 1
                        />
                      ) : (
                        <input
                          value={sale.quantity} // Ensure there's a default value in case quantity is undefined
                          onChange={(e) =>
                            handleInputChange(index, "quantity", e.target.value)
                          }
                          className="w-24 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                          type="number" // Ensure the input accepts only numbers
                          min="1" // Ensure the minimum value is 1
                        />
                      )}
                    </td>
                    <td className="py-2 text-sm text-right">
                      <div className="flex flex-row items-center max-w-sm w-36">
                        {selectedProduct && selectedProduct.length === 0 ? (
                          <div className="relative flex items-center">
                            <input
                              value={
                                salesRecords[index]?.salling_price_dolar || ""
                              }
                              disabled
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "salling_price_dolar",
                                  e.target.value
                                )
                              }
                              className="w-32 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                            $
                          </div>
                        ) : (
                          <div className="relative flex items-center">
                            <input
                              value={
                                salesRecords[index]?.salling_price_dolar || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "salling_price_dolar",
                                  e.target.value
                                )
                              }
                              className="w-32 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                            $
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 text-sm text-right">
                      <div className="flex flex-row items-center max-w-sm w-36">
                        {selectedProduct && selectedProduct.length === 0 ? (
                          <div className="relative flex items-center">
                            <input
                              disabled
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              className="w-24 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                            IQD
                          </div>
                        ) : (
                          <div className="relative flex items-center">
                            <input
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "price",
                                  e.target.value
                                )
                              }
                              className="w-24 bg-white text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                            IQD
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-sm text-right">
                      <div className="flex flex-row  items-start  w-36">
                        <div className="relative flex items-start">
                          {selectedProduct && selectedProduct.length === 0 ? (
                            <input
                              value={
                                salesRecords[index]?.invoice_customer || ""
                              }
                              disabled
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "invoice_customer",
                                  e.target.value
                                )
                              }
                              placeholder="ناوی کڕیار"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          ) : (
                            <input
                              value={
                                salesRecords[index]?.invoice_customer || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "invoice_customer",
                                  e.target.value
                                )
                              }
                              placeholder="ناوی کڕیار"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-sm text-right">
                      <div className="flex flex-row  items-start  w-36">
                        <div className="relative flex items-start">
                          {selectedProduct &&
                          selectedProduct.product_qty === 0 ? (
                            <input
                              value={
                                salesRecords[index]?.customer_address || ""
                              }
                              disabled
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "customer_address",
                                  e.target.value
                                )
                              }
                              placeholder="ناونیشان"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          ) : (
                            <input
                              value={
                                salesRecords[index]?.customer_address || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "customer_address",
                                  e.target.value
                                )
                              }
                              placeholder="ناونیشان"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-sm text-right">
                      <div className="flex flex-row  items-start  w-36">
                        <div className="relative flex items-start">
                          {selectedProduct &&
                          selectedProduct.product_qty === 0 ? (
                            <input
                              value={
                                salesRecords[index]?.customer_phoneNo || ""
                              }
                              disabled
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "customer_phoneNo",
                                  e.target.value
                                )
                              }
                              placeholder="ژ.موبایل"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          ) : (
                            <input
                              value={
                                salesRecords[index]?.customer_phoneNo || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "customer_phoneNo",
                                  e.target.value
                                )
                              }
                              placeholder="ژ.موبایل"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-2 text-sm text-right">
                      <div className="flex flex-row items-center max-w-sm w-36">
                        <div className="relative flex items-center">
                          {selectedProduct &&
                          selectedProduct.product_qty === 0 ? (
                            <input
                              value={salesRecords[index]?.description || ""}
                              disabled
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="تێبینی"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          ) : (
                            <input
                              value={salesRecords[index]?.description || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="تێبینی"
                              className="w-36 bg-transparent font-primaryRegular text-slate-700 text-sm py-3 border-b-2 border-slate-200 focus:border-slate-500 focus:outline-none transition duration-300 ease rtl:text-right"
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          setSalesRecords((prevRecords) =>
                            prevRecords.filter((_, i) => i !== index)
                          )
                        }
                        className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-red-600 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* total invoice */}
            </table>
            {/* total qty and price after */}
            <div className="h-8 bg-gray-100 w-[60rem] pr-2 rounded-b-sm flex items-center justify-between">
              <span className="h-8 w-[50%] text-start font-primaryRegular">
                کۆی گشتی پسوولە
              </span>
              <span className="h-8 w-[43%] pr-2 text-start font-primaryRegular bg-white">
                {totalQuantity} عدد
              </span>
              <span className="h-8 w-[21%] pr-2 text-start font-primaryRegular bg-white">
                IQD {Number(totalAmount).toLocaleString()}
              </span>
            </div>
            {selectedProduct && selectedProduct.product_qty === 0 && (
              <div className="flex flex-row justify-center items-center mt-10 bg-red-500 w-[200px] h-8 rounded-md">
                <span className="pr-2 text-2xl text-white font-primaryRegular">
                  عددی نەماوە
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* // ? detail about products */}
      <div className="absolute bg-white border-t-4 border-r-4 border-gray-200 rounded-tr-xl shadow-2xl min-w-[350px] min-h-[250px] p-6 bottom-0 left-0 flex flex-col justify-start items-start">
        {selectedProduct && (
          <>
            <div className="mb-10">
              <h2 className="text-lg font-normal">
                {selectedProduct?.brands?.brand_name} -{" "}
                {selectedProduct.product_name}
              </h2>
              <h2
                className={
                  selectedProduct.product_qty
                    ? "text-black"
                    : "text-red-500 text-xl"
                }
              >
                {selectedProduct.product_qty} عدد ماوە
              </h2>
            </div>
            <div className="">
              <h3 className="text-gray-500">
                نرخ بە دینار: IQD{" "}
                {Number(selectedProduct.product_price).toLocaleString()}
              </h3>
              <h3 className="text-gray-500">
                نرخ بە دۆلار:{" "}
                {Number(selectedProduct.product_price_dolar).toLocaleString()}$
              </h3>
              <span className="text-sm text-gray-500">
                جۆری کاڵا - {selectedProduct?.category?.category_name}{" "}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SaleList;
