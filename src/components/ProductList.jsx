import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getProducts();
    getUser();
  }, []);

  const getUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/users");

      setUsers(response.data);
    } catch (err) {
      setError("Error fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:4000/api/product");

      if (response.data.length === 0) {
        setProducts([]);
      } else {
        setProducts(response.data);
      }
    } catch (err) {
      setError("Error fetching products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on the search query
  const filteredProducts = products.filter((product) => {
    const productName =
      typeof product.product_name === "string"
        ? product.product_name.toLowerCase()
        : "";
    const productQrCode = product.product_qrcode
      ? product.product_qrcode.toString()
      : ""; // Convert bigint to string
    const productCategory = product.category?.category_name
      ? product.category?.category_name.toString()
      : ""; // Convert bigint to string

    return (
      productName.includes(searchQuery.toLowerCase()) ||
      productCategory.includes(searchQuery.toLowerCase()) ||
      productQrCode.includes(searchQuery)
    );
  });

  const deleteProduct = async (id) => {
    try {
      // Optimistically remove the product from the state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      // Delete the product from the backend
      await axios.delete(`http://localhost:4000/api/product/${id}`);

      // Optionally, fetch updated list from the server to confirm
      // getProducts();
    } catch (err) {
      setError("Error deleting product");
      console.error(err);

      // If an error occurs, add the product back to the list
      // This is to maintain consistency in case of failure
      getProducts();
    }
  };

  return (
    <div className="container mx-auto mr-10 mt-10 p-4">
      <h2 className="text-2xl text-gray-900 mb-6 font-primaryRegular">
        لیستی کاڵاکان
      </h2>
      <div className="flex items-center justify-between mb-4">
        {/* Search Input */}
        <input
          type="text"
          className="flex-2 peer bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
          placeholder="گەڕان بکە..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {users?.[0]?.permission?.permissions === "Admin" ? (
          <Link
            to={`/products/add`}
            className="flex items-center font-primaryRegular text-lg bg-gray-700 text-white px-4 ml-20 py-2 rounded-md hover:bg-gray-900"
          >
            زیادکردن
          </Link>
        ) : null}
      </div>

      {loading && <p className="text-white">Loading...</p>}

      {products.length === 0 ? (
        <p className="text-gray-500 font-primaryRegular text-center py-4">
          هیچ کاڵایەک بەردەست نییە !
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto ">
            <thead>
              <tr className="text-black">
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  جۆری کاڵا
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  ڕەنگ
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  دینار
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  دۆلار
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  عەدەد
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  باڕکۆد
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  جۆر
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  براند
                </th>
                <th className=" px-4 py-2 text-right font-primaryRegular">
                  بەروار
                </th>
                {users?.[0]?.permission?.permissions === "Admin" ? (
                  <th className=" px-4 py-2 text-right font-primaryRegular">
                    کردارەکان
                  </th>
                ) : null}
              </tr>
              <tr>
                <td colSpan="9">
                  <hr className="h-0.25 bg-gray-700" />
                </td>
              </tr>
            </thead>

            {filteredProducts.length > 0 ? (
              <tbody>
                {filteredProducts.map((product, index) => (
                  <React.Fragment key={product.id}>
                    <tr key={product.id} className="text-gray-900">
                      <td className="px-4 py-2">{product.product_name}</td>
                      <td className="px-4 py-2 font-primaryRegular">
                        {product.product_color || "بەردەست نیە"}
                      </td>
                      <td className="px-4 py-2">
                        IQD {Number(product.product_price).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        ${Number(product.product_price_dolar).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{product.product_qty}</td>
                      <td className="px-4 py-2">{product.product_qrcode}</td>
                      <td className="px-4 py-2">
                        {product.category?.category_name || "N/A"}
                      </td>

                      <td className="px-4 py-2">
                        {product.brands?.brand_name || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString(
                              "en-CA"
                            )
                          : "N/A"}
                      </td>
                      {users?.[0]?.permission?.permissions === "Admin" && (
                        <td className=" px-2 py-2 flex justify-start space-x-2">
                          <Link
                            to="/products/update"
                            state={{ id: product.id }}
                            className="text-gray-400 px-2 py-1 ml-2 rounded hover:text-gray-900 transition"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="size-6"
                            >
                              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
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
                      )}
                    </tr>
                    {index < filteredProducts.length - 1 && (
                      <tr>
                        <td colSpan="9">
                          <hr className="h-0.25 bg-gray-700 my-2" />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            ) : (
              <div className="flex justify-center items-center">
                <p className="text-red-500 text-xl font-primaryRegular text-center py-4">
                  هیچ کاڵایەک نەدۆزرایەوە !
                </p>
              </div>
            )}
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
