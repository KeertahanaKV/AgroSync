import React, { useState } from "react";
import axios from "axios";
import backendUrl from "../config"; // Example: http://localhost:5000

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
    <div className="min-h-screen bg-green-50 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          🌱 Crop Recommendation
        </h1>

        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key}
              </label>
              <input
                type="number"
                step="any"
                name={key}
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className="mt-1 block w-full px-3 py-2 border rounded shadow-sm focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          ))}

          <div className="col-span-2 text-center mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Recommend Crop
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 text-center text-xl font-semibold text-green-800">
            Recommended Crop: <span className="underline">{result}</span>
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
