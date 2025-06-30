import React from "react";
import {
  IndianRupee,
  Boxes,
  XCircle,
  AlertTriangle
} from "lucide-react";

const InventoryStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <IndianRupee className="text-green-600 w-5 h-10" />
        <div>
          <h2 className="text-lg font-semibold text-gray-700">
           <span className="font-bold">Revenue</span> </h2>
          <p className="text-lg  text-green-600">₹12,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <Boxes className="text-blue-600 w-5 h-10" />
        <div>
          <h2 className="text-lg font-bold text-gray-700">Total Inventory</h2>
          <p className="text-lg text-blue-600">150 items</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <XCircle className="text-red-500 w-5 h-10" />
        <div>
          <h2 className="text-lg font-bold text-gray-700">Out of Stock</h2>
          <p className="text-lg  text-red-500">5 items</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <AlertTriangle className="text-yellow-500 w-5 h-10" />
        <div>
          <h2 className="text-lg font-bold text-gray-700">Low Stock</h2>
          <p className="text-lg text-yellow-500">8 items</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
