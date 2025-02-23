import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/config";
import { Bell, X } from "lucide-react";

const PrCreated = () => {
  const [data, setData] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dbref = ref(database, "has_new_pr");
    const unsubscribe = onValue(dbref, (snapshot) => {
      setData(snapshot.val());
    });

    const repoRef = ref(database, "users");
    const repoUnsubscribe = onValue(repoRef, (snapshot) => {
      setRepoData(snapshot.val());
    });

    return () => {
      unsubscribe();
      repoUnsubscribe();
    };
  }, []);

  if (JSON.stringify(data) !== "true" || !repoData || !isVisible) return null;

  const repoName = repoData?.repo_name;
  const repoUrl = repoData?.url;

  return (
    <div
      className={`fixed right-10 z-50 top-20 shadow-xl rounded-lg p-4 flex items-center gap-4 transition-all duration-300 ease-in-out
        ${isHovered ? "w-72" : "w-16 h-16 justify-center"}
         hover:border-green-500`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="cursor-pointer flex items-center justify-center relative"
        onClick={() => window.open(repoUrl, "_blank")}
      >
        <div className="absolute -inset-1 bg-green-500 rounded-full animate-ping opacity-25" />
        <div className="relative bg-green-500 text-white p-3 rounded-full transform transition-transform hover:scale-110">
          <Bell size={24} className="animate-pulse" />
        </div>
      </div>
      
      {isHovered && (
        <>
          <div className="flex flex-col bg-white p-2">
            <p className="text-sm font-semibold text-green-600">New PR Created!</p>
            <p className="text-xs text-gray-600 truncate">{repoName}</p>
          </div>
          <button
            className="ml-auto text-gray-500 hover:text-gray-800 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
};

export default PrCreated;