import React from 'react';

const CodeComparison = ({ original, optimized }) => {
  // Remove the markdown code block syntax
  const cleanYaml = (yaml) => {
    return yaml.replace(/```yml\n/, '').replace(/\n```$/, '');
  };

  return (
    <div className="bg-[#1A1B1E] p-6 rounded-xl mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Workflow Optimization</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium mb-2 text-red-400">Original Workflow</h4>
          <pre className="bg-[#2A2A2A] p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-300 whitespace-pre">
              {cleanYaml(original)}
            </code>
          </pre>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-2 text-green-400">Optimized Workflow</h4>
          <pre className="bg-[#2A2A2A] p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-300 whitespace-pre">
              {cleanYaml(optimized)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeComparison