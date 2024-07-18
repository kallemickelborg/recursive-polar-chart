import React, { useState } from "react";

const InputForm = ({ data, onDataChange, orgLabel }) => {
  const classes = {
    contentWrapper: "content-wrapper",
    drawerItem: "drawer-item",
    label: "w-full block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300",
    input: "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
    inputInitiative: "initiative-input bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
    accordionButton: "flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 bg-white rounded-t-lg border border-gray-200 shadow-sm hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-600",
    accordionDetails: "p-5 border border-t-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-lg",
    actionButton: "mt-5 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900",
    removeInitiativeButton: "initiative-remove w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900",
    addLayerButton: "mt-5 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800",
    addWedgeButton: "mt-5 w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800"
  };

  const [expandedBranches, setExpandedBranches] = useState({});
  const [expandedLayers, setExpandedLayers] = useState({});

  const toggleBranchDetails = (index) => {
    setExpandedBranches((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const toggleLayerDetails = (layerKey) => {
    setExpandedLayers((prevState) => ({ ...prevState, [layerKey]: !prevState[layerKey] }));
  };

  const addBranch = () => {
    const newBranch = {
      name: "New Branch",
      color: "#999999",
      flipText: false,
      heightAdjustment: 10,
      onionLayers: [
        {
          wedgeLayers: Array(3).fill({ color: "#999999", labels: ["New Initiative"] })
        },
        {
          wedgeLayers: Array(3).fill({ color: "#999999", labels: ["New Initiative"] })
        },
        {
          wedgeLayers: Array(3).fill({ color: "#999999", labels: ["New Initiative"] })
        },
        {
          wedgeLayers: [
            {
              color: "#999999",
              labels: [
                "What is the purpose of your organization and how can a vision bring that to life?",
              ],
            },
          ],
        },
      ],
    };
    const updatedData = [...data, newBranch];
    onDataChange(updatedData);
    localStorage.setItem("chartData", JSON.stringify(updatedData));
  };

  const removeBranch = (branchIndex) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this branch?");
    if (isConfirmed) {
      const newData = [...data];
      newData.splice(branchIndex, 1);
      onDataChange(newData);
      localStorage.setItem("chartData", JSON.stringify(newData));
    }
  };

  const handleBranchChange = (branchIndex, key, value) => {
    const newData = [...data];
    newData[branchIndex] = { ...newData[branchIndex], [key]: value };
    onDataChange(newData);
    localStorage.setItem("chartData", JSON.stringify(newData));
  };

  const addOnionLayer = (branchIndex) => {
    const newData = [...data];
    const newOnionLayer = { wedgeLayers: [{ color: "#FFFFFF", labels: ["New Initiative"] }] };
    newData[branchIndex].onionLayers = newData[branchIndex].onionLayers || [];
    newData[branchIndex].onionLayers.push(newOnionLayer);
    onDataChange(newData);
    localStorage.setItem("chartData", JSON.stringify(newData));
  };

  const removeOnionLayer = (branchIndex, layerIndex) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this onion layer?");
    if (isConfirmed) {
      const newData = [...data];
      newData[branchIndex].onionLayers.splice(layerIndex, 1);
      onDataChange(newData);
      localStorage.setItem("chartData", JSON.stringify(newData));
    }
  };

  const addWedgeLayer = (branchIndex, layerIndex) => {
    const newData = [...data];
    const newWedge = { color: "#DDDDDD", labels: ["New Label"] };
    newData[branchIndex].onionLayers[layerIndex].wedgeLayers.push(newWedge);
    onDataChange(newData);
    localStorage.setItem("chartData", JSON.stringify(newData));
  };

  const removeWedgeLayer = (branchIndex, layerIndex, wedgeIndex) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this wedge layer?");
    if (isConfirmed) {
      const newData = [...data];
      newData[branchIndex].onionLayers[layerIndex].wedgeLayers.splice(wedgeIndex, 1);
      onDataChange(newData);
      localStorage.setItem("chartData", JSON.stringify(newData));
    }
  };

  const handleWedgeChange = (branchIndex, layerIndex, wedgeIndex, key, value) => {
    const newData = [...data];
    newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex][key] = value;
    onDataChange(newData);
    localStorage.setItem("chartData", JSON.stringify(newData));
  };

  const addInitiative = (branchIndex, layerIndex, wedgeIndex) => {
    const newData = [...data];
    newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex].labels.push("New Initiative");
    onDataChange(newData);
    localStorage.setItem("chartData", JSON.stringify(newData));
  };

  const removeInitiative = (branchIndex, layerIndex, wedgeIndex, initiativeIndex) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this initiative?");
    if (isConfirmed) {
      const newData = [...data];
      newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex].labels.splice(initiativeIndex, 1);
      onDataChange(newData);
      localStorage.setItem("chartData", JSON.stringify(newData));
    }
  };

  const handleInitiativeChange = (branchIndex, layerIndex, wedgeIndex, initiativeIndex, value) => {
    const newData = [...data];
    newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex].labels[initiativeIndex] = value;
    onDataChange(newData);
    localStorage.setItem("chartData", JSON.stringify(newData));
  };

  const handleOrgLabelChange = (newLabel) => {
    onDataChange(null, newLabel);
  };

  return (
    <div className={classes.contentWrapper}>
      <div className={classes.drawerItem}>
        <label className={classes.label}>Organization Label:</label>
        <input
          className={classes.input}
          type="text"
          value={orgLabel}
          onChange={(e) => handleOrgLabelChange(e.target.value)}
        />
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
                  onChange={(e) => handleBranchChange(branchIndex, "name", e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className={classes.label}>Branch Color:</label>
                <input
                  className="w-20 h-10 p-0 border-0 rounded-lg cursor-pointer"
                  type="color"
                  value={branch.color}
                  onChange={(e) => handleBranchChange(branchIndex, "color", e.target.value)}
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

                        <hr class="my-6 h-0.5 border-t-0 bg-neutral-400 dark:bg-white/10" />

                        <button
                          onClick={() => addWedgeLayer(branchIndex, layerIndex)}
                          className={classes.addWedgeButton}
                        >
                          Add Wedge
                        </button>

                        <button
                          onClick={() => addOnionLayer(branchIndex)}
                          className={classes.addWedgeButton}
                        >
                          Add Onion Layer
                        </button>

                        <button
                          onClick={() =>
                            confirm(
                              "Are you sure you want to delete this onion layer?"
                            ) && removeOnionLayer(branchIndex, layerIndex)
                          }
                          className={classes.actionButton}
                        >
                          Remove Onion Layer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <div className="mt-4">
        <button onClick={addBranch} className={classes.addWedgeButton}>
          Add Branch
        </button>
      </div>
    </div>
  );
};

export default InputForm;
