import React, { useState, useEffect } from "react";

// Components
import InputForm from "./components/InputForm";
import LayeredPolarChart from "./components/PolarChart";
import Drawer from "./components/Drawer";

// Hooks
import useChartData from "./components/FunctionHandler";

// Styles
import "@/styles/App.css";
import { BUTTON_CLASSES } from "@/styles/classes";

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
    addLabel,
    removeLabel,
    handleLabelChange,
    resetToDefaults,
    exportToExcel,
    importFromExcel,
    isLoading,
    error,
    dataVersion,
  } = useChartData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await importFromExcel(file);
    }
  };

  useEffect(() => {
    console.log("Data or settings updated");
  }, [data, settings, dataVersion]);

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <Drawer isOpen={isDrawerOpen}>
        <div>
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
            addLabel={addLabel}
            removeLabel={removeLabel}
            handleLabelChange={handleLabelChange}
            resetToDefaults={resetToDefaults}
            exportToExcel={exportToExcel}
            importFromExcel={handleFileUpload}
            isLoading={isLoading}
          />
        </div>
      </Drawer>

      <div className={`main-content ${isDrawerOpen ? "drawer-open" : ""}`}>
        <button
          onClick={toggleDrawer}
          className={`${BUTTON_CLASSES.buttonBase} ${
            isDrawerOpen
              ? BUTTON_CLASSES.buttonClose
              : BUTTON_CLASSES.buttonOpen
          }`}
        >
          {isDrawerOpen ? "Close Settings" : "Open Settings"}
        </button>

        <div className="canvas">
          <div>
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
              key={dataVersion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
