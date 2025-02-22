import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts';

const EmissionsChart = ({ data }) => {
  // Function to convert and format emissions data
  const formatEmissions = (value) => {
    if (value < 0.000001) {
      return { value: value * 1000000000, unit: 'ng' };
    } else if (value < 0.001) {
      return { value: value * 1000000, unit: 'μg' };
    } else if (value < 1) {
      return { value: value * 1000, unit: 'mg' };
    } else {
      return { value: value, unit: 'tons' };
    }
  };

  const originalFormatted = formatEmissions(data.original);
  const optimizedFormatted = formatEmissions(data.optimized);
  const percentageReduction = ((data.original - data.optimized) / data.original) * 100;
  const savings = formatEmissions(data.original - data.optimized);

  const comparisonData = [
    { name: 'Original', value: originalFormatted.value, color: '#FF4B4B' },
    { name: 'Optimized', value: optimizedFormatted.value, color: '#78FFD6' }
  ];

  const reductionData = [
    { name: 'Reduction', value: percentageReduction, color: '#facc15' }
  ];

  return (
    <section className='px-8'>
    <div className="p-8 border rounded-xl text-white">
      <h2 className="text-5xl  mb-8">Emissions Comparison</h2>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="border p-6 rounded-xl">
          <p className="text-sm text-gray-400 mb-2">Total Reduction</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reductionData}>
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                >
                  {reductionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-2">
            {percentageReduction.toFixed(1)}%
          </p>
        </div>
        
        <div className="border p-6 rounded-xl">
          <p className="text-sm text-gray-400 mb-2">Emissions Saved</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ value: savings.value, color: '#60a5fa' }]}>
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                >
                  <Cell fill="#60a5fa" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">
            {savings.value.toFixed(2)} {savings.unit}
          </p>
        </div>
      </div>

      <div className="border border-white/50 p-6 rounded-xl">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
          >
            <XAxis 
              type="number" 
              stroke="#9ca3af"
              tickFormatter={value => value.toFixed(2) + ' ' + originalFormatted.unit}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#9ca3af"
              tickLine={false}
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 4, 4]}
              barSize={30}
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#FF4B4B] rounded-full"></div>
            <span>Original: {originalFormatted.value.toFixed(2)} {originalFormatted.unit}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#78FFD6] rounded-full"></div>
            <span>Optimized: {optimizedFormatted.value.toFixed(2)} {optimizedFormatted.unit}</span>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default EmissionsChart;