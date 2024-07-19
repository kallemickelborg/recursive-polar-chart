import React, { useState } from "react";
import InputForm from "./InputForm";
import LayeredPolarChart from "./LayeredPolarChart";
import Drawer from "./Drawer";
import useChartData from "./useChartData";
import "./App.css";

const App = () => {
  const {
    data,
    settings,
    updateSettings,
    addBranch,
    removeBranch,
    handleBranchChange,
    addOnionLayer,
    removeOnionLayer,
    addWedgeLayer,
    removeWedgeLayer,
    handleWedgeChange,
    addInitiative,
    removeInitiative,
    handleInitiativeChange,
    resetToDefaults,
  } = useChartData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const buttonBaseClass =
    "button-base py-2.5 px-5 me-2 mb-2 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 dark:focus:ring-gray-700 dark:hover:text-white";
  const buttonOpenClass =
    "button-open text-gray-900 bg-white border-gray-200 hover:bg-gray-100 focus:ring-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700";
  const buttonCloseClass =
    "button-close text-white bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900";
  const resetButtonClass =
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";

  return (
    <div className="app">
      <Drawer isOpen={isDrawerOpen}>
        <div className="content-wrapper">
          <InputForm
            data={data}
            settings={settings}
            updateSettings={updateSettings}
            addBranch={addBranch}
            removeBranch={removeBranch}
            handleBranchChange={handleBranchChange}
            addOnionLayer={addOnionLayer}
            removeOnionLayer={removeOnionLayer}
            addWedgeLayer={addWedgeLayer}
            removeWedgeLayer={removeWedgeLayer}
            handleWedgeChange={handleWedgeChange}
            addInitiative={addInitiative}
            removeInitiative={removeInitiative}
            handleInitiativeChange={handleInitiativeChange}
          />
          <button className={`reset-button ${resetButtonClass}`} onClick={resetToDefaults}>
            Reset Template
          </button>
        </div>
      </Drawer>

      <div className={`main-content ${isDrawerOpen ? "drawer-open" : ""}`}>
        <button
          onClick={toggleDrawer}
          className={`${buttonBaseClass} ${isDrawerOpen ? buttonCloseClass : buttonOpenClass}`}
        >
          {isDrawerOpen ? "Close Settings" : "Open Settings"}
        </button>

        <div className="canvas">
          <LayeredPolarChart
            data={data}
            size={settings.canvasSize}
            orgLabel={settings.orgLabel}
            innerCircleColor={settings.innerCircleColor}
            orgLabelFontSize={settings.orgLabelFontSize}
            fontSize={settings.fontSize}
            innerRadius={settings.innerRadius}
            bannerWidth={settings.bannerWidth}
            bannerFontSize={settings.bannerFontSize}
            maxRadiusRatio={settings.maxRadiusRatio}
          />
        </div>
      </div>
    </div>
  );
};

export default App;