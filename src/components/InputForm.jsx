// React imports & hooks
import React, { useState } from "react";

// Components
import { ThemeToggle } from "./ThemeToggle";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Styles
import {
  LAYOUT,
  TEXT,
  PATTERNS,
  btn
} from "@/styles/components";

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
    // Select the SVG element rendered by D3
    const svgElement = document.querySelector("#chart svg");
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
    <div className={LAYOUT.space4}>
      {/* Theme Toggle */}
      <div className={LAYOUT.full}>
        <ThemeToggle />
      </div>

      {/* Canvas Size Settings */}
      <div className={`${LAYOUT.full} ${LAYOUT.space3}`}>
        <h2 className="font-semibold text-lg mb-3">Canvas Settings</h2>

        {/* Canvas Size */}
        <div className={PATTERNS.slider.section}>
          <Label htmlFor="canvas-size" className={PATTERNS.slider.label}>
            <span>Canvas Size</span>
            <span className={TEXT.value}>
              {settings.canvasSize}px
            </span>
          </Label>
          <Slider
            id="canvas-size"
            min={1000}
            max={3000}
            step={100}
            value={[settings.canvasSize]}
            onValueChange={(value) => handleSettingChange("canvasSize", value[0])}
            className={PATTERNS.slider.input}
          />
          <div className={PATTERNS.slider.ranges}>
            <span className={TEXT.rangeVal}>1000px</span>
            <span className="text-center">Chart Canvas Size</span>
            <span className={TEXT.rangeVal}>3000px</span>
          </div>
        </div>
      </div>

      {/* Import/Export Settings */}
      <div className={`${LAYOUT.full} ${LAYOUT.space3}`}>
        <div className={`${LAYOUT.full} ${LAYOUT.space3}`}>
          <div className={LAYOUT.column}>
            {/* Export to Excel button */}
            <Button
              onClick={exportToExcel}
              disabled={isLoading}
              variant="outline"
              className={btn('full')}
            >
              📊 Export to Excel
            </Button>

            {/* Import from Excel button */}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={importFromExcel}
              style={{ display: "none" }}
              id="excel-upload"
              disabled={isLoading}
            />
            <Button
              onClick={() => document.getElementById("excel-upload").click()}
              disabled={isLoading}
              variant="outline"
              className={btn('full')}
            >
              {isLoading ? "⏳ Importing..." : "📁 Import from Excel"}
            </Button>

            {/* Export SVG button */}
            <Button
              onClick={() => exportChart("svg")}
              variant="outline"
              className={btn('full')}
            >
              🖼️ Export as SVG
            </Button>

            {/* Export PNG button */}
            <Button
              onClick={() => exportChart("png")}
              variant="outline"
              className={btn('full')}
            >
              📷 Export as PNG
            </Button>

            {/* Reset Template button */}
            <Button
              variant="destructive"
              onClick={handleResetToDefaults}
              className={btn('full')}
            >
              🔄 Reset Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
