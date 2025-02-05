import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FormUpdateCategory = () => {
  const [category_name, setCategoryName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  // Fetch category data based on ID
  useEffect(() => {
    const getCategoryById = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:4000/api/categories/${id}`
        );
        setCategoryName(response.data.category_name);
      } catch (error) {
        setMsg("Error fetching category data");
      }
    };
    getCategoryById();
  }, [id]);

  // Handle category update
  const updateCategory = async (e) => {
    e.preventDefault();

    if (!category_name) {
      setMsg("Category name cannot be empty.");
      return;
    }

    const categoryData = {
      category_name,
    };

    try {
      const res = await axios.put(
        `http://localhost:4000/api/categories/${id}`,
        categoryData
      );
      console.log(res.data);

      navigate("/category"); // Redirect after success
    } catch (error) {
      setMsg("Error updating category");
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        نوێکردنەوەی جۆر
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={updateCategory}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          <div className="mb-6">
            <label htmlFor="category_name" className="block text-black mb-2">
              ناوی جۆر
            </label>
            <input
              type="text"
              id="category_name"
              className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
              value={category_name}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="ناوی جۆر"
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

export default FormUpdateCategory;
