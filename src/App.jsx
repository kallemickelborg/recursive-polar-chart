import "./App.css"; // Adjust the path as needed
import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import LayeredPolarChart from "./LayeredPolarChart";
import Drawer from "./Drawer";
import defaultChartData from "./chartData.json"; // Assuming this is your fallback data

const App = () => {
  const [data, setData] = useState(() => {
    // Function to load initial data or default
    const savedData = localStorage.getItem("chartData");
    return savedData ? JSON.parse(savedData) : defaultChartData;
  });
  const [orgLabel, setOrgLabel] = useState("ORG");
  const [canvasSize, setCanvasSize] = useState(1000);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Toggle drawer state
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("chartData", JSON.stringify(data));
  }, [data]);

  // Event handlers
  const handleDataChange = (newData) => {
    setData(newData);
  };

  const handleResetClick = () => {
    if (window.confirm("Are you sure you want to reset?")) {
      setData([...defaultChartData]);
    }
  };

  // Refactored button class names
  const buttonBaseClass =
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none rounded-lg border hover:text-blue-700 focus:z-10 focus:ring-4 dark:focus:ring-gray-700 dark:hover:text-white";
  const buttonOpenClass =
    "button-open text-gray-900 bg-white border-gray-200 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700";
  const buttonCloseClass =
    "button-close text-white bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900";
  const resetButtonClass =
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";

  return (
    <div className="app">
      <button
        onClick={toggleDrawer}
        className={`${buttonBaseClass} ${
          isDrawerOpen ? buttonCloseClass : buttonOpenClass
        }`}
      >
        {isDrawerOpen ? "Close Settings" : "Open Settings"}
      </button>
      <Drawer isOpen={isDrawerOpen}>
        <InputForm
          data={data}
          onDataChange={setData}
          orgLabel={orgLabel}
          onOrgLabelChange={setOrgLabel}
        />
        <button className={resetButtonClass} onClick={handleResetClick}>
          Reset Template
        </button>
      </Drawer>
      <div className="canvas-slider">
        <label
          htmlFor="canvasSize"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Canvas Size: {canvasSize}px
        </label>
        <input
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
          type="range"
          id="canvasSize"
          min="1000"
          max="3000"
          value={canvasSize}
          step="100"
          onChange={(e) => setCanvasSize(Number(e.target.value))}
        />
      </div>
      <div className="canvas">
        <LayeredPolarChart
          data={data || []}
          size={canvasSize}
          orgLabel={orgLabel}
        />
      </div>
    </div>
  );
};

export default App;
