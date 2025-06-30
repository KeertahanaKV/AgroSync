import React, { useState } from 'react';

const InventoryPage = () => {
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await fetch("http://localhost:5000/inventory/add", {
        method: "POST",
        body: form,
      });

      const result = await res.json();
      alert(result.message);
    } catch (error) {
      alert("Error submitting inventory");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity Remaining</label>
          <input
            type="number"
            name="remaining"
            value={formData.remaining}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Bought</label>
          <input
            type="date"
            name="dateBought"
            value={formData.dateBought}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expiration Date</label>
          <input
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select</option>
            <option value="Tools">Tools</option>
            <option value="Seeds">Seeds</option>
            <option value="Fruits">Fruits</option>
            <option value="Fertilizers">Fertilizers</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryPage;
