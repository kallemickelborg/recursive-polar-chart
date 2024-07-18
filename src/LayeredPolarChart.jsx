import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import WebFont from 'webfontloader';

// Load Roboto font
WebFont.load({
  google: {
    families: ['Roboto']
  }
});

const LayeredPolarChart = ({ data, size, orgLabel }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Clear the existing chart
    d3.select("#chart").html("");

    // Create the SVG
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", size)
      .attr("height", size)
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    // Call drawChart with all necessary parameters
    drawChart(svg, data, size, orgLabel);
  }, [data, size, orgLabel]);

  const exportChart = (format) => {
    const svgNode = document.querySelector("#chart svg");
    if (!svgNode) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svgNode);
      const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "layered_polar_chart.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (format === 'png') {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svgNode);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 2048, 2048);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "layered_polar_chart.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div>
      <div id="chart" ref={chartRef} />
      <div className="mt-4 flex justify-center">
        <button onClick={() => exportChart('svg')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Export as SVG
        </button>
        <button onClick={() => exportChart('png')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Export as PNG
        </button>
      </div>
    </div>
  );
};

function drawChart(svg, data, size, orgLabel) {
  const radius = size / 2;
  const innerRadius = 125;
  const bannerWidth = 75;
  const maxRadius = radius * 0.9;

  drawInnerCircle(svg, innerRadius, orgLabel);
  drawCommunityBanners(svg, data, radius, innerRadius, bannerWidth);
  drawCommunitySections(svg, data, radius, innerRadius, bannerWidth, maxRadius);
}

function drawInnerCircle(svg, innerRadius, orgLabel) {
  svg
    .append("circle")
    .attr("r", innerRadius)
    .attr("fill", "#FF546D")
    .attr("filter", "url(#shadow)");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("fill", "white")
    .style("font-size", "42px")
    .style("font-family", "Roboto")
    .text(orgLabel);
}

function drawCommunityBanners(svg, data, radius, innerRadius, bannerWidth) {
  const anglePerCommunity = (2 * Math.PI) / data.length;

  data.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;
    const outerRadius = innerRadius + bannerWidth;

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    svg.append("path").attr("d", arc).attr("fill", community.color);
  });
}

function drawCommunitySections(
  svg,
  data,
  radius,
  innerRadius,
  bannerWidth,
  maxRadius
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

        svg
          .append("path")
          .attr("d", arc)
          .attr("fill", wedgeLayer.color)
          .attr("stroke", "white")
          .attr("stroke-width", 1);

        // Draw labels for each wedge layer
        if (wedgeLayer.labels && Array.isArray(wedgeLayer.labels)) {
          wedgeLayer.labels.forEach((label, labelIndex) => {
            const arcLength =
              arc.outerRadius()() * (wedgeEndAngle - wedgeStartAngle);
            const textPathId = `arc-${communityIndex}-${layerIndex}-${wedgeLayerIndex}-${labelIndex}`;
      
            // Calculate the middle radius of the wedge layer
            const middleRadius =
              (previousLayerOuterRadius + layerOuterRadius) / 2;
      
            // Create a new arc for the text path
            const textArc = d3
              .arc()
              .innerRadius(middleRadius)
              .outerRadius(middleRadius)
              .startAngle(wedgeStartAngle)
              .endAngle(wedgeEndAngle);
      
            // Add hidden path for textPath reference
            svg
              .append("path")
              .attr("id", textPathId)
              .attr("d", textArc)
              .style("visibility", "hidden");
      
            const text = svg
              .append("text")
              .attr("dy", "0.35em")
              .append("textPath")
              .attr("xlink:href", `#${textPathId}`)
              .attr("startOffset", "25%")
              .style("text-anchor", "middle")
              .text(label);
      
            // Check if text fits within the wedge
            const textLength = text.node().getComputedTextLength();
            if (textLength > arcLength) {
              text.text("");
              const words = label.split(" ");
              let line = [];
              let lineHeight = 1.1; // em
              let y = 0;
              words.forEach((word, index) => {
                line.push(word);
                text.text(line.join(" "));
                if (text.node().getComputedTextLength() > arcLength) {
                  line.pop();
                  text.text(line.join(" "));
                  line = [word];
                  y += lineHeight;
                  const tspan = text
                    .append("tspan")
                    .attr("x", 0)
                    .attr("dy", `${y}em`)
                    .text(word);
                  if (wedgeStartAngle > Math.PI) {
                    tspan.attr("transform", "rotate(180)");
                  }
                }
              });
            }
            });
        }
      });

      previousLayerOuterRadius = layerOuterRadius;
    });
  });
}

export default LayeredPolarChart;
