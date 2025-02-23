import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import RadialChart from "../components/Charts/RadialCharts";
import CodeComparison from "../components/Charts/CodeComparision";
import { database } from "../firebase/config";
import EmissionsChart from "../components/Charts/EmissionsChart";
import NavBar from "../components/NavBar";
import PrCreated from "../components/PrCreated";

function Dashboard() {
  const [initialData, setInitialData] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [workflowHistory, setWorkflowHistory] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, "system_stats");
    let isFirstUpdate = true;

    const systemUnsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (isFirstUpdate) {
        setInitialData(data);
        setCurrentData(data);
        isFirstUpdate = false;
      } else {
        setCurrentData(data);
      }
    });

    const workflowRef = ref(database, "workflow_history");
    const workflowUnsubscribe = onValue(workflowRef, (snapshot) => {
      const data = snapshot.val();
      setWorkflowHistory(data);
    });

    return () => {
      systemUnsubscribe();
      workflowUnsubscribe();
    };
  }, []);

  const getWorkflowData = () => {
    if (!workflowHistory?.RajBhattacharyya?.pv_app_api) return null;
    return workflowHistory.RajBhattacharyya.pv_app_api;
  };

  const workflowData = getWorkflowData();

  const calculateChange = (current, initial) => {
    const change = current - initial;
    return {
      value: Math.abs(change).toFixed(1),
      direction: change >= 0 ? "increase" : "decrease",
    };
  };

  return (
    <main className="bg-[#101311] text-white">
      <NavBar />
      <PrCreated />
      <section className="text-white flex flex-col gap-8 items-center bg-[#101311] py-12">
        <div className="text-center text-6xl bg-gradient-to-r from-white to-white/50 text-transparent bg-clip-text">
          Optimize Smarter, Deploy
          <span className="text-[#D3FFCA] font-[Solitreo]"> Greener</span>
        </div>
      </section>
      <section className="">
        {initialData && currentData && (
          <div className="grid grid-cols-3 gap-[5vw] mb-12 px-10">
            {["cpu_usage", "gpu_usage", "ram_usage"].map((key) => (
              <div key={key} className="border p-6 rounded-xl">
                <h3 className="text-4xl mb-4">{key.replace("_", " ").toUpperCase()}</h3>
                <div className="flex py-4 gap-4">
                  {calculateChange(currentData[key], initialData[key]).direction === "increase" ? (
                    <FaArrowTrendDown className="text-4xl text-[#FF4B4B]" />
                  ) : (
                    <FaArrowTrendUp className="text-4xl text-[#78FFD6]" />
                  )}
                  <span
                    className={`text-4xl ${
                      calculateChange(currentData[key], initialData[key]).direction === "increase"
                        ? "text-[#FF4B4B]"
                        : "text-[#78FFD6]"
                    }`}
                  >
                    {calculateChange(currentData[key], initialData[key]).value}%
                  </span>
                </div>
                <div className="flex gap-6">
                  <RadialChart value={initialData[key]} label="Redundant" color="#FF4B4B" />
                  <RadialChart value={currentData[key]} label="Optimized" color="#78FFD6" />
                </div>
                <div className="pt-8 text-xl text-white opacity-40">
                  {key === "cpu_usage"
                    ? "CPU usage is reduced through optimized algorithms, parallel processing, caching, and process minimization."
                    : key === "gpu_usage"
                    ? "GPU usage is optimized through better workload distribution, memory management, and efficient processing."
                    : "RAM usage optimization includes memory pooling, garbage collection, and data structure improvements."}
                </div>
              </div>
            ))}
          </div>
        )}

        {workflowData && (
          <>
            <EmissionsChart data={workflowData.emissions_data} />
            <CodeComparison original={workflowData.original_yaml} optimized={workflowData.optimized_yaml} />
          </>
        )}

        <div className="mt-8 bg-[#1A1B1E] p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">System Timestamps</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-400">Initial Reading</p>
              <p className="text-lg font-medium">{initialData?.timestamp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Current Reading</p>
              <p className="text-lg font-medium">{currentData?.timestamp}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
