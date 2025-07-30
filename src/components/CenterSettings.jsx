import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LAYOUT,
  TEXT,
  section
} from "@/styles/components";

const CenterSettings = ({ settings, onSettingsChange, onClose }) => {
  const handleChange = (key, value) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className={LAYOUT.dialog}>
      <CardHeader className={LAYOUT.header}>
        <div className={LAYOUT.between}>
          <div className="space-y-1">
            <CardTitle className={TEXT.title}>
              Center Settings
            </CardTitle>
            <CardDescription className={TEXT.desc}>
              Configure center circle properties and appearance
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Organization Label */}
      <div className={section('primary')}>
        <Label htmlFor="org-label" className={TEXT.label}>
          Organization Label
        </Label>
        <Input
          id="org-label"
          className="border-border/50 focus:border-primary/50 transition-colors"
          type="text"
          value={settings.orgLabel}
          onChange={(e) => handleChange("orgLabel", e.target.value)}
          placeholder="Enter organization name"
        />
      </div>

      {/* Organization Label Font Size */}
      <div className={section('secondary')}>
        <Label htmlFor="org-font-size" className={`${TEXT.label} ${LAYOUT.between}`}>
          <span>Font Size</span>
          <span className={TEXT.value}>
            {settings.orgLabelFontSize}px
          </span>
        </Label>
        <Slider
          id="org-font-size"
          min={12}
          max={72}
          step={1}
          value={[settings.orgLabelFontSize]}
          onValueChange={(value) => handleChange("orgLabelFontSize", value[0])}
          className="w-full"
        />
        <div className={`flex justify-between text-xs text-muted-foreground`}>
          <span className={TEXT.rangeVal}>12px</span>
          <span className="text-center">Organization Label Size</span>
          <span className={TEXT.rangeVal}>72px</span>
        </div>
      </div>

      {/* Label Font Size */}
      <div className={section('primary')}>
        <Label htmlFor="label-font-size" className={`${TEXT.label} ${LAYOUT.between}`}>
          <span>Label Font Size</span>
          <span className={TEXT.value}>
            {settings.fontSize}px
          </span>
        </Label>
        <Slider
          id="label-font-size"
          min={8}
          max={24}
          step={1}
          value={[settings.fontSize]}
          onValueChange={(value) => handleChange("fontSize", value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={TEXT.rangeVal}>8px</span>
          <span className="text-center">Label Font Size</span>
          <span className={TEXT.rangeVal}>24px</span>
        </div>
      </div>

      {/* Inner Circle Color */}
      <div className={section('secondary')}>
        <Label htmlFor="bg-color" className={TEXT.label}>
          Background Color
        </Label>
        <div className={LAYOUT.start}>
          <input
            id="bg-color"
            type="color"
            value={settings.innerCircleColor}
            onChange={(e) => handleChange("innerCircleColor", e.target.value)}
            className="w-12 h-12 border-2 border-border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          />
          <span className={TEXT.code}>
            {settings.innerCircleColor}
          </span>
        </div>
      </div>

      {/* Inner Radius */}
      <div className={section('primary')}>
        <Label htmlFor="inner-radius" className={`${TEXT.label} ${LAYOUT.between}`}>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Inner Radius
          </span>
          <span className={TEXT.value}>
            {settings.innerRadius}px
          </span>
        </Label>
        <Slider
          id="inner-radius"
          min={50}
          max={200}
          step={1}
          value={[settings.innerRadius]}
          onValueChange={(value) => handleChange("innerRadius", value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={TEXT.rangeVal}>50px</span>
          <span className="text-center">Center Circle Size</span>
          <span className={TEXT.rangeVal}>200px</span>
        </div>
      </div>

      {/* Banner Font Size */}
      <div className={section('secondary')}>
        <Label htmlFor="banner-font-size" className={`${TEXT.label} ${LAYOUT.between}`}>
          <span>Banner Font Size</span>
          <span className={TEXT.value}>
            {settings.bannerFontSize}px
          </span>
        </Label>
        <Slider
          id="banner-font-size"
          min={8}
          max={24}
          step={1}
          value={[settings.bannerFontSize]}
          onValueChange={(value) => handleChange("bannerFontSize", value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={TEXT.rangeVal}>8px</span>
          <span className="text-center">Banner Font Size</span>
          <span className={TEXT.rangeVal}>24px</span>
        </div>
      </div>

      {/* Max Radius Ratio */}
      <div className={section('primary')}>
        <Label htmlFor="max-radius-ratio" className={`${TEXT.label} ${LAYOUT.between}`}>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            Max Radius Ratio
          </span>
          <span className={TEXT.value}>
            {settings.maxRadiusRatio}
          </span>
        </Label>
        <Slider
          id="max-radius-ratio"
          min={0.5}
          max={1}
          step={0.01}
          value={[settings.maxRadiusRatio]}
          onValueChange={(value) => handleChange("maxRadiusRatio", value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={TEXT.rangeVal}>0.5</span>
          <span className="text-center">Chart Size Ratio</span>
          <span className={TEXT.rangeVal}>1.0</span>
        </div>
      </div>

      {/* Banner Height */}
      <div className={section('secondary')}>
        <Label htmlFor="banner-height" className={`${TEXT.label} ${LAYOUT.between}`}>
          <span>Banner Height</span>
          <span className={TEXT.value}>
            {settings.bannerWidth}px
          </span>
        </Label>
        <Slider
          id="banner-height"
          min={25}
          max={150}
          step={1}
          value={[settings.bannerWidth]}
          onValueChange={(value) => handleChange("bannerWidth", value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className={TEXT.rangeVal}>25px</span>
          <span className="text-center">Banner Height</span>
          <span className={TEXT.rangeVal}>150px</span>
        </div>
      </div>
    </div>
  );
};

export default CenterSettings;
