// React imports & hooks
import React, { useState } from "react";

// Styles
import {
  GENERAL_CLASSES,
  BUTTON_CLASSES,
  INPUT_CLASSES,
} from "../styles/classes";

const InputForm = ({
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
  exportToExcel,
  importFromExcel,
  isLoading,
}) => {
  const [stylingSettingsExpanded, setStylingSettingsExpanded] = useState(false);
  const [exportSettingsExpanded, setExportSettingsExpanded] = useState(false);
  const [expandedBranches, setExpandedBranches] = useState({});
  const [expandedLayers, setExpandedLayers] = useState({});

  const toggleStylingSettings = () => {
    setStylingSettingsExpanded(!stylingSettingsExpanded);
  };

  const toggleExportSettings = () => {
    setExportSettingsExpanded(!exportSettingsExpanded);
  };

  const toggleBranchDetails = (branchIndex) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [branchIndex]: !prev[branchIndex],
    }));
  };

  const toggleLayerDetails = (layerKey) => {
    setExpandedLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const exportChart = (format) => {
    const svgNode = document.querySelector("#chart svg");
    if (!svgNode) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svgNode);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "layered_polar_chart.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (format === "png") {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svgNode);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 2048, 2048);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "layered_polar_chart.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div className={GENERAL_CLASSES.contentWrapper}>
      {/* Styling Settings Accordion */}
      <div className={GENERAL_CLASSES.sectionWrapper}>
        <h2 className="font-semibold text-lg">
          <button
            type="button"
            className={GENERAL_CLASSES.accordionButton}
            onClick={toggleStylingSettings}
          >
            <span>Styling Settings</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={stylingSettingsExpanded ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
              />
            </svg>
          </button>
        </h2>

        {stylingSettingsExpanded && (
          <div className={GENERAL_CLASSES.accordionContent}>
            {/* Canvas Size Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>Canvas Size:</label>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={settings.canvasSize}
                onChange={(e) =>
                  handleSettingChange("canvasSize", Number(e.target.value))
                }
                className="w-full"
              />
              <span>{settings.canvasSize}px</span>
            </div>

            {/* Organization Label */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>
                Organization Label:
              </label>
              <input
                className={INPUT_CLASSES.formInput}
                type="text"
                value={settings.orgLabel}
                onChange={(e) =>
                  handleSettingChange("orgLabel", e.target.value)
                }
              />
            </div>

            {/* Inner Circle Color Picker */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>
                Inner Circle Color:
              </label>
              <input
                type="color"
                value={settings.innerCircleColor}
                onChange={(e) =>
                  handleSettingChange("innerCircleColor", e.target.value)
                }
                className="w-full"
              />
            </div>

            {/* Organization Label Font Size Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>
                Org Label Font Size:
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={settings.orgLabelFontSize}
                onChange={(e) =>
                  handleSettingChange(
                    "orgLabelFontSize",
                    parseInt(e.target.value)
                  )
                }
                className="w-full"
              />
              <span>{settings.orgLabelFontSize}px</span>
            </div>

            {/* Font Size Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>Font Size:</label>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.fontSize}
                onChange={(e) =>
                  handleSettingChange("fontSize", parseInt(e.target.value))
                }
                className="w-full"
              />
              <span>{settings.fontSize}px</span>
            </div>

            {/* Inner Radius Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>Inner Radius:</label>
              <input
                type="range"
                min="50"
                max="200"
                value={settings.innerRadius}
                onChange={(e) =>
                  handleSettingChange("innerRadius", parseInt(e.target.value))
                }
                className="w-full"
              />
              <span>{settings.innerRadius}px</span>
            </div>

            {/* Banner Width Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>Banner Width:</label>
              <input
                type="range"
                min="25"
                max="150"
                value={settings.bannerWidth}
                onChange={(e) =>
                  handleSettingChange("bannerWidth", parseInt(e.target.value))
                }
                className="w-full"
              />
              <span>{settings.bannerWidth}px</span>
            </div>

            {/* Banner Font Size Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>
                Banner Font Size:
              </label>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.bannerFontSize}
                onChange={(e) =>
                  handleSettingChange(
                    "bannerFontSize",
                    parseInt(e.target.value)
                  )
                }
                className="w-full"
              />
              <span>{settings.bannerFontSize}px</span>
            </div>

            {/* Max Radius Ratio Slider */}
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <label className={INPUT_CLASSES.formLabel}>
                Max Radius Ratio:
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.01"
                value={settings.maxRadiusRatio}
                onChange={(e) =>
                  handleSettingChange(
                    "maxRadiusRatio",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
              <span>{settings.maxRadiusRatio}</span>
            </div>
          </div>
        )}
      </div>

      {data.map((branch, branchIndex) => (
        <div
          key={`branch-${branchIndex}`}
          className={GENERAL_CLASSES.sectionWrapper}
        >
          <h2 className="font-semibold text-lg">
            <button
              type="button"
              className={GENERAL_CLASSES.accordionButton}
              aria-expanded="false"
              onClick={() => toggleBranchDetails(branchIndex)}
            >
              <span>{branch.name}</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    expandedBranches[branchIndex]
                      ? "M19 9l-7 7-7-7"
                      : "M5 15l7-7 7 7"
                  }
                />
              </svg>
            </button>
          </h2>

          {expandedBranches[branchIndex] && (
            <div className={GENERAL_CLASSES.accordionContent}>
              <div className="mb-4">
                <label className={INPUT_CLASSES.formLabel}>Branch Name:</label>
                <input
                  className={INPUT_CLASSES.formInput}
                  type="text"
                  value={branch.name}
                  onChange={(e) =>
                    handleBranchChange(branchIndex, "name", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className={INPUT_CLASSES.formLabel}>Branch Color:</label>
                <input
                  className="w-20 h-10 p-0 border-0 rounded-lg cursor-pointer"
                  type="color"
                  value={branch.color}
                  onChange={(e) =>
                    handleBranchChange(branchIndex, "color", e.target.value)
                  }
                />
              </div>

              <button
                onClick={() => addOnionLayer(branchIndex)}
                className={BUTTON_CLASSES.buttonGreen}
              >
                Add Onion Layer
              </button>

              {branch.onionLayers.map((layer, layerIndex) => {
                const layerKey = `branch-${branchIndex}-layer-${layerIndex}`;
                return (
                  <div key={layerKey} className="mt-4">
                    <button
                      onClick={() => toggleLayerDetails(layerKey)}
                      className={GENERAL_CLASSES.accordionButton}
                    >
                      Onion Layer {layerIndex + 1}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            expandedLayers[layerKey]
                              ? "M5 15l7-7 7 7"
                              : "M19 9l-7 7-7-7"
                          }
                        />
                      </svg>
                    </button>

                    {expandedLayers[layerKey] && (
                      <div className={GENERAL_CLASSES.accordionContent}>
                        {layer.wedgeLayers.map((wedge, wedgeIndex) => (
                          <div
                            key={`wedge-${wedgeIndex}`}
                            className={GENERAL_CLASSES.sectionWrapper}
                          >
                            <h4 className="text-xl font-semibold mb-2 dark:text-white">
                              Wedge {wedgeIndex + 1}
                            </h4>
                            <div className="mb-2">
                              <label className={INPUT_CLASSES.formLabel}>
                                Color:
                              </label>
                              <input
                                type="color"
                                className="w-16 h-10 border border-gray-300 rounded-md shadow-sm focus:border-blue-500"
                                value={wedge.color}
                                onChange={(e) =>
                                  handleWedgeChange(
                                    branchIndex,
                                    layerIndex,
                                    wedgeIndex,
                                    "color",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            {wedge.labels.map((label, labelIndex) => (
                              <div
                                key={`initiative-${labelIndex}`}
                                className={GENERAL_CLASSES.sectionWrapper}
                              >
                                <label className={INPUT_CLASSES.formLabel}>
                                  Initiative {labelIndex + 1}:
                                </label>
                                <input
                                  type="text"
                                  className={INPUT_CLASSES.initiativeInput}
                                  value={label}
                                  onChange={(e) =>
                                    handleInitiativeChange(
                                      branchIndex,
                                      layerIndex,
                                      wedgeIndex,
                                      labelIndex,
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  onClick={() =>
                                    confirm(
                                      "Are you sure you want to delete this initiative?"
                                    ) &&
                                    removeInitiative(
                                      branchIndex,
                                      layerIndex,
                                      wedgeIndex,
                                      labelIndex
                                    )
                                  }
                                  className={BUTTON_CLASSES.buttonRed}
                                >
                                  Remove Initiative
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() =>
                                addInitiative(
                                  branchIndex,
                                  layerIndex,
                                  wedgeIndex
                                )
                              }
                              className={BUTTON_CLASSES.buttonGreen}
                            >
                              Add Initiative
                            </button>

                            <button
                              onClick={() =>
                                removeWedgeLayer(
                                  branchIndex,
                                  layerIndex,
                                  wedgeIndex
                                )
                              }
                              className={BUTTON_CLASSES.buttonRed}
                            >
                              Remove Wedge
                            </button>
                          </div>
                        ))}

                        <button
                          onClick={() => addWedgeLayer(branchIndex, layerIndex)}
                          className={BUTTON_CLASSES.buttonGreen}
                        >
                          Add Wedge
                        </button>

                        <button
                          onClick={() =>
                            removeOnionLayer(branchIndex, layerIndex)
                          }
                          className={BUTTON_CLASSES.buttonRed}
                        >
                          Remove Onion Layer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={() =>
                  confirm("Are you sure you want to delete this branch?") &&
                  removeBranch(branchIndex)
                }
                className={BUTTON_CLASSES.buttonRed}
              >
                Remove Branch
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Import/Export Settings Accordion */}
      <div className={GENERAL_CLASSES.sectionWrapper}>
        <h2 className="font-semibold text-lg">
          <button
            type="button"
            className={GENERAL_CLASSES.accordionButton}
            onClick={toggleExportSettings}
          >
            <span>Import/Export Settings</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={exportSettingsExpanded ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
              />
            </svg>
          </button>
        </h2>

        {exportSettingsExpanded && (
          <div className={GENERAL_CLASSES.accordionContent}>
            <div className={GENERAL_CLASSES.sectionWrapper}>
              <div className="button-wrapper">
                {/* Add branch button */}
                <button
                  onClick={exportToExcel}
                  disabled={isLoading}
                  className={BUTTON_CLASSES.buttonWhite}
                >
                  Export to Excel
                </button>

                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={importFromExcel}
                  style={{ display: "none" }}
                  id="excel-upload"
                  disabled={isLoading}
                />
                <label htmlFor="excel-upload">
                  <button
                    as="span"
                    disabled={isLoading}
                    className={BUTTON_CLASSES.buttonWhite}
                  >
                    {isLoading ? "Importing..." : "Import from Excel"}
                  </button>
                </label>
                <button
                  onClick={addBranch}
                  className={BUTTON_CLASSES.buttonGreen}
                >
                  Add Branch
                </button>
                {/* Export SVG button */}
                <button
                  onClick={() => exportChart("svg")}
                  className={BUTTON_CLASSES.buttonWhite}
                >
                  Export as SVG
                </button>
                {/* Export PNG button */}
                <button
                  onClick={() => exportChart("png")}
                  className={BUTTON_CLASSES.buttonWhite}
                >
                  Export as PNG
                </button>
                {/* Reset Template button */}
                <button
                  className={BUTTON_CLASSES.buttonRed}
                  onClick={resetToDefaults}
                >
                  Reset Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputForm;
