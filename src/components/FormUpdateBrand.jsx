import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FormUpdateBrand = () => {
  const [brand_name, setBrandName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  // Fetch category data based on ID
  useEffect(() => {
    const getBranById = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:4000/api/brands/${id}`
        );
        setBrandName(response.data.brand_name);
      } catch (error) {
        setMsg("Error fetching brand data");
      }
    };
    getBranById();
  }, [id]);

  // Handle brand update
  const updateCategory = async (e) => {
    e.preventDefault();

    if (!brand_name) {
      setMsg("Category name cannot be empty.");
      return;
    }

    const brandData = {
      brand_name,
    };

    try {
      await axios.put(`http://localhost:4000/api/brands/${id}`, brandData);

      navigate("/brands"); // Redirect after success
    } catch (error) {
      setMsg("Error updating brand");
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        نوێکردنەوەی براند
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={updateCategory}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          <div className="mb-6">
            <label htmlFor="brand_name" className="block text-black mb-2">
              ناوی براند
            </label>
            <input
              type="text"
              id="brand_name"
              className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
              value={brand_name}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="ناوی براند"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white p-3 rounded-md hover:bg-gray-900 transition-all"
          >
            نوێکردنەوە
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUpdateBrand;
