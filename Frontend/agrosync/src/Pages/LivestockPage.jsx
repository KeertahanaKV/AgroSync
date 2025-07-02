import React, { useState } from 'react';
import Select from 'react-select';

const symptomOptions = [
  { label: "blisters on gums", value: "blisters on gums" },
{ label: "blisters on hooves", value: "blisters on hooves" },
{ label: "blisters on mouth", value: "blisters on mouth" },
{ label: "blisters on tongue", value: "blisters on tongue" },
{ label: "chest discomfort", value: "chest discomfort" },
{ label: "chills", value: "chills" },
{ label: "crackling sound", value: "crackling sound" },
{ label: "depression", value: "depression" },
{ label: "difficulty walking", value: "difficulty walking" },
{ label: "fatigue", value: "fatigue" },
{ label: "lameness", value: "lameness" },
{ label: "loss of appetite", value: "loss of appetite" },
{ label: "painless lumps", value: "painless lumps" },
{ label: "shortness of breath", value: "shortness of breath" },
{ label: "sores on gums", value: "sores on gums" },
{ label: "sores on hooves", value: "sores on hooves" },
{ label: "sores on mouth", value: "sores on mouth" },
{ label: "sores on tongue", value: "sores on tongue" },
{ label: "sweats", value: "sweats" },
{ label: "swelling in abdomen", value: "swelling in abdomen" },
{ label: "swelling in extremities", value: "swelling in extremities" },
{ label: "swelling in limb", value: "swelling in limb" },
{ label: "swelling in muscle", value: "swelling in muscle" },
{ label: "swelling in neck", value: "swelling in neck" },
  // Add more symptoms as needed
];

const LivestockPage = () => {
  const [animal, setAnimal] = useState("");
  const [age, setAge] = useState("");
  const [temperature, setTemperature] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictedDisease, setPredictedDisease] = useState(""); // ⬅️ New state

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      Animal: animal,
      Age: Number(age),
      Temperature: Number(temperature),
      "Symptom 1": selectedSymptoms[0]?.value || "",
      "Symptom 2": selectedSymptoms[1]?.value || "",
      "Symptom 3": selectedSymptoms[2]?.value || ""
    };

    try {
      const response = await fetch("http://localhost:5000/disease/predict-disease", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setPredictedDisease(data.predicted_disease); // ⬅️ Save prediction
    } catch (error) {
      console.error("Error:", error);
      setPredictedDisease("Error predicting disease.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-lime-100 to-green-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-700">🐄 Livestock Disease Predictor</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Animal Type</label>
              <input
                type="text"
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                placeholder="e.g., cow, sheep, buffalo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="in years"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">Temperature (°F)</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g., 101.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">Select up to 3 Symptoms</label>
              <Select
                isMulti
                options={symptomOptions}
                value={selectedSymptoms}
                onChange={setSelectedSymptoms}
                placeholder="Start typing..."
                className="z-50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all duration-300"
          >
            Predict Disease
          </button>
        </form>

        {predictedDisease && (
          <div className="mt-8 p-6 bg-green-100 border border-green-400 rounded-xl text-center text-lg text-green-800 font-semibold shadow-md">
            🧪 Predicted Disease: <span className="font-bold">{predictedDisease}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivestockPage;