import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LAYOUT,
  TEXT,
  INPUTS,
  SEP,
  SWITCH,
  PATTERNS,
  combine,
  createSection,
  createButton
} from "@/styles/components";

const WedgeSettings = ({
  wedge,
  branchIndex,
  layerIndex,
  wedgeIndex,
  branchName,
  branchData,
  onLabelChange,
  onWedgeFontChange,
  onRemoveWedge,
  onClose,
  defaultFontSize,
}) => {
  const handleLabelChange = (value) => {
    onLabelChange(branchIndex, layerIndex, wedgeIndex, value);
  };

  const handleFontChange = (property, value) => {
    onWedgeFontChange(branchIndex, layerIndex, wedgeIndex, property, value);
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
    <div className={LAYOUT.dialog}>
      <CardHeader className={LAYOUT.header}>
        <div className={LAYOUT.between}>
          <div className="space-y-1">
            <CardTitle className={TEXT.title}>
              Wedge Settings
            </CardTitle>
            <CardDescription className={TEXT.desc}>
              {branchName} → Layer {layerIndex + 1} → Wedge {wedgeIndex + 1}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Wedge Label */}
      <div className={createSection('secondary')}>
        <Label htmlFor="wedge-label" className={TEXT.label}>
          Wedge Label
        </Label>
        <Textarea
          id="wedge-label"
          value={wedge.label || ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Enter wedge label (text will automatically wrap to fit the wedge)"
          rows={3}
          className={combine("min-h-[80px] resize-y", INPUTS.text)}
        />
      </div>

      <Separator className={SEP.default} />

      {/* Font Settings */}
      <div className={createSection('secondary')}>
        <h4 className={TEXT.label}>
          Font Settings
        </h4>

        {/* Font Size */}
        <div className={PATTERNS.slider.container}>
          <Label htmlFor="font-size" className={PATTERNS.slider.label}>
            <span>Font Size</span>
            <span className={TEXT.value}>
              {wedge.fontSize || defaultFontSize}px
            </span>
          </Label>
          <Slider
            id="font-size"
            min={8}
            max={32}
            step={1}
            value={[wedge.fontSize || defaultFontSize]}
            onValueChange={(value) => handleFontChange("fontSize", value[0])}
            className={PATTERNS.slider.input}
          />
          <div className={PATTERNS.slider.ranges}>
            <span className={TEXT.rangeVal}>8px</span>
            <span className="text-center">Default: {defaultFontSize}px</span>
            <span className={TEXT.rangeVal}>32px</span>
          </div>
        </div>

        {/* Font Color */}
        <div className={PATTERNS.color.container}>
          <Label htmlFor="font-color" className={PATTERNS.color.label}>Font Color</Label>
          <div className={PATTERNS.color.wrapper}>
            <input
              id="font-color"
              type="color"
              value={wedge.fontColor || "#ffffff"}
              onChange={(e) => handleFontChange("fontColor", e.target.value)}
              className={PATTERNS.color.input}
            />
            <div className="flex-1 space-y-1">
              <span className={TEXT.code}>
                {wedge.fontColor || "#ffffff"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFontChange("fontColor", "#ffffff")}
                className="h-7 text-xs"
              >
                Reset to White
              </Button>
            </div>
          </div>
        </div>

        {/* Font Style */}
        <div className={INPUTS.container}>
          <Label className={TEXT.label}>Font Style</Label>
          <div className={LAYOUT.grid2}>
            <div className={SWITCH.container}>
              <Switch
                id="font-bold"
                checked={wedge.fontWeight === "bold"}
                onCheckedChange={(checked) => handleFontChange("fontWeight", checked ? "bold" : "normal")}
              />
              <Label htmlFor="font-bold" className={SWITCH.label}>
                <span className="font-bold">Bold</span>
              </Label>
            </div>
            <div className={SWITCH.container}>
              <Switch
                id="font-italic"
                checked={wedge.fontStyle === "italic"}
                onCheckedChange={(checked) => handleFontChange("fontStyle", checked ? "italic" : "normal")}
              />
              <Label htmlFor="font-italic" className={SWITCH.label}>
                <span className="italic">Italic</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Reset Font Settings */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleFontChange("fontSize", null);
            handleFontChange("fontColor", null);
            handleFontChange("fontWeight", null);
            handleFontChange("fontStyle", null);
          }}
          className={createButton('resetButton')}
        >
          <span className="mr-2">🔄</span>
          Reset to Default Font Settings
        </Button>
      </div>

      <Separator className={SEP.destructive} />

      {/* Wedge Remove Button */}
      <div className="pt-2">
        <Button
          variant="destructive"
          onClick={handleRemoveWedge}
          disabled={isLastWedgeInLayer}
          className={combine(createButton('destructive'), "w-full disabled:opacity-50 disabled:cursor-not-allowed")}
          title={
            isLastWedgeInLayer
              ? "Cannot remove the last wedge from a layer"
              : "Remove this wedge from the layer"
          }
        >
          <span className="mr-2">🗑️</span>
          Remove This Wedge
        </Button>
      </div>
    </div>
  );
};

export default WedgeSettings;
