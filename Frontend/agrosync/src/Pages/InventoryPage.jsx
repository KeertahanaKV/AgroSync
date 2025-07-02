import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backendUrl from "../config";

const InventoryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    remaining: "",
    dateBought: "",
    expirationDate: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      if (value === "Tools") {
        setFormData({
          name: "",
          price: "",
          category: "Tools",
          quantity: "",
          remaining: "",
          dateBought: "",
          expirationDate: "",
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key] !== "") {
        form.append(key, formData[key]);
      }
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${backendUrl}/inventory/add`, {
        method: "POST",
        body: form,
        headers: {
          "x-access-token": token,
        },
      });
      const result = await res.json();
      alert(result.message);
      navigate("/dashboard");
    } catch (error) {
      console.error("Inventory submission error:", error);
      alert("Error submitting inventory");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-orange-600 text-center mb-8"
        >
          🛠️ Add Inventory Item
        </motion.h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select</option>
              <option value="Tools">Tools</option>
              <option value="Seeds">Seeds</option>
              <option value="Fruits">Fruits</option>
              <option value="Fertilizers">Fertilizers</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
              placeholder="e.g., Mango Seeds"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Show conditionally for all except Tools */}
          {formData.category !== "Tools" && (
            <>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Total Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Remaining</label>
                <input
                  type="number"
                  name="remaining"
                  value={formData.remaining}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Date Bought</label>
                <input
                  type="date"
                  name="dateBought"
                  value={formData.dateBought}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Expiration Date</label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition duration-300"
            >
              ➕ Add Inventory Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryPage;
