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
    const outerRadius = innerRadius + bannerWidth;

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg.append("path").attr("d", arc).attr("fill", community.color);

    const textPathId = `community-banner-${index}`;
    const middleRadius = innerRadius + bannerWidth / 2;

    const textArc = d3.arc()
      .innerRadius(middleRadius)
      .outerRadius(middleRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg.append("path")
      .attr("id", textPathId)
      .attr("d", textArc)
      .style("visibility", "hidden");

    const text = svg.append("text")
      .append("textPath")
      .attr("xlink:href", `#${textPathId}`)
      .attr("startOffset", "25%")
      .style("text-anchor", "middle")
      .style("font-size", `${bannerFontSize}px`)
      .style("fill", "white")
      .text(community.name);

    if (community.flipText) {
      text.attr("transform", `translate(0, ${bannerWidth}) rotate(180)`);
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

        svg.append("path")
          .attr("d", arc)
          .attr("fill", layerColor)
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        if (wedgeLayer.labels && Array.isArray(wedgeLayer.labels)) {
          drawLabels(svg, wedgeLayer.labels, arc, wedgeStartAngle, wedgeEndAngle, previousLayerOuterRadius, layerOuterRadius, fontSize, communityIndex, layerIndex, wedgeLayerIndex);
        }
      });

      previousLayerOuterRadius = layerOuterRadius;
    });
  });
}

function drawLabels(svg, labels, arc, wedgeStartAngle, wedgeEndAngle, innerRadius, outerRadius, fontSize, communityIndex, layerIndex, wedgeLayerIndex) {
  const arcLength = arc.outerRadius()() * (wedgeEndAngle - wedgeStartAngle);
  const middleRadius = (innerRadius + outerRadius) / 2;

  labels.forEach((label, labelIndex) => {
    const textPathId = `arc-${communityIndex}-${layerIndex}-${wedgeLayerIndex}-${labelIndex}`;
    
    const textArc = d3.arc()
      .innerRadius(middleRadius)
      .outerRadius(middleRadius)
      .startAngle(wedgeStartAngle)
      .endAngle(wedgeEndAngle);

    svg.append("path")
      .attr("id", textPathId)
      .attr("d", textArc)
      .style("visibility", "hidden");

    const text = svg.append("text")
      .attr("dy", `${labelIndex * 1.2}em`)
      .append("textPath")
      .attr("xlink:href", `#${textPathId}`)
      .attr("startOffset", "25%")
      .style("text-anchor", "middle")
      .style("font-size", `${fontSize}px`)
      .text(label);

    if (text.node().getComputedTextLength() > arcLength) {
      wrapText(text, label, arcLength);
    }
  });
}

function wrapText(text, label, maxWidth) {
  text.text("");
  const words = label.split(" ");
  let line = [];
  let tspan = text.text("");

  words.forEach((word) => {
    line.push(word);
    tspan.text(line.join(" "));
    if (tspan.node().getComputedTextLength() > maxWidth) {
      line.pop();
      tspan.text(line.join(" "));
      line = [word];
      tspan = text.append("tspan")
        .attr("dy", "1.2em")
        .attr("startOffset", "25%")
        .text(word);
    }
  });
  
  const textLines = text.selectAll("tspan");
  const textHeight = textLines.size() * 1.2;
  const textCenterY = (textHeight / 2) - 0.6;
  textLines.attr("dy", (_, i) => `${i * 1.2 - textCenterY}em`);
}

function calculateLayerColor(baseColor, layerIndex, totalLayers) {
  const opacity = (layerIndex + 1) / totalLayers;
  const rgb = hexToRgb(baseColor);
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