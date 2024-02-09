import React, { useRef, useEffect } from "react";

function estimateRequiredCanvasSize(chartData, baseFontSize, minArcAngle) {
  let maxTextWidth = 0;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `${baseFontSize}px Arial`;

  // Logic to calculate maxTextWidth based on the longest text in chartData...

  const estimatedRadius = maxTextWidth / minArcAngle; // Arc length = radius * angle
  return Math.ceil(estimatedRadius * 2); // Diameter of the circle
}

const LayeredPolarChart = () => {
  const baseFontSize = 10;
  const minArcAngle = 0.05; // Minimum angle (in radians) required per character
  const estimatedCanvasSize = estimateRequiredCanvasSize(
    chartData,
    baseFontSize,
    minArcAngle,
  );

  const originalCanvasWidth = 1920;
  const originalCanvasHeight = 1920;
  const newCanvasWidth = Math.max(originalCanvasWidth, estimatedCanvasSize);
  const newCanvasHeight = Math.max(originalCanvasHeight, estimatedCanvasSize);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const centerX = newCanvasWidth / 2;
      const centerY = newCanvasHeight / 2;
      const maxRadius = (Math.min(newCanvasWidth, newCanvasHeight) / 2) * 0.9; // Adjust as needed

      // Clear the canvas and draw the chart using the chartData
      ctx.clearRect(0, 0, newCanvasWidth, newCanvasHeight); // Use newCanvasWidth and newCanvasHeight
      drawChart(ctx, centerX, centerY, maxRadius, chartData); // Assume drawChart is defined elsewhere
    }
  }, [newCanvasWidth, newCanvasHeight]); // Add any other dependencies if needed

  // You must return the canvas element for it to render
  return (
    <canvas ref={canvasRef} width={newCanvasWidth} height={newCanvasHeight} />
  );
};

