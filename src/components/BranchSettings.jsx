import React from "react";
import { INPUT_CLASSES, BUTTON_CLASSES } from "../styles/classes";

const BranchSettings = ({
  branch,
  branchIndex,
  onBranchChange,
  onClose,
  onAddLayer,
  onRemoveLayer,
  onDeleteBranch,
}) => {
  const handleChange = (key, value) => {
    onBranchChange(branchIndex, key, value);
  };

  const handleRemoveLayer = (layerIndex) => {
    const layer = branch.onionLayers[layerIndex];
    const confirmed = window.confirm(
      `Are you sure you want to delete layer ${layerIndex + 1}?\n\n` +
        `This will permanently remove:\n` +
        `• The entire onion layer\n` +
        `• All ${layer.wedgeLayers.length} wedges in this layer\n` +
        `• All labels in those wedges\n\n` +
        `This action cannot be undone.`
    );

    if (confirmed) {
      onRemoveLayer(branchIndex, layerIndex);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Branch Settings</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Branch Name */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>Branch Name:</label>
        <input
          className={INPUT_CLASSES.formInput}
          type="text"
          value={branch.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter branch name"
        />
      </div>

      {/* Branch Color */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>Branch Color:</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={branch.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600">{branch.color}</span>
        </div>
      </div>

      {/* Flip Text Toggle */}
      <div className="flex items-center justify-between">
        <label className={INPUT_CLASSES.formLabel}>Flip Text:</label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none">
          <input
            type="checkbox"
            id={`flip-text-${branchIndex}`}
            checked={branch.flipText || false}
            onChange={(e) => handleChange("flipText", e.target.checked)}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor={`flip-text-${branchIndex}`}
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
        <span className="text-sm text-gray-700">
          {branch.flipText ? "Flipped" : "Normal"}
        </span>
      </div>

      {/* Height Adjustment */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>
          Height Adjustment: {branch.heightAdjustment || 0}px
        </label>
        <input
          type="range"
          min="-50"
          max="50"
          value={branch.heightAdjustment || 0}
          onChange={(e) =>
            handleChange("heightAdjustment", parseInt(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Onion Layers Management */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className={INPUT_CLASSES.formLabel}>
            Onion Layers ({branch.onionLayers.length}):
          </label>
          <button
            onClick={() => onAddLayer(branchIndex)}
            className={BUTTON_CLASSES.buttonGreen + " text-xs px-2 py-1"}
          >
            + Add Layer
          </button>
        </div>

        <div className="space-y-2">
          {branch.onionLayers.map((layer, layerIndex) => (
            <div
              key={layerIndex}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <span className="text-sm">
                Layer {layerIndex + 1} ({layer.wedgeLayers.length} wedges)
              </span>
              {branch.onionLayers.length > 1 && (
                <button
                  onClick={() => handleRemoveLayer(layerIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Branch Section */}
      <div className="mt-6 pt-4 border-t border-red-200">
        <label className={INPUT_CLASSES.formLabel + " text-red-600"}>
          Danger Zone:
        </label>
        <div className="bg-red-50 p-3 rounded border border-red-200">
          <p className="text-sm text-red-600 mb-3">
            Permanently delete this branch and all its layers and wedges. This
            action cannot be undone.
          </p>
          <button
            onClick={() => onDeleteBranch && onDeleteBranch(branchIndex)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Delete Branch
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchSettings;
