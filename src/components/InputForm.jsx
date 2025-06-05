// React imports & hooks
import React, { useState } from "react";

// Styles
import {
  GENERAL_CLASSES,
  BUTTON_CLASSES,
  INPUT_CLASSES,
} from "../styles/classes";

const InputForm = ({
  settings,
  updateSettings,
  resetToDefaults,
  exportToExcel,
  importFromExcel,
  isLoading,
}) => {
  const [exportSettingsExpanded, setExportSettingsExpanded] = useState(false);

  const toggleExportSettings = () => {
    setExportSettingsExpanded(!exportSettingsExpanded);
  };

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const handleResetToDefaults = () => {
    const confirmed = window.confirm(
      `Are you sure you want to reset the template?\n\n` +
        `This will permanently remove:\n` +
        `• All current branches and their data\n` +
        `• All customized settings\n` +
        `• Return to the default template\n\n` +
        `This action cannot be undone.`
    );

    if (confirmed) {
      resetToDefaults();
    }
  };

  const exportChart = (format) => {
    const svgElement = document.querySelector("#polar-chart");
    if (!svgElement) return;

    if (format === "svg") {
      // Export as SVG
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "polar-chart.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (format === "png") {
      // Export as PNG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(function (blob) {
          const url = URL.createObjectURL(blob);
          const downloadLink = document.createElement("a");
          downloadLink.href = url;
          downloadLink.download = "polar-chart.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        });
      };

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    }
  };

  return (
    <div className="space-y-4">
      {/* Canvas Size Settings */}
      <div className={GENERAL_CLASSES.sectionWrapper}>
        <h2 className="font-semibold text-lg mb-3">Canvas Settings</h2>

        {/* Canvas Size */}
        <div className={GENERAL_CLASSES.sectionWrapper}>
          <label className={INPUT_CLASSES.formLabel}>
            Canvas Size: {settings.canvasSize}px
          </label>
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
        </div>
      </div>

      {/* Import/Export Settings Accordion */}
      <div className={GENERAL_CLASSES.sectionWrapper}>
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
              onClick={() => document.getElementById("excel-upload").click()}
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
              onClick={handleResetToDefaults}
            >
              Reset Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
