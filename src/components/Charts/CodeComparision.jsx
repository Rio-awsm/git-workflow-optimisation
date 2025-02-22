import React from 'react';

const CodeComparison = ({ original, optimized }) => {
  // Remove the markdown code block syntax
  const cleanYaml = (yaml) => {
    return yaml.replace(/```yml\n/, '').replace(/\n```$/, '');
  };

  return (
    <div className="p-6 rounded-xl pt-32">
      <h3 className="text-6xl pb-24 text-white text-center">From Bottlenecks to Seamless Workflows</h3>
      <div className="grid grid-cols-2 gap-6 px-8">
        <div>
          <h4 className="text-xl font-medium pb-6 text-red-400">Original Workflow</h4>
          <pre className="border p-4 rounded-lg max-h-[800px] overflow-y-auto">
            <code className="text-lg text-white/50 whitespace-pre">
              {cleanYaml(original)}
            </code>
          </pre>
        </div>
        <div>
          <h4 className="text-xl font-medium pb-6 text-[#D3FFCA]">Optimized Workflow</h4>
          <pre className="border p-4 rounded-lg max-h-[800px] overflow-y-auto">
            <code className="text-lg text-[#D3FFCA] whitespace-pre">
              {cleanYaml(optimized)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeComparison;
