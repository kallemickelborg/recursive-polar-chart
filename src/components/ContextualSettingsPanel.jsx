import React from "react";
import { DraggableDialog } from "@/components/ui/draggable-dialog";
import CenterSettings from "./CenterSettings";
import BranchSettings from "./BranchSettings";
import WedgeSettings from "./WedgeSettings";

const ContextualSettingsPanel = ({
  selectedElement,
  data,
  settings,
  onClose,
  updateSettings,
  handleBranchChange,
  handleLabelChange,
  handleWedgeFontChange,
  addOnionLayer,
  removeOnionLayer,
  removeWedgeLayer,
  onDeleteBranch,
}) => {

  const renderSettingsContent = () => {
    if (!selectedElement) return null;

    switch (selectedElement.type) {
      case "center":
        return (
          <CenterSettings
            settings={settings}
            onSettingsChange={updateSettings}
            onClose={onClose}
          />
        );

      case "branch":
        const { branchIndex } = selectedElement.indices;
        const branch = data[branchIndex];

        return (
          <BranchSettings
            branch={branch}
            branchIndex={branchIndex}
            onBranchChange={handleBranchChange}
            onAddLayer={addOnionLayer}
            onRemoveLayer={removeOnionLayer}
            onClose={onClose}
            onDeleteBranch={onDeleteBranch}
            defaultBannerFontSize={settings.bannerFontSize}
          />
        );

      case "wedge":
        const {
          branchIndex: wBranchIndex,
          layerIndex,
          wedgeIndex,
        } = selectedElement.indices;

        const wedgeBranch = data[wBranchIndex];

        // REMOVE THIS AS TESTING HAS BEEN DONE
        if (!wedgeBranch) {
          console.warn("Selected branch no longer exists, closing panel");
          onClose();
          return null;
        }

        const targetLayer = wedgeBranch.onionLayers[layerIndex];
        if (!targetLayer) {
          console.warn("Selected layer no longer exists, closing panel");
          onClose();
          return null;
        }

        const wedge = targetLayer.wedgeLayers[wedgeIndex];
        if (!wedge) {
          console.warn("Selected wedge no longer exists, closing panel");
          onClose();
          return null;
        }

        return (
          <WedgeSettings
            wedge={wedge}
            branchIndex={wBranchIndex}
            layerIndex={layerIndex}
            wedgeIndex={wedgeIndex}
            branchName={wedgeBranch.name}
            branchData={wedgeBranch}
            onLabelChange={handleLabelChange}
            onWedgeFontChange={handleWedgeFontChange}
            onRemoveWedge={removeWedgeLayer}
            onClose={onClose}
            defaultFontSize={settings.fontSize}
          />
        );
    }
  };

  if (!selectedElement) {
    return null;
  }

  return (
    <DraggableDialog open={!!selectedElement} onOpenChange={onClose}>
      {renderSettingsContent()}
    </DraggableDialog>
  );
};

export default ContextualSettingsPanel;
