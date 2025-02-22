import React, { useMemo } from 'react';

const EmissionsChart = ({ data }) => {
  const chartHeight = 200;
  const chartWidth = 600;

  const points = useMemo(() => {
    const originalPoints = Array(8).fill(0).map((_, i) => ({
      x: (i * (chartWidth - 40)) / 7 + 20,
      y: chartHeight - (data.original * 1000000 * (Math.sin(i / 2) + 2)) - 20
    }));

    const optimizedPoints = Array(8).fill(0).map((_, i) => ({
      x: (i * (chartWidth - 40)) / 7 + 20,
      y: chartHeight - (data.optimized * 1000000 * (Math.sin(i / 2) + 2)) - 20
    }));

    return { originalPoints, optimizedPoints };
  }, [data]);

  const percentageReduction = ((data.original - data.optimized) / data.original) * 100;
  const savings = data.original - data.optimized;

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h2 className="text-lg font-bold mb-2">Emissions Comparison</h2>
      <p>Original Emissions: <span className="text-red-400">{data.original} tons</span></p>
      <p>Optimized Emissions: <span className="text-green-400">{data.optimized} tons</span></p>
      <p>Reduction: <span className="text-yellow-400">{percentageReduction.toFixed(2)}%</span></p>
      <p>Saved: <span className="text-blue-400">{savings} tons</span></p>
      <svg width={chartWidth} height={chartHeight} className="bg-gray-900 rounded-lg mt-4">
        <polyline
          points={points.originalPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="red"
          strokeWidth="2"
        />
        <polyline
          points={points.optimizedPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="green"
          strokeWidth="2"
        />
        {points.originalPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="red" />
        ))}
        {points.optimizedPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="green" />
        ))}
      </svg>
    </div>
  );
};

export default EmissionsChart;
