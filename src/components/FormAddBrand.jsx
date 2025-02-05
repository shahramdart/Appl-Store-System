import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormAddBrand = () => {
  const [brand_name, setBrandName] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveBrand = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/brands", {
        brand_name: brand_name,
      });
      navigate("/brands");
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
        زیادکردنی براند
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={saveBrand}>
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
    // <div className="container mx-auto mt-10 px-4">
    //   <h2 className="mb-6 text-2xl font-semibold text-white">جۆر زیادبکە</h2>
    //   <div className="bg-gray-800 shadow-lg rounded-lg p-6">
    //     <form onSubmit={saveBrand}>
    //       {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}
    //       <div className="mb-4">
    //         <label
    //           htmlFor="brand_name"
    //           className="block text-white font-medium mb-2"
    //         >
    //           ناوی بڕاند
    //         </label>
    //         <input
    //           type="text"
    //           className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
    //           id="brand_name"
    //           value={brand_name}
    //           onChange={(e) => setBrandName(e.target.value)}
    //           placeholder="ناوی بڕاند بنوسە"
    //         />
    //       </div>
    //       <div>
    //         <button
    //           type="submit"
    //           className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
    //         >
    //           Save
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default FormAddBrand;
