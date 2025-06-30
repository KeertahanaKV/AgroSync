// Components/Dashboard/HeroSection.jsx
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { GiPlantSeed } from "react-icons/gi"; // Agro icon

const HeroSection = () => {
  return (
    <div className="w-full bg-white shadow-md flex justify-between items-center px-6 py-4 rounded-lg">
      <div className="flex items-center gap-2">
        <GiPlantSeed className="text-6xl text-green-700" />
        <h1 className="text-5xl font-extrabold text-green-700 tracking-wide">
          AgroSync
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-3xl text-gray-700 cursor-pointer" />
      </div>
    </div>
  );
};

export default HeroSection;
