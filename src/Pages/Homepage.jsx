import React, { useEffect, useState } from "react";

import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaCodeBranch } from "react-icons/fa";
import Login from "../components/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import NavBar from "../components/NavBar";

const Homepage = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <section>
      <NavBar />
      <section
        className="text-white flex flex-col gap-8 items-center pt-36 h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/BG.svg')" }}
      >
        <div className="text-center text-8xl ">
          Future of DevOps is <span className="text-[#D3FFCA]">Green</span>
        </div>
        <div className="text-xl w-[700px] text-center opacity-40">
          AI-powered analytics to transform your GitHub pipelines— track
          inefficiencies, reduce emissions, and deploy with precision
        </div>
        <div className="flex justify-center space-x-6">
          {!user ? (
            <Login />
          ) : (
            <a href="/select-repo">
              <div className="bg-[#101311] text-md font-bold text-white rounded-2xl w-[220px] text-center py-3 cursor-pointer flex gap-4 justify-center border">
                <FaCodeBranch className="text-2xl" />
                Select Repository
              </div>
            </a>
          )}

          <div className="bg-[#D3FFCA] text-md font-bold text-[#101311] rounded-2xl w-[200px] text-center py-3 cursor-pointer flex gap-4 justify-center">
            <FaWandMagicSparkles className="text-2xl" />
            Optimize Code
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#101311] flex flex-col items-center gap-8 py-[100px]">
        <div className="bg-[#232B23] text-md font-bold text-[#D3FFCA] rounded-2xl w-[200px] text-center py-3 flex gap-4 justify-center">
          About Optimizer
        </div>
        <div className="text-center text-white text-4xl w-[900px]">
          We make GitHub workflows faster, smarter, and greener. Our AI
          optimizes CI/CD pipelines to reduce execution time and carbon
          footprint— so you ship code efficiently without extra{" "}
          <span className="text-[#D3FFCA]">effort.</span>
        </div>
      </section>

      <section id="services" className="bg-[#101311] flex flex-col items-center gap-8 py-[100px]">
        <div className="bg-[#232B23] text-md font-bold text-[#D3FFCA] rounded-2xl w-[200px] text-center py-3 flex gap-4 justify-center">
          What you’ll get
        </div>
        <div className="text-center text-white text-4xl w-[900px]">
          We fine-tune creative workflows, so you spend less time fixing and
          more time <span className="text-[#D3FFCA]">innovating.</span>
        </div>
        <div className="flex justify-center space-x-8 pt-8">
          <div>
            <img src="/assets/homecardThree.png" alt="img" />
          </div>
          <div>
            <img src="/assets/homecardOne.png" alt="img" />
          </div>
          <div>
            <img src="/assets/homecardTwo.png" alt="img" />
          </div>
        </div>
      </section>

      <section className="text-white flex flex-col gap-8 items-center py-36 bg-[#101311]">
        <div className="text-center text-6xl ">
          Unlock efficiency with one{" "}
          <span className="text-[#D3FFCA]">click!</span>
        </div>
        <div className="text-xl w-[700px] text-center opacity-40">
          Reduce carbon footprint and streamline development. Paste your GitHub
          repo or connect your account for optimized workflow.
        </div>
        <div>
          {!user ? (
            <Login />
          ) : (
            <a href="/select-repo">
              <div className="bg-[#101311] text-md font-bold text-white rounded-2xl w-[220px] text-center py-3 cursor-pointer flex gap-4 justify-center border">
                <FaCodeBranch className="text-2xl" />
                Select Repository
              </div>
            </a>
          )}
        </div>
      </section>
    </section>
  );
};

export default Homepage;