const chartData = [
  {
    name: "Sustainability",
    color: "#007940",
    onionLayers: [
      {
        wedgeLayers: [
          { color: "#00AD5C" },
          { color: "#00AD5C" },
          { color: "#00AD5C" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#00AD5C" },
          { color: "#00AD5C" },
          { color: "#00AD5C" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#00AD5C" },
          { color: "#00AD5C" },
          { color: "#00AD5C" },
        ],
      },
      {
        wedgeLayers: [{ color: "#007940" }],
      },
    ],
  },
  {
    name: "Health Tech",
    color: "#BF2C42",
    onionLayers: [
      {
        wedgeLayers: [
          { color: "#E87D8D" },
          { color: "#E87D8D" },
          { color: "#E87D8D" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#E87D8D" },
          { color: "#E87D8D" },
          { color: "#E87D8D" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#E87D8D" },
          { color: "#E87D8D" },
          { color: "#E87D8D" },
        ],
      },
      {
        wedgeLayers: [{ color: "#BF2C42", labels: ["Initiative B1"] }],
      },
    ],
  },
  {
    name: "Digital Tech",
    color: "#004288",
    onionLayers: [
      {
        wedgeLayers: [
          {
            color: "#248EFF",
            labels: [
              "Initiative A1ahfkjsdhfkjashdfkjha",
              "Initiative A2",
              "Initiative A3",
              "Initiative A1",
              "Initiative A2",
              "Initiative A3",
            ],
          },
          { color: "#66B0FF", labels: ["Initiative B1"] },
        ],
      },
      {
        wedgeLayers: [
          { color: "#248EFF" },
          { color: "#248EFF" },
          { color: "#248EFF" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#248EFF" },
          { color: "#248EFF" },
          { color: "#248EFF" },
        ],
      },
      {
        wedgeLayers: [{ color: "#004288", labels: ["Initiative B1"] }],
      },
    ],
  },
  {
    name: "Entrepreneurship",
    color: "#FFD730",
    onionLayers: [
      {
        wedgeLayers: [
          { color: "#FFE066" },
          { color: "#FFE066" },
          { color: "#FFE066" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#FFE066" },
          { color: "#FFE066" },
          { color: "#FFE066" },
        ],
      },
      {
        wedgeLayers: [
          { color: "#FFE066" },
          { color: "#FFE066" },
          { color: "#FFE066" },
        ],
      },
      {
        wedgeLayers: [{ color: "#FFD730" }],
      },
    ],
  },
];

function drawChart(ctx, centerX, centerY, maxRadius, chartData) {
  // Now chartData is passed as a parameter
  const innerCircleRadius = 75; // Set the radius for the inner circle
  const bannerWidth = 40; // Set the width for the banners

  // Clear the canvas
  ctx.clearRect(0, 0, centerX * 2, centerY * 2);

  // Draw the inner circle with label
  drawInnerCircleWithLabel(ctx, centerX, centerY, innerCircleRadius, "ICDK");

  // Draw community banners
  drawCommunityBanners(
    ctx,
    centerX,
    centerY,
    innerCircleRadius,
    bannerWidth,
    chartData,
  );

  // Draw text labels on banners
  drawTextLabels(
    ctx,
    centerX,
    centerY,
    innerCircleRadius,
    bannerWidth,
    chartData,
  );

  // Draw the main sections of the chart
  drawCommunitySections(
    ctx,
    centerX,
    centerY,
    maxRadius,
    chartData,
    innerCircleRadius,
    bannerWidth,
  );

  // Draw white lines within the community sections
  drawHorizontalWhiteLines(
    ctx,
    centerX,
    centerY,
    maxRadius,
    chartData,
    innerCircleRadius,
    bannerWidth,
  );
}

function drawInnerCircleWithLabel(ctx, centerX, centerY, radius, label) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#FF546D";
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = "42px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, centerX, centerY);
}

function drawCommunityBanners(
  ctx,
  centerX,
  centerY,
  innerRadius,
  bannerWidth,
  communities,
) {
  const anglePerCommunity = (2 * Math.PI) / communities.length;

  communities.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;
    const outerRadius = innerRadius + bannerWidth;

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle, false);
    ctx.arc(centerX, centerY, outerRadius, endAngle, startAngle, true);
    ctx.fillStyle = community.color;
    ctx.fill();
  });
}

function drawTextLabels(
  ctx,
  centerX,
  centerY,
  innerRadius,
  bannerWidth,
  communities,
) {
  const labelRadius = innerRadius + bannerWidth / 2; // Position label in the middle of the banner
  const anglePerCommunity = (2 * Math.PI) / communities.length;

  communities.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;

    // Begin drawing curved text for each community
    ctx.save(); // Save the current state before modifications
    ctx.fillStyle = "black"; // Text color
    ctx.font = "16px Arial"; // Change as needed
    ctx.textBaseline = "middle"; // Align text vertically center

    const arcLength = endAngle - startAngle;
    let textAngle = startAngle;

    // The total width of the text will be adjusted along the arc, so we measure each character
    const characters = community.name.split("");
    const totalWidth = characters.reduce(
      (total, char) => total + ctx.measureText(char).width,
      0,
    );

    // Adjust starting angle to center text
    textAngle += (arcLength - totalWidth / labelRadius) / 2;

    characters.forEach(function (char) {
      const charWidth = ctx.measureText(char).width / 2; // Half the character width
      textAngle += charWidth / labelRadius; // Move half the character width along the arc

      // Convert polar coordinates (angle, radius) to Cartesian coordinates (x, y)
      const x = centerX + Math.cos(textAngle) * labelRadius;
      const y = centerY + Math.sin(textAngle) * labelRadius;

      // Rotate canvas and draw character
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(textAngle + Math.PI / 2); // Adjust rotation to keep text upright
      ctx.fillText(char, 0, 0);
      ctx.restore();

      // Move the angle to the end of the character
      textAngle += charWidth / labelRadius;
    });

    ctx.restore(); // Restore the state after drawing each community's label
  });
}

