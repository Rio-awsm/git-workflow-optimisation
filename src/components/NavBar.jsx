import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase/config";

const NavBar = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="bg-[#101311] text-white flex justify-between py-6 px-16">
      <div className="text-lg font-bold">OPT/CI</div>
      <div className="flex justify-center space-x-10 text-lg font-semibold">
        <a href="/"><div className="opacity-40 cursor-pointer hover:opacity-80">Home</div></a>
        <div className="opacity-40 cursor-pointer hover:opacity-80">About</div>
        <div className="opacity-40 cursor-pointer hover:opacity-80">
          Services
        </div>
      </div>

      {!user ? (
        <div className="bg-[#D3FFCA] text-md font-bold text-black rounded-2xl px-4 py-2 cursor-pointer">
          Analyze Now
        </div>
      ) : (
        <div
          onClick={() => auth.signOut()}
          className="bg-red-500 text-md font-bold text-black rounded-2xl px-4 py-2 cursor-pointer"
        >
          Logout
        </div>
      )}
    </div>
  );
};

export default NavBar;
