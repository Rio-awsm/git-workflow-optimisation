import React, { useState, useEffect } from "react";

const CodeComparison = ({ original, optimized }) => {
  const [displayedOriginal, setDisplayedOriginal] = useState("");
  const [displayedOptimized, setDisplayedOptimized] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Remove the markdown code block syntax
  const cleanYaml = (yaml) => {
    return yaml.replace(/```yml\n/, "").replace(/\n```$/, "");
  };

  const cleanedOriginal = cleanYaml(original);
  const cleanedOptimized = cleanYaml(optimized);

  useEffect(() => {
    let currentIndex = 0;
    const totalLength = Math.max(
      cleanedOriginal.length,
      cleanedOptimized.length
    );

    const typingInterval = setInterval(() => {
      if (currentIndex < totalLength) {
        if (currentIndex < cleanedOriginal.length) {
          setDisplayedOriginal(cleanedOriginal.slice(0, currentIndex + 1));
        }
        if (currentIndex < cleanedOptimized.length) {
          setDisplayedOptimized(cleanedOptimized.slice(0, currentIndex + 1));
        }
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30); // Adjust typing speed here (milliseconds)

    return () => clearInterval(typingInterval);
  }, [original, optimized]);

  return (
    <div className="p-6 rounded-xl pt-32">
      <h3 className="text-6xl pb-24 bg-gradient-to-r from-white to-white/50 text-transparent text-center bg-clip-text">
        From Bottlenecks to Seamless <span className="text-[#D3FFCA] font-[Solitreo]">Workflows</span>
      </h3>
      <div className="grid grid-cols-2 gap-6 px-8">
        <div>
          <h4 className="text-xl font-medium pb-6 text-red-400">
            Original Workflow
          </h4>
          <pre className="border p-4 rounded-lg max-h-[800px] overflow-y-auto">
            <code className="text-lg text-white/50 whitespace-pre">
              {displayedOriginal}
              {isTyping && <span className="animate-pulse">|</span>}
            </code>
          </pre>
        </div>
        <div>
          <h4 className="text-xl font-medium pb-6 text-[#D3FFCA]">
            Optimized Workflow
          </h4>
          <pre className="border p-4 rounded-lg max-h-[800px] overflow-y-auto">
            <code className="text-lg text-[#D3FFCA] whitespace-pre">
              {displayedOptimized}
              {isTyping && <span className="animate-pulse">|</span>}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeComparison;
