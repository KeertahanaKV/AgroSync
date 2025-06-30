import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog } from "@headlessui/react"; // ✅ for modal
import HeroSection from "./Herosection";
import backendUrl from "../../config";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editedValues, setEditedValues] = useState({ price: "", quantity: "" });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${backendUrl}/inventory/all`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      }
    };

    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditedValues({ price: item.price, quantity: item.quantity });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${backendUrl}/inventory/update/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: editedValues.price,
          quantity: editedValues.quantity,
        }),
      });

      if (res.ok) {
        const updatedItems = items.map((item) =>
          item.id === editItem.id
            ? { ...item, price: editedValues.price, quantity: editedValues.quantity }
            : item
        );
        setItems(updatedItems);
        setIsEditOpen(false);
      } else {
        alert("Failed to update item.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure?");
    if (confirmed) {
      try {
        await fetch(`${backendUrl}/inventory/delete/${id}`, { method: "DELETE" });
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const categories = ["Seeds", "Fertilizers", "Tools", "Fruits"];
  const totalLowStock = items.filter((item) => item.quantity > 0 && item.quantity <= 10).length;
  const totalOutOfStock = items.filter((item) => item.quantity === 0).length;
  const totalInStock = items.filter((item) => item.quantity > 10).length;

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
                <div key={item.id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
                  <h3 className="font-bold text-lg text-green-900 mb-1">🛒 {item.name}</h3>
                  <p className="text-gray-700">💰 Price: ₹{item.price}</p>
                  <p className="text-gray-700">📦 Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    🗓️ Expires:{" "}
                    {item.expirationDate ? item.expirationDate : <span className="italic text-gray-400">No Expiry</span>}
                  </p>

                  <div className="mt-2">
                    {item.quantity === 0 ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full font-semibold">
                        Out of Stock
                      </span>
                    ) : item.quantity <= 10 ? (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-semibold">
                        In Stock
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex gap-3">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                      <Pencil size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      ))}

      {/* ✅ Edit Modal */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold mb-4">Edit Inventory Item</Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Price (₹)</label>
                <input
                  type="number"
                  value={editedValues.price}
                  onChange={(e) => setEditedValues({ ...editedValues, price: e.target.value })}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  value={editedValues.quantity}
                  onChange={(e) => setEditedValues({ ...editedValues, quantity: e.target.value })}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;
