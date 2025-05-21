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
  addLabel,
  removeLabel,
  handleLabelChange,
  resetToDefaults,
  exportToExcel,
  importFromExcel,
  isLoading,
}) => {
  const [stylingSettingsExpanded, setStylingSettingsExpanded] = useState(false);
  const [exportSettingsExpanded, setExportSettingsExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleAccordion = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleStylingSettings = () => {
    setStylingSettingsExpanded(!stylingSettingsExpanded);
  };

  const toggleExportSettings = () => {
    setExportSettingsExpanded(!exportSettingsExpanded);
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
            <span className={GENERAL_CLASSES.accordionButtonText}>
              Styling Settings
            </span>
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
              onClick={() => toggleAccordion(`branch-${branchIndex}`)}
            >
              <span className={GENERAL_CLASSES.accordionButtonText}>
                {branch.name}
              </span>
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
                    expandedItems[`branch-${branchIndex}`]
                      ? "M19 9l-7 7-7-7"
                      : "M5 15l7-7 7 7"
                  }
                />
              </svg>
            </button>
          </h2>

          {expandedItems[`branch-${branchIndex}`] && (
            <div className={GENERAL_CLASSES.accordionContent}>
              <div>
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

              <div>
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

              <div className="flex items-center">
                <label className={INPUT_CLASSES.formLabel}>
                  Flip Text:
                </label>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id={`flip-text-${branchIndex}`}
                    checked={branch.flipText || false}
                    onChange={(e) =>
                      handleBranchChange(branchIndex, "flipText", e.target.checked)
                    }
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor={`flip-text-${branchIndex}`}
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
                <span className="text-sm text-gray-700">
                  {branch.flipText ? 'Flipped' : 'Normal'}
                </span>
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
                  <div
                    key={layerKey}
                    className={GENERAL_CLASSES.sectionWrapper}
                  >
                    <button
                      onClick={() => toggleAccordion(layerKey)}
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
                            expandedItems[layerKey]
                              ? "M5 15l7-7 7 7"
                              : "M19 9l-7 7-7-7"
                          }
                        />
                      </svg>
                    </button>

                    {expandedItems[layerKey] && (
                      <div className={GENERAL_CLASSES.accordionContent}>
                        {layer.wedgeLayers.map((wedgeLayer, wedgeLayerIndex) => (
                          <div key={`wedge-${wedgeLayerIndex}`}>
                            <button
                              onClick={() =>
                                toggleAccordion(
                                  `${layerKey}-wedge-${wedgeLayerIndex}`
                                )
                              }
                              className={GENERAL_CLASSES.accordionButton}
                            >
                              Wedge {wedgeLayerIndex + 1}
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
                                    expandedItems[
                                      `${layerKey}-wedge-${wedgeLayerIndex}`
                                    ]
                                      ? "M5 15l7-7 7 7"
                                      : "M19 9l-7 7-7-7"
                                  }
                                />
                              </svg>
                            </button>
                            {expandedItems[
                              `${layerKey}-wedge-${wedgeLayerIndex}`
                            ] && (
                              <div className={GENERAL_CLASSES.accordionContent}>
                                {wedgeLayer.labels.map((label, labelIndex) => (
                                  <div
                                    key={`label-${labelIndex}`}
                                    className={GENERAL_CLASSES.sectionWrapper}
                                  >
                                    <label className={INPUT_CLASSES.formLabel}>
                                      Label {labelIndex + 1}:
                                    </label>
                                    <input
                                      type="text"
                                      className={INPUT_CLASSES.formInput}
                                      value={label}
                                      onChange={(e) =>
                                        handleLabelChange(
                                          branchIndex,
                                          layerIndex,
                                          wedgeLayerIndex,
                                          labelIndex,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      onClick={() =>
                                        confirm(
                                          "Are you sure you want to delete this label?"
                                        ) &&
                                        removeLabel(
                                          branchIndex,
                                          layerIndex,
                                          wedgeLayerIndex,
                                          labelIndex
                                        )
                                      }
                                      className={BUTTON_CLASSES.buttonRed}
                                    >
                                      Remove Label
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() =>
                                    addLabel(
                                      branchIndex,
                                      layerIndex,
                                      wedgeLayerIndex
                                    )
                                  }
                                  className={BUTTON_CLASSES.buttonGreen}
                                >
                                  Add Label
                                </button>

                                <button
                                  onClick={() =>
                                    removeWedgeLayer(
                                      branchIndex,
                                      layerIndex,
                                      wedgeLayerIndex
                                    )
                                  }
                                  className={BUTTON_CLASSES.buttonRed}
                                >
                                  Remove Wedge
                                </button>
                              </div>
                            )}
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

      <button onClick={addBranch} className={BUTTON_CLASSES.buttonGreen}>
        Add Branch
      </button>

      {/* Import/Export Settings Accordion */}
      <div className={GENERAL_CLASSES.sectionWrapper}>
        <h2 className="font-semibold text-lg">
          <button
            type="button"
            className={GENERAL_CLASSES.accordionButton}
            onClick={toggleExportSettings}
          >
            <span className={GENERAL_CLASSES.accordionButtonText}>
              Import/Export Settings
            </span>
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
                {/* Export to Excel button */}
                <button
                  onClick={exportToExcel}
                  disabled={isLoading}
                  className={BUTTON_CLASSES.buttonWhite}
                >
                  Export to Excel
                </button>
                {/* Import from Excel button */}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={importFromExcel}
                  style={{ display: "none" }}
                  id="excel-upload"
                  disabled={isLoading}
                />
                <button
                  onClick={() =>
                    document.getElementById("excel-upload").click()
                  }
                  disabled={isLoading}
                  className={`${BUTTON_CLASSES.buttonWhite} w-full`}
                >
                  {isLoading ? "Importing..." : "Import from Excel"}
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
