import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useScanDetection from "use-scan-detection";

const UpdateProducts = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [price_dolar, setProductPriceDolar] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [qty, setQty] = useState("");
  const [qrcode, setQrcode] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Get the product ID from state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        setMsg("Error fetching categories");
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/brands");
        setBrands(response.data);
      } catch (error) {
        setMsg("Error fetching brands");
      }
    };

    const fetchProduct = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/product/${id}`
          );
          const product = response.data;
          setName(product.product_name || "");
          setColor(product.product_color || "");
          setPrice(product.product_price || "");
          setProductPriceDolar(product.product_price_dolar || "");
          setExchangeRate(product.exchangeRate || "");
          setQty(product.product_qty || "");
          setQrcode(product.product_qrcode || "");
          setCategoryId(product.category_id || "");
          setBrandId(product.brand_id || "");
        } catch (error) {
          setMsg("Error fetching product data");
        }
      }
    };

    fetchCategories();
    fetchBrands();
    fetchProduct();
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();
    const productData = {
      product_name: name,
      product_color: color,
      product_price: price,
      product_price_dolar: parseFloat(price_dolar), // Ensure this is a number
      exchangeRate: exchangeRate || 1500,
      product_qty: qty,
      brand_id: brandId,
      product_qrcode: qrcode,
      category_id: categoryId,
    };


    try {
      const response = await axios.put(
        `http://localhost:4000/api/product/${id}`,
        productData
      );
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  return (
    <div className="p-6  min-h-screen overflow-hidden">
      <h2 className="text-2xl font-bold text-black mt-4 mb-4">
        زیادکردنی کاڵا
      </h2>
      <div className="bg-white border-white rounded-md p-6 shadow-2xl">
        <form onSubmit={updateProduct}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          {/* Input Fields */}
          <div className="">
            <div className="mb-4 flex  gap-4">
              <div className="w-1/2">
                <label htmlFor="name" className="block text-black mb-2">
                  ناوی کاڵا
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ناوی کاڵا"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="color" className="block text-black mb-2">
                  ڕەنگی کاڵا
                </label>
                <input
                  type="text"
                  id="color"
                  className="w-full p-3 rounded-md bg-white shadow-lg text-black border border-gray-300"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="ڕەنگی کاڵا"
                />
              </div>
            </div>
            <div className="mb-4 flex gap-4">
              {/* <div className="w-[25%]">
                <label htmlFor="price" className="block text-black mb-2">
                  نرخ بە دۆلار
                </label>
                <input
                  type="text" // Changed to number type
                  id="price"
                  className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                  value={price_dolar}
                  onChange={(e) => setProductPriceDolar(e.target.value)}
                  placeholder="نرخ بە دۆلار"
                />
              </div> */}

              <div className="w-1/2">
                <label htmlFor="price" className="block text-black mb-2">
                  نرخ بە دینار
                </label>
                <input
                  type="text"
                  id="price"
                  value={price || ""} // Ensure price is controlled
                  className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      !isNaN(value.replace(/,/g, "")) &&
                      value.trim() !== ""
                    ) {
                      setPrice(value); // Only set the price in dinars
                    }
                  }}
                  placeholder="نرخی کاڵا"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="exchangeRate" className="block text-black mb-2">
                  نرخی ئەمڕۆی دۆلار
                </label>
                <input
                  type="text"
                  id="exchangeRate"
                  className="w-full p-3 rounded-md bg-white shadow-lg text-black border border-gray-300"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  placeholder="نرخی دۆلار"
                />
              </div>
            </div>

            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label htmlFor="qty" className="block text-black mb-2">
                  عەدەدی کاڵا
                </label>
                <input
                  type="number"
                  id="qty"
                  className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="عەدەدی کاڵا"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="qrcode" className="block text-black mb-2">
                  باڕکۆدی کاڵا
                </label>
                <input
                  type="text"
                  id="qrcode"
                  className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
                  value={qrcode}
                  onChange={(e) => setQrcode(e.target.value)}
                  placeholder="باڕکۆدی کاڵا"
                />
              </div>
            </div>

            <div className="mb-4 flex gap-4">
              {/* Dropdowns */}
              <div className="w-1/2">
                <label htmlFor="category" className="block text-black mb-2">
                  جۆر
                </label>
                <select
                  id="category"
                  className="w-full p-3  rounded-md bg-white shadow-lg text-black border border-gray-300"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">جۆر هەڵبژێرە</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Dropdowns */}
              <div className="w-1/2">
                <label htmlFor="category" className="block text-black mb-2">
                  براند
                </label>
                <select
                  id="category"
                  className="w-full p-3  rounded-md bg-white shadow-lg text-black border border-gray-300"
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                >
                  <option value="">براند هەڵبژێرە</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brand_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition-all"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProducts;
