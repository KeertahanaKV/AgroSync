import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { GiPlantSeed } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // 🔁 redirect to login page
  };

  return (
    <div className="w-full bg-white shadow-md flex justify-between items-center px-6 py-4 rounded-lg relative">
      <div className="flex items-center gap-2">
        <GiPlantSeed className="text-6xl text-green-700" />
        <h1 className="text-5xl font-extrabold text-green-700 tracking-wide">
          AgroSync
        </h1>
      </div>

      <div className="relative">
        <FaUserCircle
          className="text-3xl text-gray-700 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        />

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
