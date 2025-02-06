import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default function StateCard() {
  const [sales, setSale] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profit, setProfit] = useState([]);
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getSales();
    getProduct();
    getExpenses();
    getUserAll();
    getUser();
    getLoggedInUser();
    getTotalProfit();
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

  const getSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/total_sale");
      setSale(response.data);
    } catch (err) {
      setError("Error fetching sales");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/api/all_users");
      setUser(response.data);
    } catch (err) {
      setError("Error fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/total_product"
      );
      setProduct(response.data);
    } catch (err) {
      setError("Error fetching products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/total_expenses"
      );
      setExpenses(response.data);
    } catch (err) {
      setError("Error fetching expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getTotalProfit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:4000/api/total_profit"
      );
      setProfit(response.data);
    } catch (err) {
      setError("Error fetching total_profit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLoggedInUser = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/getUser");
      setLoggedInUser(response.data);
    } catch (err) {
      setError("Error fetching logged-in user");
      console.error(err);
    }
  };

  return (
    <>
      <Card
        title="کۆی فرۆشتن"
        value={
          sales.totalSales?.total_price_dolar === 0
            ? "0"
            : `$${
                Number(sales.totalSales?.total_price_dolar).toLocaleString() ||
                0
              }`
        }
        values={
          sales.totalSales?.total_price === 0
            ? "0"
            : `IQD ${
                Number(sales.totalSales?.total_price).toLocaleString() || 0
              }`
        }
      />

      {users?.[0]?.permission?.permissions === "Admin" && (
        <>
          <Card
            title="کۆی کڕین"
            values={
              expenses.total === 0
                ? "هیچ کڕینێک نیە"
                : `IQD ${
                    Number(
                      expenses.totalExpenses?.total_purchase
                    ).toLocaleString() || 0
                  }`
            }
            value={
              expenses.total === 0
                ? "0"
                : `$${
                    Number(
                      expenses.totalExpenses?.total_purchase_dolar
                    ).toLocaleString() || 0
                  }`
            }
          />
          <Card
            title="کۆی کاڵاکان"
            value=""
            values={`${
              !product.total || product.total === 0
                ? "0"
                : Number(product?.total).toLocaleString()
            }`}
          />
          <Card
            title="کۆی قازانج"
            value=""
            values={`IQD ${
              !profit.total || profit.total === 0
                ? "0"
                : Number(profit?.total).toLocaleString()
            }`}
          />
        </>
      )}
    </>
  );
}

const Card = ({ title, value, values, pillText, trend, period }) => {
  return (
    <div className="col-span-3 p-4 mt-6 rounded-lg border border-white shadow-lg">
      <div className="flex mb-8 items-center justify-between">
        <div>
          <h3 className="text-gray-500 mb-2 text-xl font-primaryRegular">
            {title}
          </h3>
          <p className="text-2xl font-semibold">{values}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
      {period && <p className="text-sm text-gray-500">{period}</p>}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  pillText: PropTypes.string,
  trend: PropTypes.oneOf(["up", "down"]),
  period: PropTypes.string,
};