function drawWedgeLabels(
  ctx,
  labels,
  centerX,
  centerY,
  startAngle,
  endAngle,
  innerRadius,
  outerRadius,
) {
  // Constants for adjustments
  const fontSize = 14; // Set the font size
  const lineHeight = fontSize * 1.2; // Line height for multi-line text
  const padding = 5; // Padding from the inner radius

  // Loop through each label in the wedge
  labels.forEach((label, labelIndex) => {
    // Split the label into words and prepare to chunk them into lines
    const words = label.split(" ");
    const lines = [];
    let currentLine = words[0];

    // Set font for measurement
    ctx.font = `${fontSize}px Arial`;

    words.slice(1).forEach((word) => {
      const testLine = currentLine + " " + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > outerRadius - innerRadius) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine); // Push the last line

    // Calculate the height of the text block
    const textBlockHeight = lines.length * lineHeight;
    let currentRadius = innerRadius + padding + labelIndex * textBlockHeight;

    // Draw each line of text
    lines.forEach((line, i) => {
      // Calculate the angle to draw the text
      const angle = startAngle + (endAngle - startAngle) / 2;
      // Calculate the text's position
      const x = centerX + (currentRadius + i * lineHeight) * Math.cos(angle);
      const y = centerY + (currentRadius + i * lineHeight) * Math.sin(angle);

      // Save context and move to the text's position
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle - Math.PI / 2); // Rotate context

      // Check text direction and reverse if necessary
      if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
        ctx.rotate(Math.PI); // Rotate text 180 degrees
        ctx.textAlign = "center";
        ctx.fillText(line, 0, 0); // Draw text reversed
      } else {
        ctx.textAlign = "center";
        ctx.fillText(line, 0, 0); // Draw text normally
      }

      // Restore context
      ctx.restore();
    });

    // Update the current radius for the next label
    currentRadius += textBlockHeight + padding;
  });
}

//WEDGE BELOW
function drawCommunitySections(
  ctx,
  centerX,
  centerY,
  maxRadius,
  chartData,
  innerCircleRadius,
  bannerWidth,
) {
  const totalCommunities = chartData.length;
  const anglePerCommunity = (2 * Math.PI) / totalCommunities;

  chartData.forEach((community, communityIndex) => {
    const communityAngleStart = communityIndex * anglePerCommunity;
    const communityAngleEnd = communityAngleStart + anglePerCommunity;

    // Calculate the total radius available for vertical layers
    const verticalLayerTotalRadius =
      maxRadius - innerCircleRadius - bannerWidth;

    // Iterate over each vertical layer (onionLayer)
    community.onionLayers.forEach((verticalLayer, verticalLayerIndex) => {
      const verticalLayerStartRadius =
        innerCircleRadius +
        bannerWidth +
        (verticalLayerTotalRadius * verticalLayerIndex) /
          community.onionLayers.length;
      const verticalLayerEndRadius =
        innerCircleRadius +
        bannerWidth +
        (verticalLayerTotalRadius * (verticalLayerIndex + 1)) /
          community.onionLayers.length;

      // Now, iterate over each wedge within the vertical layer
      const anglePerWedge =
        (communityAngleEnd - communityAngleStart) /
        verticalLayer.wedgeLayers.length;

      verticalLayer.wedgeLayers.forEach((wedgeLayer, wedgeLayerIndex) => {
        const wedgeStartAngle =
          communityAngleStart + anglePerWedge * wedgeLayerIndex;
        const wedgeEndAngle = wedgeStartAngle + anglePerWedge;

        // Draw the wedge
        ctx.beginPath();
        ctx.arc(
          centerX,
          centerY,
          verticalLayerEndRadius,
          wedgeStartAngle,
          wedgeEndAngle,
          false,
        );
        ctx.arc(
          centerX,
          centerY,
          verticalLayerStartRadius,
          wedgeEndAngle,
          wedgeStartAngle,
          true,
        );
        ctx.closePath();
        ctx.fillStyle = wedgeLayer.color;
        ctx.fill();

        // Draw white stroke between wedges
        if (wedgeLayerIndex > 0) {
          // Skip the first wedge to avoid double drawing
          ctx.beginPath();
          ctx.moveTo(
            centerX + verticalLayerStartRadius * Math.cos(wedgeStartAngle),
            centerY + verticalLayerStartRadius * Math.sin(wedgeStartAngle),
          );
          ctx.lineTo(
            centerX + verticalLayerEndRadius * Math.cos(wedgeStartAngle),
            centerY + verticalLayerEndRadius * Math.sin(wedgeStartAngle),
          );
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2; // Adjust for desired stroke width
          ctx.stroke();
        }
        // Determine the radii for the text labels
        const innerTextRadius = verticalLayerStartRadius + 10; // Add some margin
        const outerTextRadius = verticalLayerEndRadius - 10; // Subtract some margin

        // Draw the text labels inside the wedge, if they exist
        if (wedgeLayer.labels && wedgeLayer.labels.length) {
          drawWedgeLabels(
            ctx,
            wedgeLayer.labels,
            centerX,
            centerY,
            wedgeStartAngle,
            wedgeEndAngle,
            innerTextRadius,
            outerTextRadius,
          );
        }
      });
    });
  });
}

