import React from "react";
import { INPUT_CLASSES, BUTTON_CLASSES } from "../styles/classes";

const WedgeSettings = ({
  wedge,
  branchIndex,
  layerIndex,
  wedgeIndex,
  branchName,
  branchData,
  onLabelChange,
  onRemoveWedge,
  onClose,
}) => {
  const handleLabelChange = (value) => {
    onLabelChange(branchIndex, layerIndex, wedgeIndex, value);
  };

  const handleRemoveWedge = () => {
    const currentLayer = branchData?.onionLayers[layerIndex];
    if (currentLayer && currentLayer.wedgeLayers.length <= 1) {
      alert(
        "Cannot remove the last wedge from a layer. Each layer must have at least one wedge."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete this wedge?\n\n` +
        `This will permanently remove:\n` +
        `• The wedge and its label: "${wedge.label || "Unnamed"}"\n\n` +
        `This action cannot be undone.`
    );

    if (confirmed) {
      onRemoveWedge(branchIndex, layerIndex, wedgeIndex);
    }
  };

  // REFACTOR AND RENAME THIS FUNCTION
  const isLastWedgeInLayer =
    branchData?.onionLayers[layerIndex]?.wedgeLayers.length <= 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Wedge Settings
          </h3>
          <p className="text-sm text-gray-600">
            {branchName} → Layer {layerIndex + 1} → Wedge {wedgeIndex + 1}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Wedge Label */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>Wedge Label:</label>
        <textarea
          className={INPUT_CLASSES.formInput + " min-h-[80px] resize-y"}
          value={wedge.label || ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Enter wedge label"
          rows={3}
        />
      </div>

      {/* Wedge Remove Button */}
      <div className="border-t pt-4">
        <div className="flex space-x-2">
          <button
            onClick={handleRemoveWedge}
            className={`${BUTTON_CLASSES.buttonRed} text-sm ${
              isLastWedgeInLayer ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLastWedgeInLayer}
            title={
              isLastWedgeInLayer
                ? "Cannot remove the last wedge from a layer"
                : "Remove this wedge from the layer"
            }
          >
            Remove This Wedge
          </button>
        </div>
      </div>
    </div>
  );
};

export default WedgeSettings;
