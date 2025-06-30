import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import HeroSection from "./Herosection";

const Dashboard = () => {
  const initialItems = [
    {
      name: "Fertilizer A",
      price: 500,
      quantity: 20,
      expiry: "2025-12-30",
      category: "Fertilizers",
    },
    {
      name: "Pesticide B",
      price: 300,
      quantity: 15,
      expiry: "2025-11-15",
      category: "Fertilizers",
    },
    {
      name: "Seeds C",
      price: 120,
      quantity: 50,
      expiry: "2026-01-10",
      category: "Seeds",
    },
    {
      name: "Feed D",
      price: 200,
      quantity: 10,
      expiry: "2025-10-05",
      category: "Animal Feed",
    },
    {
      name: "Tractor Tool",
      price: 800,
      quantity: 5,
      expiry: "2026-06-10",
      category: "Tools",
    },
    {
      name: "Mango",
      price: 150,
      quantity: 0,
      expiry: "2025-06-10",
      category: "Fruits",
    },
  ];

  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (itemToEdit) => {
    const newPrice = prompt("Enter new price", itemToEdit.price);
    const newQty = prompt("Enter new quantity", itemToEdit.quantity);
    if (newPrice && newQty) {
      const updated = items.map((item) =>
        item.name === itemToEdit.name
          ? { ...item, price: newPrice, quantity: newQty }
          : item
      );
      setItems(updated);
    }
  };

  const handleDelete = (name) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      const filtered = items.filter((item) => item.name !== name);
      setItems(filtered);
    }
  };

  const categories = ["Seeds", "Fertilizers", "Tools", "Fruits", "Animal Feed"];

  const totalLowStock = items.filter(item => item.quantity > 0 && item.quantity <= 10).length;
  const totalOutOfStock = items.filter(item => item.quantity === 0).length;
  const totalInStock = items.filter(item => item.quantity > 10).length;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <HeroSection />
      </motion.div>

      <div className="my-6 text-center space-y-2">
        <h2 className="text-3xl font-bold text-green-800">📦 Inventory Dashboard</h2>
        <p className="text-lg text-gray-700">Total Items: {items.length}</p>
        <div className="flex justify-center gap-4 text-sm">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">In Stock: {totalInStock}</span>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Low Stock: {totalLowStock}</span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Out of Stock: {totalOutOfStock}</span>
        </div>
      </div>

      <div className="my-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-300"
        />
      </div>

      {categories.map((category, index) => (
        <motion.div
          key={category}
          custom={index}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-green-700 mb-2">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items
              .filter(
                (item) =>
                  item.category === category &&
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => (
                <div key={item.name} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
                  <h3 className="font-bold text-lg text-green-900 mb-1">🛒 {item.name}</h3>
                  <p className="text-gray-700">💰 Price: ₹{item.price}</p>
                  <p className="text-gray-700">📦 Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">🗓️ Expires: {item.expiry}</p>

                  <div className="mt-2">
                    {item.quantity === 0 ? (
                      <span className="inline-block bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full font-semibold">
                        Out of Stock
                      </span>
                    ) : item.quantity <= 10 ? (
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-block bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-semibold">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.name)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Dashboard;
