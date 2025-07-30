import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import WebFont from "webfontloader";
import PlusButton from "./PlusButton";
import { calculatePlusButtonPositions } from "./PlusButtonPositions";

WebFont.load({
  google: { families: ["Roboto"] },
});

// Element types for interaction system
const ELEMENT_TYPES = {
  CENTER: "center",
  BRANCH: "branch",
  ONION_LAYER: "onionLayer", //RENAME ONION LAYER TO LAYER
  WEDGE: "wedge",
};

const LayeredPolarChart = ({
  data,
  size,
  orgLabel,
  fontSize,
  innerRadius,
  bannerWidth,
  maxRadiusRatio,
  innerCircleColor,
  orgLabelFontSize, //RENAME
  bannerFontSize,
  onElementHover,
  onElementClick,
  onElementLeave,
  onAddBranch,
  onAddOnionLayer, //RENAME
  onAddWedgeLayer,
  onOpenCenterSettings,
  selectedElement,
}) => {
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [plusButtonPositions, setPlusButtonPositions] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleButtons, setVisibleButtons] = useState([]);

  // Handle element interactions
  const handleElementHover = (elementType, indices) => {
    const elementData = { type: elementType, indices };
    setHoveredElement(elementData);
    onElementHover?.(elementData);
  };

  const handleElementLeave = () => {
    setHoveredElement(null);
    onElementLeave?.();
  };

  const handleElementClick = (elementType, indices) => {
    const elementData = { type: elementType, indices };
    onElementClick?.(elementData);
  };

  // Main chart rendering effect (without hover/selection state)
  useEffect(() => {
    d3.select("#chart").html("");
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    svgRef.current = svg;

    drawChart(
      svg,
      data,
      size,
      orgLabel,
      fontSize,
      innerRadius,
      bannerWidth,
      maxRadiusRatio,
      innerCircleColor,
      orgLabelFontSize,
      bannerFontSize,
      {
        onElementHover: handleElementHover,
        onElementLeave: handleElementLeave,
        onElementClick: handleElementClick,
        hoveredElement,
        selectedElement,
      }
    );

    // REFACTOR THIS FOR BETTER PLUS BUTTON PLACEMENT PROPORTIONAL TO CHART SIZE
    const radius = (size * maxRadiusRatio) / 2;
    const positions = calculatePlusButtonPositions(
      data,
      radius,
      innerRadius,
      bannerWidth,
      size
    );
    setPlusButtonPositions(positions);
  }, [
    data,
    size,
    orgLabel,
    fontSize,
    innerRadius,
    bannerWidth,
    maxRadiusRatio,
    innerCircleColor,
    orgLabelFontSize,
    bannerFontSize,
  ]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Update visual states of all elements
    updateElementStates(svgRef.current, hoveredElement, selectedElement);
  }, [hoveredElement, selectedElement]);

  const handleMouseMove = (event) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setMousePosition({ x, y });
  };

  // Calculate which buttons should be visible based on mouse proximity
  useEffect(() => {
    const proximityRadius = 100; // Show buttons within 60px of cursor

    const visible = plusButtonPositions.filter((position) => {
      const distance = Math.sqrt(
        Math.pow(position.x - mousePosition.x, 2) +
          Math.pow(position.y - mousePosition.y, 2)
      );
      return distance <= proximityRadius;
    });

    setVisibleButtons(visible);
  }, [mousePosition, plusButtonPositions]);

  const handlePlusButtonAction = (position) => {
    switch (position.action) {
      case "openCenterSettings":
        if (onOpenCenterSettings) {
          onOpenCenterSettings();
        }
        break;
      case "addBranch":
        if (onAddBranch) {
          onAddBranch(position.insertIndex);
        }
        break;
      case "addOnionLayer":
        if (onAddOnionLayer) {
          onAddOnionLayer(position.branchIndex, position.insertIndex);
        }
        break;
      case "addWedgeLayer":
        if (onAddWedgeLayer) {
          onAddWedgeLayer(
            position.branchIndex,
            position.layerIndex,
            position.insertIndex
          );
        }
        break;
    }
  };

  // Unselect chart components by clicking outside
  const handleBackgroundClick = (event) => {
    // Only unselect if the click is on the background (not on a chart element or plus button)
    if (event.target === event.currentTarget) {
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("polarchart-unselect"));
      }
    }
  };

  useEffect(() => {
    const handleUnselect = () => {
      setHoveredElement(null);
    };
    window.addEventListener("polarchart-unselect", handleUnselect);
    return () =>
      window.removeEventListener("polarchart-unselect", handleUnselect);
  }, []);

  return (
    <div
      className="polar-chart-container"
      style={{
        position: "relative",
        display: "inline-block",
        width: size,
        height: size,
      }}
      onMouseMove={handleMouseMove}
      onClick={handleBackgroundClick}
    >
      <div id="chart" ref={chartRef} />

      {/* Plus buttons overlay - proximity-based visibility */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <g className="plus-buttons-overlay" style={{ pointerEvents: "auto" }}>
          {visibleButtons.map((position, index) => (
            <g key={`plus-wrapper-${position.type}-${index}`}>
              {/* Larger invisible clickable area with tooltip */}
              <circle
                cx={position.x}
                cy={position.y}
                r={position.type === "center" ? 28 : 24}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={() => handlePlusButtonAction(position)}
              >
                <title>{position.tooltip}</title>
              </circle>

              {/* Visible plus button circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={12}
                fill="#2196F3"
                stroke="white"
                strokeWidth="2"
                style={{ cursor: "pointer" }}
                onClick={() => handlePlusButtonAction(position)}
                className={`plus-button plus-button-${position.type}`}
              >
                <title>{position.tooltip}</title>
              </circle>

              {/* Plus icon */}
              <g fill="white" style={{ pointerEvents: "none" }}>
                <rect
                  x={position.x - 6}
                  y={position.y - 1.5}
                  width={12}
                  height={3}
                  rx={1.5}
                />
                <rect
                  x={position.x - 1.5}
                  y={position.y - 6}
                  width={3}
                  height={12}
                  rx={1.5}
                />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

// Helper function to update element states without full re-render
function updateElementStates(svg, hoveredElement, selectedElement) {
  // Reset all strokes first
  svg
    .selectAll("path, circle, text")
    .style("stroke", null)
    .style("stroke-width", null);

  // Apply hover state
  if (hoveredElement) {
    const hoverSelector = getElementSelector(
      hoveredElement.type,
      hoveredElement.indices
    );
    svg
      .selectAll(hoverSelector)
      .style("stroke", "#ffffff")
      .style("stroke-width", 2);
  }

  // Apply selection state (overrides hover)
  if (selectedElement) {
    const selectedSelector = getElementSelector(
      selectedElement.type,
      selectedElement.indices
    );
    svg
      .selectAll(selectedSelector)
      .style("stroke", "#ffff00")
      .style("stroke-width", 3);
  }
}

// Helper function for hover and selection states
function getElementSelector(elementType, indices) {
  switch (elementType) {
    case ELEMENT_TYPES.CENTER:
      return `[data-element-type="center"]`;
    case ELEMENT_TYPES.BRANCH:
      return `[data-element-type="branch"][data-branch-index="${indices.branchIndex}"]`;
    case ELEMENT_TYPES.WEDGE:
      return `[data-element-type="wedge"][data-branch-index="${indices.branchIndex}"][data-layer-index="${indices.layerIndex}"][data-wedge-index="${indices.wedgeIndex}"]`;
    default:
      return "";
  }
}

function drawChart(
  svg,
  data,
  size,
  orgLabel,
  fontSize,
  innerRadius,
  bannerWidth,
  maxRadiusRatio,
  innerCircleColor,
  orgLabelFontSize,
  bannerFontSize,
  interactions
) {
  const radius = size / 2;
  const maxRadius = radius * maxRadiusRatio;

  drawInnerCircle(
    svg,
    innerRadius,
    orgLabel,
    innerCircleColor,
    orgLabelFontSize,
    interactions
  );
  drawCommunityBanners(
    svg,
    data,
    radius,
    innerRadius,
    bannerWidth,
    bannerFontSize,
    interactions
  );
  drawCommunitySections(
    svg,
    data,
    radius,
    innerRadius,
    bannerWidth,
    maxRadius,
    fontSize,
    interactions
  );
}

// Helper function to make elements interactive
function makeElementInteractive(element, elementType, indices, interactions) {
  if (!interactions) return element;

  // Add data attributes for targeting
  element.attr("data-element-type", elementType);
  if (indices.branchIndex !== undefined)
    element.attr("data-branch-index", indices.branchIndex);
  if (indices.layerIndex !== undefined)
    element.attr("data-layer-index", indices.layerIndex);
  if (indices.wedgeIndex !== undefined)
    element.attr("data-wedge-index", indices.wedgeIndex);

  return element
    .style("cursor", "pointer")
    .on("mouseenter", () => {
      interactions.onElementHover(elementType, indices);
    })
    .on("mouseleave", () => {
      interactions.onElementLeave();
    })
    .on("click", (event) => {
      event.stopPropagation();
      interactions.onElementClick(elementType, indices);
    });
}

function drawInnerCircle(
  svg,
  innerRadius,
  orgLabel,
  innerCircleColor,
  orgLabelFontSize,
  interactions
) {
  const circle = svg
    .append("circle")
    .attr("r", innerRadius)
    .attr("fill", innerCircleColor)
    .attr("filter", "url(#shadow)");

  // Center Circle Interaction
  makeElementInteractive(circle, ELEMENT_TYPES.CENTER, {}, interactions);

  const text = svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("fill", "white")
    .style("font-size", `${orgLabelFontSize}px`)
    .style("font-family", "Roboto, sans-serif")
    .text(orgLabel);
}

function drawCommunityBanners(
  svg,
  data,
  radius,
  innerRadius,
  bannerWidth,
  bannerFontSize,
  interactions
) {
  const anglePerCommunity = (2 * Math.PI) / data.length;

  data.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;
    const middleRadius = innerRadius + bannerWidth / 2;

    const bannerArc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + bannerWidth)
      .startAngle(startAngle)
      .endAngle(endAngle);

    const bannerPath = svg
      .append("path")
      .attr("d", bannerArc)
      .attr("fill", community.color)
      .attr("stroke", "white")
      .attr("stroke-width", 1);

    // Banner Interaction
    makeElementInteractive(
      bannerPath,
      ELEMENT_TYPES.BRANCH,
      { branchIndex: index },
      interactions
    );

    // --- Use a true SVG arc path for the text ---
    const midAngle = (startAngle + endAngle) / 2;
    const needsGeoFlip = midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
    const uiFlip = community.flipText || false;
    const actualBannerFlip = uiFlip ? !needsGeoFlip : needsGeoFlip;

    const textPathId = `text-path-${index}`;
    svg.selectAll(`#${textPathId}, text[data-path=\"${textPathId}\"]`).remove();

    // Calculate start and end points for the arc
    const r = middleRadius;
    const sa = actualBannerFlip ? endAngle : startAngle;
    const ea = actualBannerFlip ? startAngle : endAngle;
    const x1 = r * Math.cos(sa - Math.PI / 2);
    const y1 = r * Math.sin(sa - Math.PI / 2);
    const x2 = r * Math.cos(ea - Math.PI / 2);
    const y2 = r * Math.sin(ea - Math.PI / 2);
    const angleDiff = Math.abs(ea - sa);
    const largeArcFlag = angleDiff > Math.PI ? 1 : 0;
    const sweepFlag = actualBannerFlip ? 0 : 1;
    const pathData = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;

    svg
      .append("path")
      .attr("id", textPathId)
      .attr("d", pathData)
      .style("fill", "none")
      .style("opacity", 0);

    // Use banner-specific font settings or defaults
    const bannerFontSizeActual = community.bannerFontSize || bannerFontSize;
    const bannerFontColor = community.bannerFontColor || "white";
    const bannerFontWeight = community.bannerFontWeight || "bold";
    const bannerFontStyle = community.bannerFontStyle || "normal";

    const text = svg
      .append("text")
      .style("font-size", `${bannerFontSizeActual}px`)
      .style("font-family", "Roboto, sans-serif")
      .style("fill", bannerFontColor)
      .style("font-weight", bannerFontWeight)
      .style("font-style", bannerFontStyle)
      .attr("data-path", textPathId);

    const textPath = text
      .append("textPath")
      .attr("xlink:href", `#${textPathId}`)
      .attr("startOffset", "50%")
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle")
      .text(community.name);

    if (actualBannerFlip) {
      textPath.attr("dy", "0.35em");
    } else {
      textPath.attr("dy", "-0.35em");
    }
  });
}

function drawCommunitySections(
  svg,
  data,
  radius,
  innerRadius,
  bannerWidth,
  maxRadius,
  fontSize,
  interactions
) {
  data.forEach((community, communityIndex) => {
    const communityAngleStart = (communityIndex * (2 * Math.PI)) / data.length;
    const communityAngleEnd = communityAngleStart + (2 * Math.PI) / data.length;

    let previousLayerOuterRadius = innerRadius + bannerWidth;
    community.onionLayers.forEach((layer, layerIndex) => {
      // Skip layers with no wedges to prevent division by zero and rendering errors
      if (!layer.wedgeLayers || layer.wedgeLayers.length === 0) {
        console.warn(
          `Skipping layer ${layerIndex} in branch ${communityIndex} - no wedges found`
        );
        return;
      }

      const layerHeight =
        (maxRadius - previousLayerOuterRadius) /
          (community.onionLayers.length - layerIndex);
      const layerOuterRadius = previousLayerOuterRadius + layerHeight;

      layer.wedgeLayers.forEach((wedgeLayer, wedgeLayerIndex) => {
        const wedgeStartAngle =
          communityAngleStart +
          ((communityAngleEnd - communityAngleStart) * wedgeLayerIndex) /
            layer.wedgeLayers.length;
        const wedgeEndAngle =
          wedgeStartAngle +
          (communityAngleEnd - communityAngleStart) / layer.wedgeLayers.length;

        const arc = d3
          .arc()
          .innerRadius(previousLayerOuterRadius)
          .outerRadius(layerOuterRadius)
          .startAngle(wedgeStartAngle)
          .endAngle(wedgeEndAngle);

        const layerColor = calculateLayerColor(
          community.color,
          layerIndex,
          community.onionLayers.length
        );

        const wedgePath = svg
          .append("path")
          .attr("d", arc)
          .attr("fill", layerColor)
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        const wedgeIndices = {
          branchIndex: communityIndex,
          layerIndex: layerIndex,
          wedgeIndex: wedgeLayerIndex,
        };

        // Wedge Interaction
        makeElementInteractive(
          wedgePath,
          ELEMENT_TYPES.WEDGE,
          wedgeIndices,
          interactions
        );

        if (wedgeLayer.label) {
          drawLabels(
            svg,
            [wedgeLayer.label], // REFACTOR TO ONLY ALLOW ONE LABEL PER WEDGE
            arc,
            wedgeStartAngle,
            wedgeEndAngle,
            previousLayerOuterRadius,
            layerOuterRadius,
            fontSize,
            communityIndex,
            layerIndex,
            wedgeLayerIndex,
            community,
            data.length,
            interactions,
            wedgeLayer // Pass the wedge data
          );
        }
      });

      previousLayerOuterRadius = layerOuterRadius;
    });
  });
}

// Improved text breaking function that handles word wrapping more intelligently
function breakTextIntoLines(text, maxCharsPerLine) {
  if (!text || maxCharsPerLine < 1) return [text || ""];

  const words = text.trim().split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    // If this is the first word or adding it won't exceed the limit
    if (!currentLine || (currentLine + " " + word).length <= maxCharsPerLine) {
      currentLine = currentLine ? currentLine + " " + word : word;
    } else {
      // Current line is full, start a new line
      lines.push(currentLine);
      currentLine = word;
    }
  }

  // Add the last line if it has content
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
}

// Smart text layout calculation that considers wedge geometry
function calculateOptimalTextLayout(text, wedgeAngleSpan, textRadius, fontSize) {
  const arcLength = textRadius * wedgeAngleSpan;
  const avgCharWidth = fontSize * 0.6; // Approximate character width

  // Calculate available characters, leaving some padding
  const availableChars = Math.floor((arcLength * 0.85) / avgCharWidth);

  // For very small wedges, use a minimum character count
  const minCharsPerLine = Math.max(6, Math.floor(availableChars * 0.4));
  const maxCharsPerLine = Math.max(minCharsPerLine, availableChars);

  // Try different line lengths to find the best fit
  const words = text.trim().split(/\s+/);
  const totalChars = text.length;

  // If text is short enough to fit on one line, use it
  if (totalChars <= maxCharsPerLine) {
    return { maxCharsPerLine: totalChars, lines: [text] };
  }

  // Otherwise, find optimal line length
  let bestLayout = null;
  let bestScore = Infinity;

  // Try different character limits
  for (let chars = minCharsPerLine; chars <= maxCharsPerLine; chars += 2) {
    const lines = breakTextIntoLines(text, chars);

    // Score this layout (prefer fewer lines with more balanced lengths)
    const lineCount = lines.length;
    const lengthVariance = calculateLineVariance(lines);
    const score = lineCount * 2 + lengthVariance; // Weight line count more heavily

    if (score < bestScore) {
      bestScore = score;
      bestLayout = { maxCharsPerLine: chars, lines };
    }
  }

  return bestLayout || { maxCharsPerLine, lines: breakTextIntoLines(text, maxCharsPerLine) };
}

// Calculate variance in line lengths to prefer balanced text blocks
function calculateLineVariance(lines) {
  if (lines.length <= 1) return 0;

  const lengths = lines.map(line => line.length);
  const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;

  return variance;
}



function drawLabels(
  svg,
  labels,
  arc,
  wedgeStartAngle,
  wedgeEndAngle,
  innerRadius,
  outerRadius,
  fontSize,
  communityIndex,
  layerIndex,
  wedgeLayerIndex,
  communityData,
  totalCommunities,
  interactions,
  wedgeData
) {
  const shouldFlip = communityData?.flipText || false;

  // Use wedge-specific font settings or defaults
  const wedgeFontSize = wedgeData?.fontSize || fontSize;
  const wedgeFontColor = wedgeData?.fontColor || "white";
  const wedgeFontWeight = wedgeData?.fontWeight || "normal";
  const wedgeFontStyle = wedgeData?.fontStyle || "normal";

  // Calculate available space and text parameters
  const segmentWidth = outerRadius - innerRadius;
  const angleSpan = wedgeEndAngle - wedgeStartAngle;
  const textRadius = (innerRadius + outerRadius) / 2;

  // TEXT FLIPPING LOGIC
  const branchCenterAngle =
    ((communityIndex + 0.5) * (2 * Math.PI)) / totalCommunities;

  // Flip bottom branches
  const needsFlip =
    branchCenterAngle > Math.PI / 2 && branchCenterAngle < (3 * Math.PI) / 2;
  const actualFlip = shouldFlip ? !needsFlip : needsFlip;
  const angularPadding = angleSpan * 0.05; // 5% padding
  let arcStartAngle, arcEndAngle;

  if (actualFlip) {
    arcStartAngle = wedgeEndAngle - angularPadding;
    arcEndAngle = wedgeStartAngle + angularPadding;
  } else {
    arcStartAngle = wedgeStartAngle + angularPadding;
    arcEndAngle = wedgeEndAngle - angularPadding;
  }

  labels.forEach((label, labelIndex) => {
    if (!label || label.trim() === "") return;

    // Use smart text layout to get optimal line breaks
    const layout = calculateOptimalTextLayout(label, angleSpan, textRadius, wedgeFontSize);
    let textLines = layout.lines;

    // Necessary to fix the line break issue for wedge labels
    textLines = [...textLines].reverse();

    // Calculate line spacing based on available space
    const availableHeight = segmentWidth * 0.8; // Use 80% of radial space
    const lineSpacing = Math.min(
      availableHeight / Math.max(textLines.length, 1),
      wedgeFontSize * 1.3
    );

    // Render each line of text
    textLines.forEach((lineContent, lineIndex) => {
      // Calculate radius for this line - position lines in correct reading order
      const totalLines = textLines.length;
      const centerOffset = (totalLines - 1) / 2;

      // Simple positioning: first line (index 0) at inner radius, last line at outer radius
      const lineOffset = (lineIndex - centerOffset) * lineSpacing;
      let lineRadius = textRadius + lineOffset;

      // Ensure the line stays within the wedge bounds
      lineRadius = Math.max(
        innerRadius + segmentWidth * 0.15,
        Math.min(outerRadius - segmentWidth * 0.15, lineRadius)
      );

      // Create unique IDs for this text line
      const pathId = `text-arc-${communityIndex}-${layerIndex}-${wedgeLayerIndex}-${labelIndex}-${lineIndex}`;
      const textId = `text-${communityIndex}-${layerIndex}-${wedgeLayerIndex}-${labelIndex}-${lineIndex}`;

      // Remove any existing elements with these IDs
      svg.selectAll(`#${pathId}, #${textId}`).remove();

      // Calculate arc coordinates
      const x1 = lineRadius * Math.cos(arcStartAngle - Math.PI / 2);
      const y1 = lineRadius * Math.sin(arcStartAngle - Math.PI / 2);
      const x2 = lineRadius * Math.cos(arcEndAngle - Math.PI / 2);
      const y2 = lineRadius * Math.sin(arcEndAngle - Math.PI / 2);

      const sweepFlag = actualFlip ? 0 : 1;
      const angleDiff = Math.abs(arcEndAngle - arcStartAngle);
      const largeArcFlag = angleDiff > Math.PI ? 1 : 0;

      // Validate coordinates
      if (![x1, y1, x2, y2, lineRadius].every(isFinite)) {
        console.warn("Invalid coordinates for text path, skipping line:", lineContent);
        return;
      }

      // Create the arc path for text
      const pathData = `M ${x1} ${y1} A ${lineRadius} ${lineRadius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;

      // Add the invisible path for text to follow
      svg
        .append("path")
        .attr("id", pathId)
        .attr("d", pathData)
        .style("fill", "none")
        .style("opacity", 0);

      // Add the text element
      const text = svg
        .append("text")
        .attr("id", textId)
        .style("font-size", `${wedgeFontSize}px`)
        .style("font-family", "Roboto, sans-serif")
        .style("fill", wedgeFontColor)
        .style("font-weight", wedgeFontWeight)
        .style("font-style", wedgeFontStyle);

      // Add the text path
      const textPath = text
        .append("textPath")
        .attr("href", `#${pathId}`)
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text(lineContent);

      // Adjust vertical positioning based on flip
      if (actualFlip) {
        textPath.attr("dy", "0.35em");
      } else {
        textPath.attr("dy", "-0.15em");
      }
    });
  });
}



// CALCULATES LAYER COLOR BASED ON THE BASE COLOR AND THE LAYER INDEX
function calculateLayerColor(baseColor, layerIndex, totalLayers) {
  const rgb = hexToRgb(baseColor);
  let opacity;

  if (totalLayers === 1) {
    opacity = 0.5;
  } else {
    opacity = (layerIndex + 1) / totalLayers;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

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

export default LayeredPolarChart;



