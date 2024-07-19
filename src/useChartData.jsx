import { useState, useEffect } from 'react';
import defaultChartData from './chartData.json';

const useChartData = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("chartData");
    return savedData ? JSON.parse(savedData) : defaultChartData;
  });

  const [settings, setSettings] = useState(() => ({
    orgLabel: localStorage.getItem("orgLabel") || "ORG",
    innerCircleColor: localStorage.getItem("innerCircleColor") || "#FF546D",
    orgLabelFontSize: parseInt(localStorage.getItem("orgLabelFontSize")) || 42,
    fontSize: parseInt(localStorage.getItem("fontSize")) || 12,
    innerRadius: parseInt(localStorage.getItem("innerRadius")) || 125,
    bannerWidth: parseInt(localStorage.getItem("bannerWidth")) || 75,
    bannerFontSize: parseInt(localStorage.getItem("bannerFontSize")) || 16,
    maxRadiusRatio: parseFloat(localStorage.getItem("maxRadiusRatio")) || 0.9,
    canvasSize: parseInt(localStorage.getItem("canvasSize")) || 1000,
  }));

  useEffect(() => {
    localStorage.setItem("chartData", JSON.stringify(data));
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
  }, [data, settings]);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  const addBranch = () => {
    const newBranch = {
      name: "New Branch",
      color: "#999999",
      flipText: false,
      heightAdjustment: 10,
      onionLayers: [
        {
          wedgeLayers: Array(3).fill({
            color: "#999999",
            labels: ["New Initiative"],
          }),
        },
      ],
    };
    setData(prevData => [...prevData, newBranch]);
  };

  const removeBranch = (branchIndex) => {
    setData(prevData => prevData.filter((_, index) => index !== branchIndex));
  };

  const handleBranchChange = (branchIndex, key, value) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex ? { ...branch, [key]: value } : branch
    ));
  };

  const addOnionLayer = (branchIndex) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: [
              ...branch.onionLayers, 
              { wedgeLayers: [{ color: "#FFFFFF", labels: ["New Initiative"] }] }
            ] 
          }
        : branch
    ));
  };

  const removeOnionLayer = (branchIndex, layerIndex) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.filter((_, lIndex) => lIndex !== layerIndex)
          }
        : branch
    ));
  };

  const addWedgeLayer = (branchIndex, layerIndex) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.map((layer, lIndex) => 
              lIndex === layerIndex
                ? { ...layer, wedgeLayers: [...layer.wedgeLayers, { color: "#DDDDDD", labels: ["New Label"] }] }
                : layer
            )
          }
        : branch
    ));
  };

  const removeWedgeLayer = (branchIndex, layerIndex, wedgeIndex) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.map((layer, lIndex) => 
              lIndex === layerIndex
                ? { ...layer, wedgeLayers: layer.wedgeLayers.filter((_, wIndex) => wIndex !== wedgeIndex) }
                : layer
            )
          }
        : branch
    ));
  };

  const handleWedgeChange = (branchIndex, layerIndex, wedgeIndex, key, value) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.map((layer, lIndex) => 
              lIndex === layerIndex
                ? { 
                    ...layer, 
                    wedgeLayers: layer.wedgeLayers.map((wedge, wIndex) => 
                      wIndex === wedgeIndex ? { ...wedge, [key]: value } : wedge
                    )
                  }
                : layer
            )
          }
        : branch
    ));
  };

  const addInitiative = (branchIndex, layerIndex, wedgeIndex) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.map((layer, lIndex) => 
              lIndex === layerIndex
                ? { 
                    ...layer, 
                    wedgeLayers: layer.wedgeLayers.map((wedge, wIndex) => 
                      wIndex === wedgeIndex 
                        ? { ...wedge, labels: [...wedge.labels, "New Initiative"] }
                        : wedge
                    )
                  }
                : layer
            )
          }
        : branch
    ));
  };

  const removeInitiative = (branchIndex, layerIndex, wedgeIndex, initiativeIndex) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.map((layer, lIndex) => 
              lIndex === layerIndex
                ? { 
                    ...layer, 
                    wedgeLayers: layer.wedgeLayers.map((wedge, wIndex) => 
                      wIndex === wedgeIndex 
                        ? { ...wedge, labels: wedge.labels.filter((_, iIndex) => iIndex !== initiativeIndex) }
                        : wedge
                    )
                  }
                : layer
            )
          }
        : branch
    ));
  };

  const handleInitiativeChange = (branchIndex, layerIndex, wedgeIndex, initiativeIndex, value) => {
    setData(prevData => prevData.map((branch, index) => 
      index === branchIndex 
        ? { 
            ...branch, 
            onionLayers: branch.onionLayers.map((layer, lIndex) => 
              lIndex === layerIndex
                ? { 
                    ...layer, 
                    wedgeLayers: layer.wedgeLayers.map((wedge, wIndex) => 
                      wIndex === wedgeIndex 
                        ? { ...wedge, labels: wedge.labels.map((label, iIndex) => iIndex === initiativeIndex ? value : label) }
                        : wedge
                    )
                  }
                : layer
            )
          }
        : branch
    ));
  };

  const resetToDefaults = () => {
    setData([...defaultChartData]);
    setSettings({
      orgLabel: "ORG",
      innerCircleColor: "#FF546D",
      orgLabelFontSize: 42,
      fontSize: 12,
      innerRadius: 125,
      bannerWidth: 75,
      bannerFontSize: 16,
      maxRadiusRatio: 0.9,
      canvasSize: 1000,
    });
    localStorage.clear();
  };

  return {
    data,
    settings,
    updateSettings,
    addBranch,
    removeBranch,
    handleBranchChange,
    addOnionLayer,
    removeOnionLayer,
    addWedgeLayer,
    removeWedgeLayer,
    handleWedgeChange,
    addInitiative,
    removeInitiative,
    handleInitiativeChange,
    resetToDefaults,
  };
};

export default useChartData;