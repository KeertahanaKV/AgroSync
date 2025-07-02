import React, { useState } from "react";
import axios from "axios";
import backendUrl from "../config";

const CropRecommendationPage = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult("");

    try {
      const response = await axios.post(`${backendUrl}/crop/recommend`, formData);
      setResult(response.data.recommended_crop || "No crop predicted");
    } catch (err) {
      setError("Prediction failed. Please check input and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-lime-100 to-green-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-green-700 text-center mb-6 tracking-wide">
          🌱 Smart Crop Recommendation
        </h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                {key}
              </label>
              <input
                type="number"
                step="any"
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          ))}

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all duration-300"
            >
              Recommend Crop
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 text-center text-2xl font-semibold text-green-800 bg-green-100 p-4 rounded-xl shadow-sm">
            🌾 Recommended Crop: <span className="underline">{result}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 text-center text-red-600 font-medium">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendationPage;
