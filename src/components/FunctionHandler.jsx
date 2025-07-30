// React hooks
import { useState, useEffect, useRef } from "react";

// Data
import defaultChartConfig from "../chartData.json";
import * as XLSX from "xlsx";

const useChartData = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("chartData");
    return savedData ? JSON.parse(savedData) : defaultChartConfig.branches;
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("chartSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : defaultChartConfig.settings;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dataVersion = useRef(0);

  useEffect(() => {
    localStorage.setItem("chartData", JSON.stringify(data));
    localStorage.setItem("chartSettings", JSON.stringify(settings));
  }, [data, settings]);

  const importFromExcel = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsBinaryString(file);
      });

      const wb = XLSX.read(result, { type: "binary" });

      const settingsSheet = wb.Sheets["Settings"];
      const branchesSheet = wb.Sheets["Branches"];

      if (!settingsSheet || !branchesSheet) {
        throw new Error("Invalid Excel file format");
      }

      const newSettings = XLSX.utils.sheet_to_json(settingsSheet)[0];
      const branchesData = XLSX.utils.sheet_to_json(branchesSheet);

      // Reconstruct the branches structure with single labels
      const newBranches = [];
      branchesData.forEach((row) => {
        let branch = newBranches.find((b) => b.name === row.BranchName);
        if (!branch) {
          branch = {
            name: row.BranchName,
            color: row.BranchColor,
            flipText: row.BranchFlipText || false,
            ...(row.BannerFontSize && { bannerFontSize: parseInt(row.BannerFontSize) }),
            ...(row.BannerFontColor && { bannerFontColor: row.BannerFontColor }),
            ...(row.BannerFontWeight && { bannerFontWeight: row.BannerFontWeight }),
            ...(row.BannerFontStyle && { bannerFontStyle: row.BannerFontStyle }),
            onionLayers: [],
          };
          newBranches.push(branch);
        }

        let layer = branch.onionLayers[row.OnionLayerIndex];
        if (!layer) {
          layer = { wedgeLayers: [] };
          branch.onionLayers[row.OnionLayerIndex] = layer;
        }

        let wedge = layer.wedgeLayers[row.WedgeLayerIndex];
        if (!wedge) {
          wedge = {
            label: row.Label || "Label",
            ...(row.FontSize && { fontSize: parseInt(row.FontSize) }),
            ...(row.FontColor && { fontColor: row.FontColor }),
            ...(row.FontWeight && { fontWeight: row.FontWeight }),
            ...(row.FontStyle && { fontStyle: row.FontStyle }),
          };
          layer.wedgeLayers[row.WedgeLayerIndex] = wedge;
        }
      });

      // Update state in a single batch
      setSettings(newSettings);
      setData(newBranches);
      dataVersion.current += 1;

      localStorage.setItem("chartSettings", JSON.stringify(newSettings));
      localStorage.setItem("chartData", JSON.stringify(newBranches));
    } catch (error) {
      setError("Error importing Excel file: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  const resetToDefaults = () => {
    setData([...defaultChartConfig.branches]);
    setSettings({ ...defaultChartConfig.settings });
    localStorage.clear();
  };

  const addBranch = (insertIndex = null) => {
    const newBranch = {
      name: "New Branch",
      color: "#333333",
      flipText: false,
      onionLayers: Array.from({ length: 3 }, () => ({
        wedgeLayers: Array.from({ length: 2 }, () => ({
          label: "New Label",
        })),
      })),
    };

    setData((prevData) => {
      if (insertIndex === null || insertIndex >= prevData.length) {
        // Add at end
        return [...prevData, newBranch];
      } else {
        // Insert at specific position
        const newData = [...prevData];
        newData.splice(insertIndex, 0, newBranch);
        return newData;
      }
    });
  };

  const removeBranch = (branchIndex) => {
    setData((prevData) => prevData.filter((_, index) => index !== branchIndex));
  };

  const handleBranchChange = (branchIndex, key, value) => {
    setData((prevData) =>
      prevData.map((branch, index) =>
        index === branchIndex ? { ...branch, [key]: value } : branch
      )
    );
  };

  const addOnionLayer = (branchIndex, insertIndex = null) => {
    setData((prevData) =>
      prevData.map((branch, index) => {
        if (index !== branchIndex) return branch;

        const newLayer = {
          wedgeLayers: [
            { label: "New Label" },
            { label: "New Label" },
            { label: "New Label" },
          ],
        };

        if (insertIndex === null || insertIndex >= branch.onionLayers.length) {
          // Add at end
          return {
            ...branch,
            onionLayers: [...branch.onionLayers, newLayer],
          };
        } else {
          // Insert at specific position
          const newLayers = [...branch.onionLayers];
          newLayers.splice(insertIndex, 0, newLayer);
          return {
            ...branch,
            onionLayers: newLayers,
          };
        }
      })
    );
  };

  const removeOnionLayer = (branchIndex, layerIndex) => {
    setData((prevData) =>
      prevData.map((branch, index) =>
        index === branchIndex
          ? {
              ...branch,
              onionLayers: branch.onionLayers.filter(
                (_, lIndex) => lIndex !== layerIndex
              ),
            }
          : branch
      )
    );
  };

  const addWedgeLayer = (branchIndex, layerIndex, insertIndex = null) => {
    setData((prevData) =>
      prevData.map((branch, index) => {
        if (index !== branchIndex) return branch;

        return {
          ...branch,
          onionLayers: branch.onionLayers.map((layer, lIndex) => {
            if (lIndex !== layerIndex) return layer;

            const newWedge = { label: "New Label" };

            if (
              insertIndex === null ||
              insertIndex >= layer.wedgeLayers.length
            ) {
              // Add at end
              return {
                ...layer,
                wedgeLayers: [...layer.wedgeLayers, newWedge],
              };
            } else {
              // Insert at specific position
              const newWedges = [...layer.wedgeLayers];
              newWedges.splice(insertIndex, 0, newWedge);
              return {
                ...layer,
                wedgeLayers: newWedges,
              };
            }
          }),
        };
      })
    );
  };

  const removeWedgeLayer = (branchIndex, layerIndex, wedgeIndex, onSuccess) => {
    setData((prevData) => {
      const newData = prevData.map((branch, index) => {
        if (index !== branchIndex) return branch;

        const targetLayer = branch.onionLayers[layerIndex];

        // Prevent removing the last wedge from a layer
        if (targetLayer.wedgeLayers.length <= 1) {
          console.warn(
            "Cannot remove the last wedge from a layer. Each layer must have at least one wedge."
          );
          return branch;
        }

        return {
          ...branch,
          onionLayers: branch.onionLayers.map((layer, lIndex) =>
            lIndex === layerIndex
              ? {
                  ...layer,
                  wedgeLayers: layer.wedgeLayers.filter(
                    (_, wIndex) => wIndex !== wedgeIndex
                  ),
                }
              : layer
          ),
        };
      });

      // Check if the removal actually happened by comparing the data
      const wasRemoved = newData !== prevData;
      if (wasRemoved && onSuccess) {
        // Execute callback after state update
        setTimeout(() => onSuccess(), 0);
      }

      return newData;
    });
  };

  const handleLabelChange = (branchIndex, layerIndex, wedgeIndex, value) => {
    setData((prevData) =>
      prevData.map((branch, index) =>
        index === branchIndex
          ? {
              ...branch,
              onionLayers: branch.onionLayers.map((layer, lIndex) =>
                lIndex === layerIndex
                  ? {
                      ...layer,
                      wedgeLayers: layer.wedgeLayers.map((wedge, wIndex) =>
                        wIndex === wedgeIndex
                          ? {
                              ...wedge,
                              label: value,
                            }
                          : wedge
                      ),
                    }
                  : layer
              ),
            }
          : branch
      )
    );
  };

  const handleWedgeFontChange = (branchIndex, layerIndex, wedgeIndex, property, value) => {
    setData((prevData) =>
      prevData.map((branch, index) =>
        index === branchIndex
          ? {
              ...branch,
              onionLayers: branch.onionLayers.map((layer, lIndex) =>
                lIndex === layerIndex
                  ? {
                      ...layer,
                      wedgeLayers: layer.wedgeLayers.map((wedge, wIndex) =>
                        wIndex === wedgeIndex
                          ? {
                              ...wedge,
                              [property]: value,
                            }
                          : wedge
                      ),
                    }
                  : layer
              ),
            }
          : branch
      )
    );
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Convert settings to worksheet
    const settingsWS = XLSX.utils.json_to_sheet([settings]);
    XLSX.utils.book_append_sheet(wb, settingsWS, "Settings");

    // Prepare branches data for Excel with single labels
    const branchesData = data.flatMap((branch, branchIndex) =>
      branch.onionLayers.flatMap((layer, layerIndex) =>
        layer.wedgeLayers.map((wedge, wedgeIndex) => ({
          BranchName: branch.name,
          BranchColor: branch.color,
          BranchFlipText: branch.flipText || false,
          BannerFontSize: branch.bannerFontSize || "",
          BannerFontColor: branch.bannerFontColor || "",
          BannerFontWeight: branch.bannerFontWeight || "",
          BannerFontStyle: branch.bannerFontStyle || "",
          OnionLayerIndex: layerIndex,
          WedgeLayerIndex: wedgeIndex,
          Label: wedge.label || "Label",
          FontSize: wedge.fontSize || "",
          FontColor: wedge.fontColor || "",
          FontWeight: wedge.fontWeight || "",
          FontStyle: wedge.fontStyle || "",
        }))
      )
    );

    const branchesWS = XLSX.utils.json_to_sheet(branchesData);
    XLSX.utils.book_append_sheet(wb, branchesWS, "Branches");

    XLSX.writeFile(wb, "chart-data.xlsx");
  };

  const calculateLayerColor = (baseColor, layerIndex, totalLayers) => {
    const opacity = (layerIndex + 1) / totalLayers;
    const rgb = hexToRgb(baseColor);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
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
    handleLabelChange,
    handleWedgeFontChange,
    resetToDefaults,
    exportToExcel,
    importFromExcel,
    isLoading,
    error,
    dataVersion: dataVersion.current,
    calculateLayerColor,
  };
};

export default useChartData;
