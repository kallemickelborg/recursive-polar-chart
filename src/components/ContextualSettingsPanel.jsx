import React, { useEffect, useRef } from "react";
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
  addOnionLayer,
  removeOnionLayer,
  removeWedgeLayer,
  onDeleteBranch,
}) => {
  const panelRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!selectedElement) {
    return null;
  }

  const renderSettingsContent = () => {
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
            onRemoveWedge={removeWedgeLayer}
            onClose={onClose}
          />
        );
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40" />

      {/* Settings Panel FORMAT FOR BETTER UI/UX */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={panelRef}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="p-6">{renderSettingsContent()}</div>
        </div>
      </div>
    </>
  );
};

export default ContextualSettingsPanel;
