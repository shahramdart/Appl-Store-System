import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormAddCategory = () => {
  const [category_name, setCategory_name] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/categories", {
        category_name: category_name,
      });
      navigate("/category");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        زیادکردنی جۆر
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={saveUser}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          <div className="mb-6">
            <label htmlFor="category_name" className="block text-black mb-2">
              ناوی بەش
            </label>
            <input
              type="text"
              id="category_name"
              className="w-full p-3 rounded-md bg-white shadow-md border border-gray-300"
              value={category_name}
              onChange={(e) => setCategory_name(e.target.value)}
              placeholder="ناوی بەش"
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

export default FormAddCategory;
