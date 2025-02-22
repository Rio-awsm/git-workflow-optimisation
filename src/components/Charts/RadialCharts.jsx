import React from 'react';


const RadialChart = ({ value, label, color }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const remainingDash = circumference - progress;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#2A2A2A"
            strokeWidth="20"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="20"
            strokeDasharray={`${progress} ${remainingDash}`}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold text-white">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-lg text-gray-300">{label}</span>
    </div>
  );
}

export default RadialChart;