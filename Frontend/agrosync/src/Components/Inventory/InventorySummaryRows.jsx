// InventorySummaryRows.jsx
import React from "react";

const InventorySummaryRows = ({ title, items }) => {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={index} className="bg-white shadow rounded-xl overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">Price: ₹{item.price.toFixed(2)}</p>
              <p className="text-gray-600">Quantity Remaining: {item.quantity}</p>
              <p className="text-gray-600">Expiration Date: {item.expiry}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventorySummaryRows;
