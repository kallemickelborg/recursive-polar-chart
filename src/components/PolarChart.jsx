import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import WebFont from "webfontloader";

WebFont.load({
  google: { families: ["Roboto"] },
});

const LayeredPolarChart = ({
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
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    d3.select("#chart").html("");
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

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
      bannerFontSize
    );
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

  return <div id="chart" ref={chartRef} />;
};

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
  bannerFontSize
) {
  const radius = size / 2;
  const maxRadius = radius * maxRadiusRatio;

  drawInnerCircle(
    svg,
    innerRadius,
    orgLabel,
    innerCircleColor,
    orgLabelFontSize
  );
  drawCommunityBanners(
    svg,
    data,
    radius,
    innerRadius,
    bannerWidth,
    bannerFontSize
  );
  drawCommunitySections(
    svg,
    data,
    radius,
    innerRadius,
    bannerWidth,
    maxRadius,
    fontSize
  );
}

function drawInnerCircle(
  svg,
  innerRadius,
  orgLabel,
  innerCircleColor,
  orgLabelFontSize
) {
  svg
    .append("circle")
    .attr("r", innerRadius)
    .attr("fill", innerCircleColor)
    .attr("filter", "url(#shadow)");

  svg
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
  bannerFontSize
) {
  const anglePerCommunity = (2 * Math.PI) / data.length;

  data.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;
    const middleRadius = innerRadius + bannerWidth / 2;

    // Draw the banner arc (background)
    const bannerArc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + bannerWidth)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg
      .append("path")
      .attr("d", bannerArc)
      .attr("fill", community.color)
      .attr("stroke", "white")
      .attr("stroke-width", 1);

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

    const text = svg
      .append("text")
      .style("font-size", `${bannerFontSize}px`)
      .style("font-family", "Roboto, sans-serif")
      .style("fill", "white")
      .style("font-weight", "bold")
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
  fontSize
) {
  data.forEach((community, communityIndex) => {
    const communityAngleStart = (communityIndex * (2 * Math.PI)) / data.length;
    const communityAngleEnd = communityAngleStart + (2 * Math.PI) / data.length;
    const heightAdjustment = community.heightAdjustment || 0;

    let previousLayerOuterRadius = innerRadius + bannerWidth;
    community.onionLayers.forEach((layer, layerIndex) => {
      const layerHeight =
        (maxRadius - previousLayerOuterRadius) /
          (community.onionLayers.length - layerIndex) +
        heightAdjustment;
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

        svg
          .append("path")
          .attr("d", arc)
          .attr("fill", layerColor)
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        if (wedgeLayer.labels && Array.isArray(wedgeLayer.labels)) {
          drawLabels(
            svg,
            wedgeLayer.labels,
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
            data.length
          );
        }
      });

      previousLayerOuterRadius = layerOuterRadius;
    });
  });
}