function drawCurvedText(
  ctx,
  text,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
) {
  // Calculate the arc length for the text
  const arcLength = endAngle - startAngle;

  // Initialize font size
  let fontSize = 10; // Start with a base font size, adjust as necessary
  ctx.font = `${fontSize}px Arial`;

  // Calculate the width of the entire text string at the current font size
  let textWidth = ctx.measureText(text).width;
  const maxTextWidth = radius * arcLength;

  // Reduce the font size if the text is too wide to fit
  while (textWidth > maxTextWidth && fontSize > 1) {
    fontSize -= 1; // Reduce font size by 1
    ctx.font = `${fontSize}px Arial`;
    textWidth = ctx.measureText(text).width;
  }

  // If the font size is 1 and the text still doesn't fit, it's too long
  if (fontSize === 1 && textWidth > maxTextWidth) {
    console.error("Text is too long to fit in the wedge: ", text);
    return; // Do not draw the text
  }

  // Set the final font size and color
  ctx.fillStyle = "black"; // Text color
  ctx.font = `${fontSize}px Arial`; // Text font size and family

  // Starting position for the text
  let currentAngle = startAngle + (arcLength - textWidth / radius) / 2;

  // Draw each character
  for (let i = 0; i < text.length; i++) {
    const character = text[i];
    const charWidth = ctx.measureText(character).width;
    const charAngle = charWidth / (2 * radius);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle + charAngle);
    ctx.fillText(character, radius, 0);
    ctx.restore();

    currentAngle += charWidth / radius; // Increment angle by character's width
  }
}

function drawHorizontalWhiteLines(
  ctx,
  centerX,
  centerY,
  maxRadius,
  communities,
  innerCircleRadius,
  bannerWidth,
) {
  communities.forEach((community, communityIndex) => {
    const anglePerCommunity = (2 * Math.PI) / communities.length;
    const communityStartAngle = communityIndex * anglePerCommunity;
    const communityEndAngle = communityStartAngle + anglePerCommunity;

    community.onionLayers.forEach((verticalLayer, verticalLayerIndex) => {
      const startRadius =
        (verticalLayerIndex / community.onionLayers.length) *
          (maxRadius - innerCircleRadius - bannerWidth) +
        innerCircleRadius +
        bannerWidth;
      const endRadius =
        ((verticalLayerIndex + 1) / community.onionLayers.length) *
          (maxRadius - innerCircleRadius - bannerWidth) +
        innerCircleRadius +
        bannerWidth;

      // Draw a white line at the end of each horizontal layer
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        endRadius,
        communityStartAngle,
        communityEndAngle,
      );
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2; // Set the line width to make sure it's visible
      ctx.stroke();
    });
  });
}

export default LayeredPolarChart;
