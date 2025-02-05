import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Fetch permissions from the backend
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/permission"
        );
        setPermissions(response.data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
        setMsg("Failed to load permissions");
      }
    };

    fetchPermissions();
  }, []);

  const saveUser = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name) {
      setMsg("All fields are required!");
      return;
    } else if (!email) {
      setMsg("email is required!");
      return;
    } else if (!password) {
      setMsg("password is required!");
      return;
    } else if (!userPhone) {
      setMsg("userPhone is required!");
      return;
    } else if (!confirmPassword) {
      setMsg("confirmPassword is required!");
      return;
    } else if (!selectedPermission) {
      setMsg("selectedPermission is required!");
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/users", {
        name,
        email,
        password,
        user_phone: userPhone,
        permission: selectedPermission, // Send the permission name, not the ID
      });
      navigate("/users"); // Redirect after successful creation
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg); // Display error message from backend
      } else {
        setMsg("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen overflow-hidden bg-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-6 text-center">
        زیادکردنی بەکارهێنەر
      </h2>
      <div className="bg-white rounded-md p-6 shadow-lg max-w-4xl mx-auto">
        <form onSubmit={saveUser}>
          {msg && <p className="text-center text-red-500 mb-4">{msg}</p>}

          {/* Input Fields */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-primaryRegular text-black mb-2"
              >
                ناوی بەکارهێنەر
              </label>
              <input
                type="text"
                id="name"
                className="peer w-full font-primaryRegular pr-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ناوی بەکارهێنەر"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block  text-lg font-primaryRegular text-black mb-2"
              >
                ئیمەیڵ
              </label>
              <input
                type="email"
                id="email"
                className="peer w-full font-primaryRegular pr-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ئیمەیڵ"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-primaryRegular text-black mb-2"
              >
                وشەی نهێنی
              </label>
              <input
                type="text"
                id="password"
                className="peer w-full font-primaryRegular pr-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="وشەی نهێنی"
              />
            </div>

            <div>
              <label
                htmlFor="confirmePassword"
                className="block text-lg font-primaryRegular text-black mb-2"
              >
                وشەی نهێنی پشتڕاست بکەرەوە
              </label>
              <input
                type="text"
                id="confirmePassword"
                className="peer w-full font-primaryRegular pr-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="وشەی نهێنی پشتڕاست بکەرەوە"
              />
            </div>
            <div>
              <label
                htmlFor="userPhone"
                className="block text-lg font-primaryRegular text-black mb-2"
              >
                ژ.موبایل
              </label>
              <input
                type="text"
                id="userPhone"
                className="peer w-full font-primaryRegular pr-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="وشەی نهێنی پشتڕاست بکەرەوە"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-lg font-primaryRegular text-black mb-2"
              >
                دەسەڵات
              </label>
              <select
                id="permissions"
                className="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-4 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow rtl:text-right"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value)}
              >
                <option value="" disabled>
                  دەسەڵات هەڵبژێرە
                </option>
                {permissions.map((permission) => (
                  <option key={permission.id} value={permission.permissions}>
                    {permission.permissions}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-xl bg-gray-700 font-primaryRegular text-white p-3 rounded-md hover:bg-gray-900 transition-all"
          >
            پاشەکەوت
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormAddUser;
