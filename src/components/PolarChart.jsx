import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import WebFont from 'webfontloader';

WebFont.load({
  google: { families: ['Roboto'] }
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
  bannerFontSize
}) => {
  const chartRef = useRef(null);

  useEffect(() => {
    d3.select("#chart").html("");
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    drawChart(svg, data, size, orgLabel, fontSize, innerRadius, bannerWidth, maxRadiusRatio, innerCircleColor, orgLabelFontSize, bannerFontSize);
  }, [data, size, orgLabel, fontSize, innerRadius, bannerWidth, maxRadiusRatio, innerCircleColor, orgLabelFontSize, bannerFontSize]);

  return <div id="chart" ref={chartRef} />;
};

function drawChart(svg, data, size, orgLabel, fontSize, innerRadius, bannerWidth, maxRadiusRatio, innerCircleColor, orgLabelFontSize, bannerFontSize) {
  const radius = size / 2;
  const maxRadius = radius * maxRadiusRatio;

  drawInnerCircle(svg, innerRadius, orgLabel, innerCircleColor, orgLabelFontSize);
  drawCommunityBanners(svg, data, radius, innerRadius, bannerWidth, bannerFontSize);
  drawCommunitySections(svg, data, radius, innerRadius, bannerWidth, maxRadius, fontSize);
}

function drawInnerCircle(svg, innerRadius, orgLabel, innerCircleColor, orgLabelFontSize) {
  svg.append("circle")
    .attr("r", innerRadius)
    .attr("fill", innerCircleColor)
    .attr("filter", "url(#shadow)");

  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("fill", "white")
    .style("font-size", `${orgLabelFontSize}px`)
    .style("font-family", "Roboto")
    .text(orgLabel);
}

function drawCommunityBanners(svg, data, radius, innerRadius, bannerWidth, bannerFontSize) {
  const anglePerCommunity = (2 * Math.PI) / data.length;

  data.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;
    const middleRadius = innerRadius + bannerWidth / 2;
    const shouldFlip = community.flipText || false;

    // Draw the background arc
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + bannerWidth)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg.append("path")
      .attr("d", arc)
      .attr("fill", community.color);

    // Create a unique ID for each text path
    const textPathId = `text-path-${index}`;
    
    // Remove any existing text paths and text elements
    svg.selectAll(`#${textPathId}, text[data-path="${textPathId}"]`).remove();
    
    // Create an arc for the text path - reverse the angles if shouldFlip
    const textArc = d3.arc()
      .innerRadius(middleRadius)
      .outerRadius(middleRadius)
      .startAngle(shouldFlip ? endAngle : startAngle)
      .endAngle(shouldFlip ? startAngle : endAngle);

    // Add the invisible path that the text will follow
    svg.append("path")
      .attr("id", textPathId)
      .attr("d", textArc)
      .style("opacity", 0);
    
    // Add the text that follows the path
    const text = svg.append("text")
      .style("font-size", `${bannerFontSize}px`)
      .style("fill", "white")
      .style("font-weight", "bold")
      .attr("data-path", textPathId); // Add data attribute for easier removal

    // Add the textPath element
    const textPath = text.append("textPath")
      .attr("xlink:href", `#${textPathId}`)
      .attr("startOffset", "25%")
      .text(community.name);

    // Apply text-anchor and dominant-baseline based on flip state
    if (shouldFlip) {
      textPath
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging")
        .attr("dy", "-0.5em")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "hanging");
    } else {
      textPath
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "auto")
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "auto");
    }
  });
}

