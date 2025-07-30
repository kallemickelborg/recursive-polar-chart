import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LAYOUT,
  TEXT,
  SWITCH,
  PATTERNS,
  section,
  sep
} from "@/styles/components";

const BranchSettings = ({
  branch,
  branchIndex,
  onBranchChange,
  onClose,
  onAddLayer,
  onRemoveLayer,
  onDeleteBranch,
  defaultBannerFontSize,
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
    <div className={LAYOUT.dialog}>
      <CardHeader className={LAYOUT.header}>
        <div className={LAYOUT.between}>
          <div className="space-y-1">
            <CardTitle className={TEXT.title}>
              Branch Settings
            </CardTitle>
            <CardDescription className={TEXT.desc}>
              Configure branch properties and appearance
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Branch Name */}
      <div className={section('primary')}>
        <Label htmlFor="branch-name" className={TEXT.label}>
          Branch Name
        </Label>
        <Input
          id="branch-name"
          type="text"
          value={branch.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter branch name"
          className="border-border/50 focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Branch Color */}
      <div className={section('secondary')}>
        <Label htmlFor="branch-color" className={TEXT.label}>
          Branch Color
        </Label>
        <div className={LAYOUT.start}>
          <input
            id="branch-color"
            type="color"
            value={branch.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-12 h-12 border-2 border-border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          />
          <span className={TEXT.code}>
            {branch.color}
          </span>
        </div>
      </div>

      {/* Flip Text Toggle */}
      <div className={section('primary')}>
        <Label htmlFor={`flip-text-${branchIndex}`} className={TEXT.label}>
          Flip Text
        </Label>
        <div className={SWITCH.box}>
          <Switch
            id={`flip-text-${branchIndex}`}
            checked={branch.flipText === true}
            onCheckedChange={(checked) => handleChange("flipText", checked)}
          />
          <Label htmlFor={`flip-text-${branchIndex}`} className={SWITCH.label}>
            <span className={branch.flipText ? SWITCH.active : SWITCH.inactive}>
              {branch.flipText ? "✓ Text is flipped" : "Text is normal"}
            </span>
          </Label>
        </div>
      </div>

      <Separator className={sep('default')} />

      {/* Banner Font Settings */}
      <div className={section('secondary')}>
        <h4 className={TEXT.label}>
          Banner Font Settings
        </h4>
        {/* Banner Font Size */}
        <div className={PATTERNS.slider.section}>
          <Label htmlFor="banner-font-size" className={PATTERNS.slider.label}>
            <span>Font Size</span>
            <span className={TEXT.value}>
              {branch.bannerFontSize || defaultBannerFontSize}px
            </span>
          </Label>
          <Slider
            id="banner-font-size"
            min={8}
            max={32}
            step={1}
            value={[branch.bannerFontSize || defaultBannerFontSize]}
            onValueChange={(value) => handleChange("bannerFontSize", value[0])}
            className={PATTERNS.slider.input}
          />
          <div className={PATTERNS.slider.ranges}>
            <span className={TEXT.rangeVal}>8px</span>
            <span className="text-center">Default: {defaultBannerFontSize}px</span>
            <span className={TEXT.rangeVal}>32px</span>
          </div>
        </div>

        {/* Banner Font Color */}
        <div className={PATTERNS.color.section}>
          <Label htmlFor="banner-font-color" className={PATTERNS.color.label}>Font Color</Label>
          <div className={PATTERNS.color.wrapper}>
            <input
              id="banner-font-color"
              type="color"
              value={branch.bannerFontColor || "#ffffff"}
              onChange={(e) => handleChange("bannerFontColor", e.target.value)}
              className="w-12 h-12 border-2 border-border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            />
            <div className="flex-1 space-y-1">
              <span className={TEXT.code}>
                {branch.bannerFontColor || "#ffffff"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleChange("bannerFontColor", "#ffffff")}
                className="h-7 text-xs"
              >
                Reset to White
              </Button>
            </div>
          </div>
        </div>

        {/* Banner Font Style */}
        <div className={PATTERNS.switch.section}>
          <Label className={PATTERNS.switch.label}>Font Style</Label>
          <div className={LAYOUT.grid2}>
            <div className={SWITCH.box}>
              <Switch
                id="banner-font-bold"
                checked={branch.bannerFontWeight === "bold"}
                onCheckedChange={(checked) => handleChange("bannerFontWeight", checked ? "bold" : "normal")}
              />
              <Label htmlFor="banner-font-bold" className={SWITCH.label}>
                <span className="font-bold">Bold</span>
              </Label>
            </div>
            <div className={SWITCH.box}>
              <Switch
                id="banner-font-italic"
                checked={branch.bannerFontStyle === "italic"}
                onCheckedChange={(checked) => handleChange("bannerFontStyle", checked ? "italic" : "normal")}
              />
              <Label htmlFor="banner-font-italic" className={SWITCH.label}>
                <span className="italic">Italic</span>
              </Label>
            </div>
          </div>
        </div>

        {/* Reset Banner Font Settings */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleChange("bannerFontSize", null);
            handleChange("bannerFontColor", null);
            handleChange("bannerFontWeight", null);
            handleChange("bannerFontStyle", null);
          }}
          className="w-full bg-gradient-to-r from-secondary/50 to-accent/50 hover:from-secondary hover:to-accent border-border/50"
        >
          <span className="mr-2">🔄</span>
          Reset to Default Banner Font Settings
        </Button>
      </div>

      <Separator className={sep('default')} />

      {/* Onion Layers Management */}
      <div className={section('primary')}>
        <div className={LAYOUT.between}>
          <Label className={TEXT.label}>
            Onion Layers ({branch.onionLayers.length})
          </Label>
          <Button
            onClick={() => onAddLayer(branchIndex)}
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white"
          >
            Add Layer
          </Button>
        </div>

        <div className={LAYOUT.space2}>
          {branch.onionLayers.map((layer, layerIndex) => (
            <div
              key={layerIndex}
              className="flex items-center justify-between bg-background/50 p-3 rounded-md border border-border/20"
            >
              <span className="text-sm font-medium">
                Layer {layerIndex + 1} ({layer.wedgeLayers.length} wedges)
              </span>
              {branch.onionLayers.length > 1 && (
                <Button
                  onClick={() => handleRemoveLayer(layerIndex)}
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs"
                >
                  Remove Layer
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className={sep('danger')} />

      {/* Delete Branch Section */}
      <div className={section('danger')}>
        <Label className="text-sm font-semibold text-destructive flex items-center gap-2">
          Danger Zone
        </Label>
        <div className="bg-destructive/5 p-3 rounded-md border border-destructive/20">
          <p className="text-sm text-destructive/80 mb-3">
            Permanently delete this branch and all its layers and wedges. This
            action cannot be undone.
          </p>
          <Button
            onClick={() => onDeleteBranch && onDeleteBranch(branchIndex)}
            variant="destructive"
            className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive shadow-lg"
          >
            <span className="mr-2">🗑️</span>
            Delete Branch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BranchSettings;
