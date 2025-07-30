import React, { useState, useEffect } from "react";

// Components
import InputForm from "./components/InputForm";
import LayeredPolarChart from "./components/PolarChart";
import Drawer from "./components/Drawer";
import ContextualSettingsPanel from "./components/ContextualSettingsPanel";
import InfiniteCanvas from "./components/InfiniteCanvas";
import { ThemeProvider } from "./components/ThemeProvider";

// Hooks
import useChartData from "./components/FunctionHandler";

// Styles
import "./styles/App.css";

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
    handleWedgeFontChange,
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
    <ThemeProvider defaultTheme="light" storageKey="polar-chart-theme">
      <div className="app bg-background text-foreground">
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
        handleWedgeFontChange={handleWedgeFontChange}
        addOnionLayer={addOnionLayer}
        removeOnionLayer={removeOnionLayer}
        addWedgeLayer={addWedgeLayer}
        removeWedgeLayer={handleRemoveWedgeLayer}
        onDeleteBranch={handleDeleteBranch}
      />

      <div className={`main-content ${isDrawerOpen ? "drawer-open" : ""}`}>
        <button
          onClick={toggleDrawer}
          className={`fixed top-4 z-[1000] focus:outline-none focus:ring-4 font-medium px-5 py-2.5 rounded-lg text-center text-sm transition-all duration-300 ${
            isDrawerOpen
              ? "left-[calc(1rem+25%)] bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              : "left-4 bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
        >
          {isDrawerOpen ? "Close" : "Export Settings"}
        </button>

        <div className="canvas">
          <InfiniteCanvas>
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
          </InfiniteCanvas>
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default App;