function drawCommunitySections(svg, data, radius, innerRadius, bannerWidth, maxRadius, fontSize) {
  data.forEach((community, communityIndex) => {
    const communityAngleStart = (communityIndex * (2 * Math.PI)) / data.length;
    const communityAngleEnd = communityAngleStart + (2 * Math.PI) / data.length;
    const heightAdjustment = community.heightAdjustment || 0;

    let previousLayerOuterRadius = innerRadius + bannerWidth;
    community.onionLayers.forEach((layer, layerIndex) => {
      const layerHeight = (maxRadius - previousLayerOuterRadius) / (community.onionLayers.length - layerIndex) + heightAdjustment;
      const layerOuterRadius = previousLayerOuterRadius + layerHeight;

      layer.wedgeLayers.forEach((wedgeLayer, wedgeLayerIndex) => {
        const wedgeStartAngle = communityAngleStart + ((communityAngleEnd - communityAngleStart) * wedgeLayerIndex) / layer.wedgeLayers.length;
        const wedgeEndAngle = wedgeStartAngle + (communityAngleEnd - communityAngleStart) / layer.wedgeLayers.length;

        const arc = d3.arc()
          .innerRadius(previousLayerOuterRadius)
          .outerRadius(layerOuterRadius)
          .startAngle(wedgeStartAngle)
          .endAngle(wedgeEndAngle);

        const layerColor = calculateLayerColor(community.color, layerIndex, community.onionLayers.length);

        if (community.onionLayers.length == 2) {
          console.log(layerIndex);
          const layerColors = community.onionLayers.length == 2
            ? [community.color, calculateLayerColor(community.color, 1, 2)]
            : [calculateLayerColor(community.color, layerIndex, community.onionLayers.length)];
            
          svg.append("path")
            .attr("d", arc)
            .attr("fill", community.onionLayers.length == 2 ? layerColors[layerIndex] : layerColor)
            .attr("stroke", "white")
            .attr("stroke-width", 1);
        } else {
          svg.append("path")
            .attr("d", arc)
            .attr("fill", layerColor)
            .attr("stroke", "white")
            .attr("stroke-width", 1);
        }

        if (wedgeLayer.labels && Array.isArray(wedgeLayer.labels)) {
          drawLabels(svg, wedgeLayer.labels, arc, wedgeStartAngle, wedgeEndAngle, previousLayerOuterRadius, layerOuterRadius, fontSize, communityIndex, layerIndex, wedgeLayerIndex, community);
        }
      });

      previousLayerOuterRadius = layerOuterRadius;
    });
  });
}

function drawLabels(svg, labels, arc, wedgeStartAngle, wedgeEndAngle, innerRadius, outerRadius, fontSize, communityIndex, layerIndex, wedgeLayerIndex, communityData) {
  const middleRadius = (innerRadius + outerRadius) / 2;
  const shouldFlip = communityData?.flipText || false;
  const textRadius = middleRadius * 0.95; // Slightly inside the middle radius
  
  // Create a unique ID for the text path
  const textPathId = `wedge-text-path-${communityIndex}-${layerIndex}-${wedgeLayerIndex}`;
  
  // Remove any existing text paths and text elements
  svg.selectAll(`#${textPathId}, text[data-path="${textPathId}"]`).remove();
  
  // Create an arc for the text path - reverse the angles if shouldFlip
  const textArc = d3.arc()
    .innerRadius(textRadius)
    .outerRadius(textRadius)
    .startAngle(shouldFlip ? wedgeEndAngle : wedgeStartAngle)
    .endAngle(shouldFlip ? wedgeStartAngle : wedgeEndAngle);
  
  // Add the invisible path for text to follow
  svg.append("path")
    .attr("id", textPathId)
    .attr("d", textArc)
    .style("opacity", 0);
  
  // Process each label
  labels.forEach((label, labelIndex) => {
    // Create a text element for each label
    const text = svg.append("text")
      .style("font-size", `${fontSize}px`)
      .style("font-family", "Roboto, sans-serif")
      .style("fill", "white")
      .attr("data-path", textPathId); // Add data attribute for easier removal
    
    // Add text path
    const textPath = text.append("textPath")
      .attr("xlink:href", `#${textPathId}`)
      .attr("startOffset", `${25 + (labelIndex * 10)}%`) // Stagger labels vertically
      .text(label);
    
    // Apply text styling based on flip state
    if (shouldFlip) {
      textPath
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging")
        .attr("dy", "-0.5em")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "hanging");
    } else {
      textPath
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "auto")
        .attr("dy", "0.5em")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "auto");
    }
  });
}

function wrapTextCentered(text, label, maxWidth, fontSize) {
  text.text("");
  const words = label.split(" ");
  let line = [];
  let tspan = text.append("tspan")
    .attr("x", 0)
    .attr("dy", 0)
    .style("text-anchor", "middle")
    .style("dominant-baseline", "middle");

  let lineNumber = 0;
  let currentLine = [];
  
  words.forEach((word, i) => {
    currentLine.push(word);
    tspan.text(currentLine.join(" "));
    
    if (tspan.node().getComputedTextLength() > maxWidth || i === words.length - 1) {
      if (tspan.node().getComputedTextLength() > maxWidth) {
        currentLine.pop(); // Remove the last word that made it too long
        tspan.text(currentLine.join(" "));
        
        // Start a new line with the current word
        if (currentLine.length > 0) {
          lineNumber++;
          tspan = text.append("tspan")
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
  const textHeight = (lineNumber * fontSize * 1.2);
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
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export default LayeredPolarChart;