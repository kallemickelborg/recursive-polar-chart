import React from "react";

const InputForm = ({ data, onDataChange }) => {
    const updateData = (newData) => onDataChange(newData);

   // Define addBranch function
    const addBranch = () => {
        const newBranch = {
            name: "New Branch",
            color: "#FFFFFF", // Default white color for new branches
            flipText: false, // Default value, adjust as needed
            heightAdjustment: 10, // Default value, adjust as needed
            onionLayers: [{
                wedgeLayers: [{
                    color: "#FFFFFF", // Default color for new wedges
                    labels: ["New Initiative"] // Default text for new initiatives
                }]
            }]
        };
        onDataChange([...data, newBranch]);
    };

    // Define removeBranch function
    const removeBranch = (branchIndex) => {
        const newData = [...data];
        newData.splice(branchIndex, 1);
        onDataChange(newData);
    };

    // Implement handleWedgeChange and handleInitiativeChange if necessary
    // Example implementation for handleWedgeChange
    const handleWedgeChange = (branchIndex, layerIndex, wedgeIndex, key, value) => {
        const newData = [...data];
        const wedgeLayers = newData[branchIndex].onionLayers[layerIndex].wedgeLayers;
        wedgeLayers[wedgeIndex] = { ...wedgeLayers[wedgeIndex], [key]: value };
        onDataChange(newData);
    };

    // Example implementation for handleInitiativeChange
    const handleInitiativeChange = (branchIndex, layerIndex, wedgeIndex, initiativeIndex, value) => {
        const newData = [...data];
        const initiatives = newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex].labels;
        initiatives[initiativeIndex] = value;
        onDataChange(newData);
    };
  
    // Function to update branch details
    const handleBranchChange = (branchIndex, key, value) => {
        const newData = [...data];
        newData[branchIndex] = { ...newData[branchIndex], [key]: value };
        updateData(newData);
    };

    // Functions for Onion Layers
    const addOnionLayer = (branchIndex) => {
        const newData = [...data];
        const newOnionLayer = { wedgeLayers: [{ color: "#FFFFFF", labels: ["New Initiative"] }] };
        if (!newData[branchIndex].onionLayers) newData[branchIndex].onionLayers = [];
        newData[branchIndex].onionLayers.push(newOnionLayer);
        updateData(newData);
    };

    const removeOnionLayer = (branchIndex, layerIndex) => {
        const newData = [...data];
        newData[branchIndex].onionLayers.splice(layerIndex, 1);
        updateData(newData);
    };

    // Functions for Wedges
    const addWedgeLayer = (branchIndex, layerIndex) => {
        const newData = [...data];
        const newWedge = { color: "#DDDDDD", labels: ["New Label"] };
        newData[branchIndex].onionLayers[layerIndex].wedgeLayers.push(newWedge);
        updateData(newData);
    };

    const removeWedgeLayer = (branchIndex, layerIndex, wedgeIndex) => {
        const newData = [...data];
        newData[branchIndex].onionLayers[layerIndex].wedgeLayers.splice(wedgeIndex, 1);
        updateData(newData);
    };

    // Functions for Initiatives within Wedges
    const addInitiative = (branchIndex, layerIndex, wedgeIndex) => {
        const newData = [...data];
        newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex].labels.push("New Initiative");
        updateData(newData);
    };

    const removeInitiative = (branchIndex, layerIndex, wedgeIndex, initiativeIndex) => {
        const newData = [...data];
        newData[branchIndex].onionLayers[layerIndex].wedgeLayers[wedgeIndex].labels.splice(initiativeIndex, 1);
        updateData(newData);
    };

    // Rendering
    return (
        <div>
            {data.map((branch, branchIndex) => (
                <div key={`branch-${branchIndex}`}>
                    <input
                        type="text"
                        value={branch.name}
                        onChange={(e) => handleBranchChange(branchIndex, 'name', e.target.value)}
                    />
                    <input
                        type="color"
                        value={branch.color}
                        onChange={(e) => handleBranchChange(branchIndex, 'color', e.target.value)}
                    />
                    <button onClick={() => removeBranch(branchIndex)}>Remove Branch</button>
                    {branch.onionLayers.map((layer, layerIndex) => (
                        <div key={`layer-${layerIndex}`}>
                            Onion Layer {layerIndex + 1}
                            <button onClick={() => addWedgeLayer(branchIndex, layerIndex)}>Add Wedge</button>
                            <button onClick={() => removeOnionLayer(branchIndex, layerIndex)}>Remove Onion Layer</button>
                            {layer.wedgeLayers.map((wedge, wedgeIndex) => (
                                <div key={`wedge-${wedgeIndex}`}>
                                    Wedge {wedgeIndex + 1}
                                    <input
                                        type="color"
                                        value={wedge.color}
                                        onChange={(e) => handleWedgeChange(branchIndex, layerIndex, wedgeIndex, 'color', e.target.value)}
                                    />
                                    <button onClick={() => removeWedgeLayer(branchIndex, layerIndex, wedgeIndex)}>Remove Wedge</button>
                                    {wedge.labels.map((label, labelIndex) => (
                                        <div key={`initiative-${labelIndex}`}>
                                            <input
                                                type="text"
                                                value={label}
                                                onChange={(e) => handleInitiativeChange(branchIndex, layerIndex, wedgeIndex, labelIndex, e.target.value)}
                                            />
                                            <button onClick={() => removeInitiative(branchIndex, layerIndex, wedgeIndex, labelIndex)}>Remove Initiative</button>
                                        </div>
                                    ))}
                                    <button onClick={() => addInitiative(branchIndex, layerIndex, wedgeIndex)}>Add Initiative</button>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={() => addOnionLayer(branchIndex)}>Add Onion Layer</button>
                </div>
            ))}
            <button onClick={addBranch}>Add Branch</button>
        </div>
    );
};

export default InputForm;
