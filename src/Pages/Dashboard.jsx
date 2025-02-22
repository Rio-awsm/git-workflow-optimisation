import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";

import RadialChart from "../components/Charts/RadialCharts";
import CodeComparison from "../components/Charts/CodeComparision";
import { database } from "../firebase/config";
import EmissionsChart from "../components/Charts/EmissionsChart";
import NavBar from "../components/NavBar";

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
      <section className="text-white flex flex-col gap-8 items-center py-36 bg-[#101311]">
        <div className="text-center text-6xl ">
          Optimize {" "}
          <span className="text-[#D3FFCA]">click!</span>
        </div>
      </section>
      <section>
        <h1 className="text-3xl font-bold mb-8">Performance Dashboard</h1>

        {initialData && currentData && (
          <div className="grid grid-cols-3 gap-8 mb-12">
            <div className="bg-[#1A1B1E] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">CPU Usage</h3>
              <div className="flex items-center justify-between gap-4">
                <RadialChart
                  value={initialData.cpu_usage}
                  label="Initial"
                  color="#4ADE80"
                />
                <div className="flex flex-col items-center justify-center px-4">
                  <span
                    className={`text-2xl font-bold ${
                      calculateChange(
                        currentData.cpu_usage,
                        initialData.cpu_usage
                      ).direction === "increase"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {
                      calculateChange(
                        currentData.cpu_usage,
                        initialData.cpu_usage
                      ).value
                    }
                    %
                  </span>
                  <span className="text-sm text-gray-400">Change</span>
                </div>
                <RadialChart
                  value={currentData.cpu_usage}
                  label="Current"
                  color="#4ADE80"
                />
              </div>
            </div>

            <div className="bg-[#1A1B1E] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">GPU Usage</h3>
              <div className="flex items-center justify-between gap-4">
                <RadialChart
                  value={initialData.gpu_usage}
                  label="Initial"
                  color="#4ADE80"
                />
                <div className="flex flex-col items-center justify-center px-4">
                  <span
                    className={`text-2xl font-bold ${
                      calculateChange(
                        currentData.gpu_usage,
                        initialData.gpu_usage
                      ).direction === "increase"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {
                      calculateChange(
                        currentData.gpu_usage,
                        initialData.gpu_usage
                      ).value
                    }
                    %
                  </span>
                  <span className="text-sm text-gray-400">Change</span>
                </div>
                <RadialChart
                  value={currentData.gpu_usage}
                  label="Current"
                  color="#4ADE80"
                />
              </div>
            </div>

            <div className="bg-[#1A1B1E] p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">RAM Usage</h3>
              <div className="flex items-center justify-between gap-4">
                <RadialChart
                  value={initialData.ram_usage}
                  label="Initial"
                  color="#4ADE80"
                />
                <div className="flex flex-col items-center justify-center px-4">
                  <span
                    className={`text-2xl font-bold ${
                      calculateChange(
                        currentData.ram_usage,
                        initialData.ram_usage
                      ).direction === "increase"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {
                      calculateChange(
                        currentData.ram_usage,
                        initialData.ram_usage
                      ).value
                    }
                    %
                  </span>
                  <span className="text-sm text-gray-400">Change</span>
                </div>
                <RadialChart
                  value={currentData.ram_usage}
                  label="Current"
                  color="#4ADE80"
                />
              </div>
            </div>
          </div>
        )}

        {workflowData && (
          <>
            <EmissionsChart data={workflowData.emissions_data} />
            <CodeComparison
              original={workflowData.original_yaml}
              optimized={workflowData.optimized_yaml}
            />
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
