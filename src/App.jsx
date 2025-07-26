import React, { useState, useEffect } from "react";

// Components
import InputForm from "./components/InputForm";
import LayeredPolarChart from "./components/PolarChart";
import Drawer from "./components/Drawer";
import ContextualSettingsPanel from "./components/ContextualSettingsPanel";

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
    handleLabelChange,
    resetToDefaults,
    exportToExcel,
    importFromExcel,
    isLoading,
    error,
    dataVersion,
  } = useChartData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleElementClick = (elementData) => {
    setSelectedElement(elementData);
    setIsDrawerOpen(false);
  };

  const handleCloseSettings = () => {
    setSelectedElement(null);
  };

  const handleRemoveWedgeLayer = (branchIndex, layerIndex, wedgeIndex) => {
    removeWedgeLayer(branchIndex, layerIndex, wedgeIndex, () => {
      setSelectedElement(null);
    });
  };

  const handlePlusOpenCenterSettings = () => {
    const centerElement = { type: "center", indices: {} };
    setSelectedElement(centerElement);
    setIsDrawerOpen(false);
  };

  const handlePlusAddBranch = (insertIndex) => {
    addBranch(insertIndex);
    setIsDrawerOpen(false);
  };

  const handlePlusAddOnionLayer = (branchIndex, insertIndex) => {
    addOnionLayer(branchIndex, insertIndex);
    setIsDrawerOpen(false);
  };

  const handlePlusAddWedgeLayer = (branchIndex, layerIndex, insertIndex) => {
    addWedgeLayer(branchIndex, layerIndex, insertIndex);
    setIsDrawerOpen(false);
  };

  const handleDeleteBranch = (branchIndex) => {
    const branch = data[branchIndex];
    const confirmed = window.confirm(
      `Are you sure you want to delete "${branch.name}"?\n\n` +
        `This will permanently remove:\n` +
        `• The entire branch\n` +
        `• All ${branch.onionLayers.length} onion layers\n` +
        `• All wedges and their labels\n\n` +
        `This action cannot be undone.`
    );

    if (confirmed) {
      removeBranch(branchIndex);
      setSelectedElement(null);
      setIsDrawerOpen(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await importFromExcel(file);
    }
  };

  useEffect(() => {
    const handleUnselect = () => setSelectedElement(null);
    window.addEventListener("polarchart-unselect", handleUnselect);
    return () =>
      window.removeEventListener("polarchart-unselect", handleUnselect);
  }, []);

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
            settings={settings}
            updateSettings={updateSettings}
            resetToDefaults={resetToDefaults}
            exportToExcel={exportToExcel}
            importFromExcel={handleFileUpload}
            isLoading={isLoading}
          />
        </div>
      </Drawer>

      <ContextualSettingsPanel
        selectedElement={selectedElement}
        data={data}
        settings={settings}
        onClose={handleCloseSettings}
        updateSettings={updateSettings}
        handleBranchChange={handleBranchChange}
        handleLabelChange={handleLabelChange}
        addOnionLayer={addOnionLayer}
        removeOnionLayer={removeOnionLayer}
        addWedgeLayer={addWedgeLayer}
        removeWedgeLayer={handleRemoveWedgeLayer}
        onDeleteBranch={handleDeleteBranch}
      />

      <div className={`main-content ${isDrawerOpen ? "drawer-open" : ""}`}>
        <button
          onClick={toggleDrawer}
          className={`${BUTTON_CLASSES.drawerBase} ${
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
              onElementClick={handleElementClick}
              onAddBranch={handlePlusAddBranch}
              onAddOnionLayer={handlePlusAddOnionLayer}
              onAddWedgeLayer={handlePlusAddWedgeLayer}
              onOpenCenterSettings={handlePlusOpenCenterSettings}
              selectedElement={selectedElement}
              key={dataVersion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
