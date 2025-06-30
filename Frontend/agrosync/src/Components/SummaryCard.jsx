import React from "react";

const SummaryCard = ({ title, count, color }) => {
  return (
    <div className={`rounded-xl p-6 text-white shadow-md ${color}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
};

export default SummaryCard;