// Helper function to break text into multiple lines based on available width
function breakTextIntoLines(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Word is longer than max chars, just add it
        lines.push(word);
      }
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
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
  totalCommunities
) {
  const shouldFlip = communityData?.flipText || false;

  // Calculate available space and text parameters
  const segmentWidth = outerRadius - innerRadius;
  const angleSpan = wedgeEndAngle - wedgeStartAngle;
  const midAngle = (wedgeStartAngle + wedgeEndAngle) / 2;

  // Determine text radius within the segment
  const textRadius = (innerRadius + outerRadius) / 2;
  const arcLength = textRadius * angleSpan;
  const avgCharWidth = fontSize * 0.6;
  let calculatedMaxChars = Math.floor((arcLength * 0.8) / avgCharWidth);
  const maxCharsPerLine = Math.max(5, calculatedMaxChars); // Ensure min 5 chars, or calculated

  // Calculate the branch (community) center angle for consistent flip decision across all wedges in the branch
  // This ensures all wedges in a branch have the same text orientation
  const branchCenterAngle =
    ((communityIndex + 0.5) * (2 * Math.PI)) / totalCommunities;

  // Determine if we need to flip the arc direction for bottom text
  // Use the branch center angle instead of individual wedge midAngle for consistency
  const needsFlip =
    branchCenterAngle > Math.PI / 2 && branchCenterAngle < (3 * Math.PI) / 2;
  const actualFlip = shouldFlip ? !needsFlip : needsFlip;

  // Calculate arc angles with padding - same for all lines
  const angularPadding = angleSpan * 0.05; // 5% padding
  let arcStartAngle, arcEndAngle;

  if (actualFlip) {
    // For flipped text, reverse the arc direction
    arcStartAngle = wedgeEndAngle - angularPadding;
    arcEndAngle = wedgeStartAngle + angularPadding;
  } else {
    // Normal direction
    arcStartAngle = wedgeStartAngle + angularPadding;
    arcEndAngle = wedgeEndAngle - angularPadding;
  }

  // Process each label
  labels.forEach((label, labelIndex) => {
    // Break label into multiple lines if needed
    const semanticTextLines =
      maxCharsPerLine > 4 && label.length > maxCharsPerLine
        ? breakTextIntoLines(label, maxCharsPerLine)
        : [label];

    // Calculate vertical spacing for multiple lines
    const lineSpacing = Math.min(
      segmentWidth / Math.max(semanticTextLines.length, 2),
      fontSize * 1.2
    );

    semanticTextLines.forEach((lineContent, semanticLineIndex) => {
      // Base offset factor: - (length-1)/2 for line 0, up to + (length-1)/2 for last line
      let radiusOffsetFactor =
        semanticLineIndex - (semanticTextLines.length - 1) / 2;

      // If actualFlip is true, the visual order of lines along the reversed path is inverted
      // relative to their radial stacking. To make semantic line 0 appear visually first (topmost)
      // when the path is reversed, it needs the largest radial distance (most positive offset factor).
      if (actualFlip) {
        radiusOffsetFactor = -radiusOffsetFactor;
      }

      const radiusOffset = radiusOffsetFactor * (lineSpacing * 0.8);

      let lineRadius = Math.max(
        innerRadius + segmentWidth * 0.1, // Min bound (slightly reduced padding for more space)
        Math.min(outerRadius - segmentWidth * 0.1, textRadius + radiusOffset) // Max bound
      );

      if (!isFinite(lineRadius)) {
        console.error("Invalid lineRadius:", lineRadius, "Using fallback.", {
          innerRadius,
          segmentWidth,
          textRadius,
          radiusOffset,
        });
        lineRadius = textRadius; // Fallback
      }

      // Create unique IDs using semanticLineIndex to keep them stable
      const pathId = `text-arc-${communityIndex}-${layerIndex}-${wedgeLayerIndex}-${labelIndex}-${semanticLineIndex}`;
      const textId = `text-${communityIndex}-${layerIndex}-${wedgeLayerIndex}-${labelIndex}-${semanticLineIndex}`;

      svg.selectAll(`#${pathId}, #${textId}`).remove();

      // Path data string
      let x1 = lineRadius * Math.cos(arcStartAngle - Math.PI / 2);
      let y1 = lineRadius * Math.sin(arcStartAngle - Math.PI / 2);
      let x2 = lineRadius * Math.cos(arcEndAngle - Math.PI / 2);
      let y2 = lineRadius * Math.sin(arcEndAngle - Math.PI / 2);

      const sweepFlag = actualFlip ? 0 : 1;
      const angleDiff = Math.abs(arcEndAngle - arcStartAngle);
      let largeArcFlag = angleDiff > Math.PI ? 1 : 0;

      // Prevent zero-length arcs for textPath if angles are identical (can happen with extreme padding)
      if (Math.abs(arcStartAngle - arcEndAngle) < 0.001) {
        // console.warn("Near zero-length arc for text, adjusting slightly:", pathId);
        if (actualFlip) {
          // Reversed path, end angle was original start
          arcEndAngle -= 0.001;
        } else {
          arcEndAngle += 0.001;
        }
        // Recalculate x2, y2
        x2 = lineRadius * Math.cos(arcEndAngle - Math.PI / 2);
        y2 = lineRadius * Math.sin(arcEndAngle - Math.PI / 2);
      }

      if (![x1, y1, x2, y2, lineRadius].every(isFinite)) {
        console.error("Invalid coordinates for pathData:", {
          x1,
          y1,
          x2,
          y2,
          lineRadius,
          pathId,
        });
        return; // Skip rendering this line if coordinates are bad
      }

      const pathData = `M ${x1} ${y1} A ${lineRadius} ${lineRadius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`;

      svg
        .append("path")
        .attr("id", pathId)
        .attr("d", pathData)
        .style("fill", "none")
        .style("opacity", 0);

      const text = svg
        .append("text")
        .attr("id", textId)
        .style("font-size", `${fontSize}px`)
        .style("font-family", "Roboto, sans-serif")
        .style("fill", "white");

      const textPath = text
        .append("textPath")
        .attr("href", `#${pathId}`)
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle") // Consistent baseline
        .text(lineContent);

      // dy adjustments based on path direction
      if (actualFlip) {
        // Path is reversed (counter-clockwise), text on "bottom"
        textPath.attr("dy", "0.35em");
      } else {
        // Path is normal (clockwise), text on "top"
        textPath.attr("dy", "-0.15em");
      }
    });
  });
}

function wrapTextCentered(text, label, maxWidth, fontSize) {
  text.text("");
  const words = label.split(" ");
  let line = [];
  let tspan = text
    .append("tspan")
    .attr("x", 0)
    .attr("dy", 0)
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle");

  let lineNumber = 0;
  let currentLine = [];

  words.forEach((word, i) => {
    currentLine.push(word);
    tspan.text(currentLine.join(" "));

    if (
      tspan.node().getComputedTextLength() > maxWidth ||
      i === words.length - 1
    ) {
      if (tspan.node().getComputedTextLength() > maxWidth) {
        currentLine.pop(); // Remove the last word that made it too long
        tspan.text(currentLine.join(" "));

        // Start a new line with the current word
        if (currentLine.length > 0) {
          lineNumber++;
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("dy", `${fontSize * 1.2}px`)
            .style("text-anchor", "middle")
            .style("dominant-baseline", "hanging")
            .text(word);
          currentLine = [word];
        }
      }
    }
  });

  // Center the text vertically
  const textHeight = lineNumber * fontSize * 1.2;
  text.attr("transform", `translate(0, ${-textHeight / 2}px)`);
}

// Keep the old wrapText function for backward compatibility
function wrapText(text, label, maxWidth) {
  wrapTextCentered(text, label, maxWidth, 12); // Default font size of 12 if not specified
}

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
