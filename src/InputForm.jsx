import React, { useState } from "react";

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
}) => {
  const [stylingSettingsExpanded, setStylingSettingsExpanded] = useState(false);
  const [expandedBranches, setExpandedBranches] = useState({});
  const [expandedLayers, setExpandedLayers] = useState({});

  const toggleStylingSettings = () => {
    setStylingSettingsExpanded(!stylingSettingsExpanded);
  };

  const toggleBranchDetails = (branchIndex) => {
    setExpandedBranches(prev => ({
      ...prev,
      [branchIndex]: !prev[branchIndex]
    }));
  };

  const toggleLayerDetails = (layerKey) => {
    setExpandedLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const classes = {
    contentWrapper: "content-wrapper",
    drawerItem: "drawer-item mb-4",
    label: "w-full block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
    input: "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
    inputInitiative: "initiative-input bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
    accordionButton: "flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 bg-white rounded-t-lg border border-gray-200 shadow-sm hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-600",
    accordionDetails: "p-5 border border-t-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg mb-4",
    actionButton: "mt-5 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900",
    removeInitiativeButton: "initiative-remove w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900",
    addLayerButton: "mt-5 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800",
    addWedgeButton: "mt-5 w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800",
  };

  return (
    <div className={classes.contentWrapper}>
      {/* Styling Settings Accordion */}
      <div className={classes.drawerItem}>
        <h2 className="font-semibold text-lg">
          <button
            type="button"
            className={classes.accordionButton}
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
          <div className={classes.accordionDetails}>
            {/* Canvas Size Slider */}
            <div className={classes.drawerItem}>
              <label className={classes.label}>Canvas Size:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Organization Label:</label>
              <input
                className={classes.input}
                type="text"
                value={settings.orgLabel}
                onChange={(e) =>
                  handleSettingChange("orgLabel", e.target.value)
                }
              />
            </div>

            {/* Inner Circle Color Picker */}
            <div className={classes.drawerItem}>
              <label className={classes.label}>Inner Circle Color:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Org Label Font Size:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Font Size:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Inner Radius:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Banner Width:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Banner Font Size:</label>
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
            <div className={classes.drawerItem}>
              <label className={classes.label}>Max Radius Ratio:</label>
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
        <div key={`branch-${branchIndex}`} className={classes.drawerItem}>
          <h2 className="font-semibold text-lg">
            <button
              type="button"
              className={classes.accordionButton}
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
            <div className={classes.accordionDetails}>
              <div className="mb-4">
                <label className={classes.label}>Branch Name:</label>
                <input
                  className={classes.input}
                  type="text"
                  value={branch.name}
                  onChange={(e) =>
                    handleBranchChange(branchIndex, "name", e.target.value)
                  }
                />
              </div>

              <div className="mb-4">
                <label className={classes.label}>Branch Color:</label>
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
                onClick={() =>
                  confirm("Are you sure you want to delete this branch?") &&
                  removeBranch(branchIndex)
                }
                className={classes.actionButton}
              >
                Remove Branch
              </button>

              {branch.onionLayers.map((layer, layerIndex) => {
                const layerKey = `branch-${branchIndex}-layer-${layerIndex}`;
                return (
                  <div key={layerKey} className="mt-4">
                    <button
                      onClick={() => toggleLayerDetails(layerKey)}
                      className={classes.accordionButton}
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
                      <div className="pl-4 pr-4 pb-4 pt-2 border border-t-0 bg-gray-100 border-gray-200 dark:bg-gray-700 rounded-b-lg">
                        {layer.wedgeLayers.map((wedge, wedgeIndex) => (
                          <div key={`wedge-${wedgeIndex}`} className="mb-4">
                            <h4 className="text-xl font-semibold mb-2 dark:text-white">
                              Wedge {wedgeIndex + 1}
                            </h4>
                            <div className="mb-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
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
                                className="mb-4"
                              >
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                  Initiative {labelIndex + 1}:
                                </label>
                                <input
                                  type="text"
                                  className={classes.inputInitiative}
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
                                  className={classes.removeInitiativeButton}
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
                              className={classes.addLayerButton}
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
                              className={classes.actionButton}
                            >
                              Remove Wedge
                            </button>
                          </div>
                        ))}
                
                        <button
                          onClick={() => addWedgeLayer(branchIndex, layerIndex)}
                          className={classes.addWedgeButton}
                        >
                          Add Wedge
                        </button>
                
                        <button
                          onClick={() => removeOnionLayer(branchIndex, layerIndex)}
                          className={classes.actionButton}
                        >
                          Remove Onion Layer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              
              <button
                onClick={() => addOnionLayer(branchIndex)}
                className={classes.addLayerButton}
              >
                Add Onion Layer
              </button>
            </div>
          )}
        </div>
      ))}
      
      <button onClick={addBranch} className={classes.addWedgeButton}>
        Add Branch
      </button>
    </div>
  );
};

export default InputForm;