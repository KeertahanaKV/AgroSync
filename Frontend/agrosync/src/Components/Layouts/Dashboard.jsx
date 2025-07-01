import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog } from "@headlessui/react";
import HeroSection from "./Herosection";
import backendUrl from "../../config";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editedValues, setEditedValues] = useState({ price: "", quantity: "" });
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token not found. Please login again.");
          return;
        }

        const res = await fetch(`${backendUrl}/user/dashboard`, {
          headers: { "x-access-token": token },
        });

        if (res.status === 401) {
          const data = await res.json();
          setError(data.message || "Unauthorized. Please log in.");
          return;
        }

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard.");
      }
    };

    fetchDashboard();
  }, []);

  const handleEdit = (item) => {
    setEditItem(item);
    setEditedValues({ price: item.price, quantity: item.quantity });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editItem || !editItem.id) {
      alert("Item ID missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/inventory/update/${editItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({
          price: editedValues.price,
          quantity: editedValues.quantity,
        }),
      });

      if (res.ok) {
        const updatedItems = userData.inventory.map((item) =>
          item.id === editItem.id
            ? { ...item, price: editedValues.price, quantity: editedValues.quantity }
            : item
        );
        setUserData({ ...userData, inventory: updatedItems });
        setIsEditOpen(false);
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this item?");
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${backendUrl}/inventory/delete/${id}`, {
          method: "DELETE",
          headers: {
            "x-access-token": token,
          },
        });
        const filtered = userData.inventory.filter((item) => item.id !== id);
        setUserData({ ...userData, inventory: filtered });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleBadgeClick = (type) => {
    let filtered = [];

    if (type === "low") {
      filtered = items.filter(
        (item) =>
          item.remaining !== null &&
          item.quantity !== null &&
          item.remaining > 0 &&
          item.remaining < 0.3 * item.quantity
      );
      setModalTitle("Low Stock Items");
    } else if (type === "out") {
      filtered = items.filter((item) => item.remaining === 0);
      setModalTitle("Out of Stock Items");
    } else if (type === "expired") {
      filtered = items.filter(
        (item) => item.expirationDate && new Date(item.expirationDate) < new Date()
      );
      setModalTitle("Expired Items");
    }
    else if (type === "in") {
  filtered = items.filter(
    (item) =>
      item.remaining !== null &&
      item.quantity !== null &&
      item.remaining >= 0.3 * item.quantity
  );
  setModalTitle("In Stock Items");
}


    setModalItems(filtered);
    setModalOpen(true);
  };

  if (error) return <div className="p-6 text-red-500 font-semibold">{error}</div>;
  if (!userData) return <p className="text-center mt-10">Loading dashboard...</p>;

  const items = userData.inventory || [];
  const categories = ["Seeds", "Fertilizers", "Tools", "Fruits"];

  const totalLowStock = items.filter(
    (item) =>
      item.remaining !== null &&
      item.quantity !== null &&
      item.remaining > 0 &&
      item.remaining < 0.3 * item.quantity
  ).length;

  const totalOutOfStock = items.filter((item) => item.remaining === 0).length;

  const totalInStock = items.filter(
    (item) =>
      item.remaining !== null &&
      item.quantity !== null &&
      item.remaining >= 0.3 * item.quantity
  ).length;

  const totalExpired = items.filter(
    (item) => item.expirationDate && new Date(item.expirationDate) < new Date()
  ).length;

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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <HeroSection />
      </motion.div>

      <div className="my-6 text-center space-y-2">
        <h2 className="text-3xl font-bold text-green-800">📦 Inventory Dashboard</h2>
        <p className="text-2xl m-5 text-gray-700">{userData.message || "Welcome!"}</p>
        <div className="flex justify-center gap-4 text-sm mt-2 flex-wrap">
          <span className="cursor-pointer bg-green-100 text-green-800 px-3 py-1 rounded-full" onClick={() => handleBadgeClick("in")}>In Stock: {totalInStock}</span>
          <span className="cursor-pointer bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full" onClick={() => handleBadgeClick("low")}>Low Stock: {totalLowStock}</span>
          <span className="cursor-pointer bg-red-100 text-red-700 px-3 py-1 rounded-full" onClick={() => handleBadgeClick("out")}>Out of Stock: {totalOutOfStock}</span>
          <span className="cursor-pointer bg-gray-100 text-gray-700 px-3 py-1 rounded-full" onClick={() => handleBadgeClick("expired")}>Expired: {totalExpired}</span>
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
          key={`category-${index}-${category}`}
          custom={index}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-green-700 mb-2">{category}</h2>
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
                    🗓️ Expires: {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : <span className="italic text-gray-400">No Expiry</span>}
                  </p>

                  <div className="mt-2">
                    {item.remaining === 0 ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full font-semibold">Out of Stock</span>
                    ) : item.remaining < 0.3 * item.quantity ? (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full font-semibold">Low Stock</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-semibold">In Stock</span>
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

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">Edit Inventory Item</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Price (₹)</label>
                <input type="number" value={editedValues.price} onChange={(e) => setEditedValues({ ...editedValues, price: e.target.value })} className="w-full mt-1 border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity</label>
                <input type="number" value={editedValues.quantity} onChange={(e) => setEditedValues({ ...editedValues, quantity: e.target.value })} className="w-full mt-1 border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Info Modal for Badges */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">{modalTitle}</Dialog.Title>
            
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
              
              {modalItems.length === 0 ? (
                <p className="text-sm text-gray-500">No items found.</p>
              ) : (
                modalItems.map((item) => (
                  <li key={item.id} className="border-b py-2">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}, Remaining: {item.remaining}</div>
                    <div className="text-sm text-gray-500">
  {modalTitle === "Expired Items" ? "Expired" : "Expires"}: {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : "No Expiry"}
</div> 
                    {/* <div className="text-sm text-gray-500">Expires: {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : "No Expiry"}</div> */}
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 text-right">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Close</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;
