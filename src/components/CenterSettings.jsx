import React from "react";
import { INPUT_CLASSES, BUTTON_CLASSES } from "../styles/classes";

const CenterSettings = ({ settings, onSettingsChange, onClose }) => {
  const handleChange = (key, value) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Center Settings</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Organization Label */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>Organization Label:</label>
        <input
          className={INPUT_CLASSES.formInput}
          type="text"
          value={settings.orgLabel}
          onChange={(e) => handleChange("orgLabel", e.target.value)}
          placeholder="Enter organization name"
        />
      </div>

      {/* Organization Label Font Size */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>
          Font Size: {settings.orgLabelFontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={settings.orgLabelFontSize}
          onChange={(e) =>
            handleChange("orgLabelFontSize", parseInt(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Label Font Size */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>
          Label Font Size: {settings.fontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="24"
          value={settings.fontSize}
          onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Inner Circle Color */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>Background Color:</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={settings.innerCircleColor}
            onChange={(e) => handleChange("innerCircleColor", e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            {settings.innerCircleColor}
          </span>
        </div>
      </div>

      {/* Inner Radius */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>
          Inner Radius: {settings.innerRadius}px
        </label>
        <input
          type="range"
          min="50"
          max="200"
          value={settings.innerRadius}
          onChange={(e) =>
            handleChange("innerRadius", parseInt(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Banner Font Size */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>
          Banner Font Size: {settings.bannerFontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="24"
          value={settings.bannerFontSize}
          onChange={(e) =>
            handleChange("bannerFontSize", parseInt(e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Max Radius Ratio */}
      <div>
        <label className={INPUT_CLASSES.formLabel}>
          Max Radius Ratio: {settings.maxRadiusRatio}
        </label>
        <input
          type="range"
          min="0.5"
          max="1"
          step="0.01"
          value={settings.maxRadiusRatio}
          onChange={(e) =>
            handleChange("maxRadiusRatio", parseFloat(e.target.value))
          }
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CenterSettings;
