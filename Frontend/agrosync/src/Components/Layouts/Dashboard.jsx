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
  const [editedValues, setEditedValues] = useState({ price: "", quantity: "", remaining: "" });
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);

  const items = userData?.inventory || [];

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
    setEditedValues({ price: item.price, quantity: item.quantity, remaining: item.remaining });
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
          remaining: editedValues.remaining,
        }),
      });

      if (res.ok) {
        const updatedItems = userData.inventory.map((item) =>
          item.id === editItem.id
            ? { ...item, ...editedValues }
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
        Number(item.remaining) > 0 &&
        Number(item.remaining) < 0.3 * Number(item.quantity)
    );
    setModalTitle("Low Stock Items");

  } else if (type === "out") {
    filtered = items.filter(
      (item) =>
        item.remaining != null &&
        Number(item.remaining) === 0 &&
        item.expirationDate // only include those with expiry date
    );
    setModalTitle("Out of Stock Items");

  } else if (type === "expired") {
    filtered = items.filter(
      (item) =>
        item.expirationDate &&
        new Date(item.expirationDate) < new Date()
    );
    setModalTitle("Expired Items");

  } else if (type === "in") {
    filtered = items.filter(
      (item) =>
        Number(item.remaining) >= 0.3 * Number(item.quantity) &&
        (!item.expirationDate || new Date(item.expirationDate) >= new Date())
    );
    setModalTitle("In Stock Items");
  }

  setModalItems(filtered);
  setModalOpen(true);
};


  if (error) return <div className="p-6 text-red-500 font-semibold">{error}</div>;
  if (!userData) return <p className="text-center mt-10">Loading dashboard...</p>;

  const categories = ["Seeds", "Fertilizers", "Tools", "Fruits"];

  const totalLowStock = items.filter(
    (item) => Number(item.remaining) > 0 && Number(item.remaining) < 0.3 * Number(item.quantity)
  ).length;

  const totalOutOfStock = items.filter(
    (item) =>item.remaining != null && Number(item.remaining) === 0
  ).length;

  const totalInStock = items.filter(
  (item) =>
    Number(item.remaining) >= 0.3 * Number(item.quantity) &&
    (!item.expirationDate || new Date(item.expirationDate) >= new Date())
).length;


  const totalExpired = items.filter(
    (item) => item.expirationDate && new Date(item.expirationDate) < new Date()
  ).length;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-white">
      <HeroSection />

      <div className="my-6 text-center space-y-2">
        <p className="text-3xl m-5 text-gray-700">{userData.message || "Welcome!"}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <span onClick={() => handleBadgeClick("in")} className="cursor-pointer bg-green-100 text-green-800 px-3 py-1 rounded-full">In Stock: {totalInStock}</span>
          <span onClick={() => handleBadgeClick("low")} className="cursor-pointer bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Low Stock: {totalLowStock}</span>
          <span onClick={() => handleBadgeClick("out")} className="cursor-pointer bg-red-100 text-red-700 px-3 py-1 rounded-full">Out of Stock: {totalOutOfStock}</span>
          <span onClick={() => handleBadgeClick("expired")} className="cursor-pointer bg-gray-300 text-gray-700 px-3 py-1 rounded-full">Expired: {totalExpired}</span>
        </div>
      </div>

      <div className="my-6 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-2">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter(item => item.category === category && item.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
              <div key={item.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg">🛒 {item.name}</h3>
                <p>💰 Price: ₹{item.price}</p>
                <p>📦 Quantity: {item.quantity}</p>
                <p>🟢 Remaining: {item.remaining}</p>
                <p className="text-sm text-gray-500">
                  🗓️ Expires: {item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : "No Expiry"}
                </p>

                <div className="mt-2">
                  {Number(item.remaining) === 0 ? (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Out of Stock</span>
                  ) : Number(item.remaining) < 0.3 * Number(item.quantity) ? (
                    <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Low Stock</span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">In Stock</span>
                  )}
                </div>

                <div className="mt-2 flex gap-3">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                    <Pencil size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm flex items-center gap-1">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow">
            <Dialog.Title className="text-lg font-semibold mb-4">Edit Item</Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input type="number" value={editedValues.price} onChange={(e) => setEditedValues({ ...editedValues, price: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Quantity (Total)</label>
                <input type="number" value={editedValues.quantity} onChange={(e) => setEditedValues({ ...editedValues, quantity: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium">Remaining</label>
                <input type="number" value={editedValues.remaining} onChange={(e) => setEditedValues({ ...editedValues, remaining: e.target.value })} className="w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal for badge details */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl bg-white p-6 rounded shadow">
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
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4 text-right">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Close</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Dashboard;
