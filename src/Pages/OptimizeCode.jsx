import React, { useState, useRef, useEffect } from 'react';
import { FaWandMagicSparkles } from "react-icons/fa6";
import NavBar from "../components/NavBar";
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

const OptimizeCode = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to detect and format code blocks in message content
  const formatMessage = (content) => {
    // Regular expression to detect code blocks with language specification
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      // Add code block with default language as yaml if not specified
      const language = match[1] || 'yaml';
      const code = match[2].trim();
      parts.push({
        type: 'code',
        language,
        content: code
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content }];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a DevOps optimization assistant focused on sustainable practices. You help optimize CI/CD pipelines, reduce carbon footprint, and implement green computing practices in DevOps workflows. When sharing code examples, always wrap them in triple backticks with the appropriate language specification (yaml, bash, or json). DONT GIVE ANY RESPONSE IF THE TOPIC IS NOT RELATED TO DEVOPS AND SAY SORRY I CANT HELP YOU WITH THAT. Please provide more details on your optimization requirements to get started.',
            },
            {
              role: 'user',
              content: input,
            },
          ],
        }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.result.response 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }

    setIsLoading(false);
  };

  const renderMessageContent = (message) => {
    const parts = formatMessage(message.content);
    
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return <p key={index} className="whitespace-pre-wrap">{part.content}</p>;
      } else {
        return (
          <div key={index} className="my-2 rounded-md overflow-hidden">
            <div className="bg-[#1E1E1E] px-4 py-2 text-xs text-white/60 font-mono">
              {part.language}
            </div>
            <pre className="p-4 bg-[#1E1E1E] overflow-x-auto">
              <code className={`language-${part.language}`}>
                {part.content}
              </code>
            </pre>
          </div>
        );
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#101311]">
      <NavBar />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/50 inline-block text-transparent bg-clip-text">
            DevOps Optimization <span className="text-[#D3FFCA] font-[Solitreo]">Assistant</span>
          </h1>
          <p className="text-white/40 mt-4">
            Get AI-powered recommendations for sustainable DevOps practices and workflow optimization
          </p>
        </div>

        <div className="bg-[#232B23] rounded-lg p-4 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-[#D3FFCA] text-[#101311]'
                      : 'bg-[#101311] text-white'
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block bg-[#101311] text-white rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#D3FFCA] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#D3FFCA] rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-[#D3FFCA] rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about DevOps optimization and sustainability..."
              className="flex-1 bg-[#101311] text-white rounded-4xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#D3FFCA] focus:ring-opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#D3FFCA] text-[#101311] rounded-4xl px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#D3FFCA]/90 transition-colors"
            >
              <FaWandMagicSparkles className="text-xl" />
              Optimize
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default OptimizeCode;