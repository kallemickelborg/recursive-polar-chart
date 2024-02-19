import React, { useRef, useEffect } from "react";

function estimateRequiredCanvasSize(chartData, baseFontSize, minArcAngle) {
  let maxTextWidth = 0;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `${baseFontSize}px Arial`;
  // Your logic to calculate maxTextWidth based on the longest text in chartData
  const estimatedRadius = maxTextWidth / minArcAngle; // Arc length = radius * angle
  return Math.ceil(estimatedRadius * 2); // Diameter of the circle
}

const LayeredPolarChart = ({ data, size }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = size; // Set canvas width
      canvas.height = size; // Set canvas height
      console.log(`Setting canvas dimensions to: ${size}x${size}`);
      const ctx = canvas.getContext("2d");
      const centerX = size / 2;
      const centerY = size / 2;
      const maxRadius = (Math.min(size, size) / 2) * 0.98;

      // Clear the canvas before redrawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Call the drawing function
      drawChart(ctx, centerX, centerY, maxRadius, data);
    }
  }, [data, size]); // Include 'data' in the dependencies

  return (
    <canvas ref={canvasRef} width={size} height={size} />
  );
};

//ALL GRAPHICAL FUNCTIONS BELOW
function drawChart(ctx, centerX, centerY, maxRadius, chartData) {
  
  // Save the current context state (so we can restore it later)
  ctx.save();

  // Clear the entire canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Move the rotation point to the center of the canvas
  ctx.translate(centerX, centerY);

  // Rotate the canvas 45 degrees clockwise
  ctx.rotate(((360 / chartData.length) * (Math.PI / chartData.length)));

  // Move the rotation point back to the top left corner of the canvas
  ctx.translate(-centerX, -centerY);

  // Draw the main sections of the chart which will be rotated
  drawCommunityBanners(
    ctx,
    centerX,
    centerY,
    125, // innerCircleRadius
    75, // bannerWidth
    chartData,
  );
  drawTextLabels(
    ctx,
    centerX,
    centerY,
    125, // innerCircleRadius
    75, // bannerWidth
    chartData,
  );
  drawCommunitySections(
    ctx,
    centerX,
    centerY,
    maxRadius,
    chartData,
    125, // innerCircleRadius
    75, // bannerWidth
  );

  // Restore the context to its original state before drawing the inner circle
  ctx.restore();

  // Draw the unrotated inner circle with label
  drawInnerCircleWithLabel(ctx, centerX, centerY, 126, "ORG"); // The inner circle radius is assumed to be 125
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
    ctx.fillStyle = "white"; // Text color
    ctx.font = "24px Arial"; // Change as needed
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
  flipText,
) {
  const baseLineHeight = 16; // Base line height which can be adjusted
  const padding = 5; // Base padding from the edge of the wedge
  let currentRadius = innerRadius + padding; // Start at the inner radius plus padding

  ctx.fillStyle = "black"; // Ensure text color is set to black
  ctx.textAlign = "center"; // Center align text
  ctx.textBaseline = "middle"; // Align text in the middle vertically

  labels.forEach((label) => {
    let words = label.split(" ");
    let lines = [];
    let currentLine = words[0];

    let arcLength =
      ((innerRadius + outerRadius) / 2) * (endAngle - startAngle) * 1 -
      2 * padding;

    words.slice(1).forEach((word) => {
      let testLine = currentLine + " " + word;
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;

      if (testWidth > arcLength) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    lines.push(currentLine);

    if (flipText) {
      lines = lines.reverse();
    }

    lines.forEach((line) => {
      const lineRadius = currentRadius + baseLineHeight / 2; // Center the text vertically in the line
      drawCurvedWedgeLabel(
        ctx,
        line,
        centerX,
        centerY,
        lineRadius,
        startAngle,
        endAngle,
      );

      // Increment the radius for the next line to be drawn
      currentRadius += baseLineHeight;
    });

    // Add extra padding after each label
    currentRadius += padding;
  });
}

function drawCurvedWedgeLabel(
  ctx,
  text,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
) {
  const textLength = text.length;
  const rangeAngle = endAngle - startAngle;

  let fontSize = 14; // Start with the maximum font size
  ctx.font = `${fontSize}px Arial`; // Set the initial font

  // Ensure the text is centered along the arc
  let totalTextWidth = 0;
  for (let i = 0; i < textLength; i++) {
    totalTextWidth += ctx.measureText(text[i]).width;
  }
  const totalTextAngle = totalTextWidth / radius;
  let currentAngle = startAngle + (rangeAngle - totalTextAngle) / 2;

  // Draw each character
  for (let i = 0; i < textLength; i++) {
    const character = text[i];
    const charWidth = ctx.measureText(character).width;
    const charAngle = charWidth / radius;

    // Calculate the character's position
    const x = centerX + radius * Math.cos(currentAngle + charAngle / 2);
    const y = centerY + radius * Math.sin(currentAngle + charAngle / 2);

    // Rotate the canvas to draw the character upright
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(currentAngle + charAngle / 2 + Math.PI / 2);
    ctx.fillText(character, 0, 0);
    ctx.restore();

    currentAngle += charAngle; // Increment the angle by the character's width
  }
}

function drawCommunitySections(
  ctx,
  centerX,
  centerY,
  maxRadius,
  data,
  innerCircleRadius,
  bannerWidth,
) {
  const totalCommunities = data.length;
  const anglePerCommunity = (2 * Math.PI) / totalCommunities;

  data.forEach((community, communityIndex) => {
    const communityAngleStart = communityIndex * anglePerCommunity;
    const communityAngleEnd = communityAngleStart + anglePerCommunity;
    const heightAdjustment = community.heightAdjustment || 0;

    let previousLayerOuterRadius = innerCircleRadius + bannerWidth;

    community.onionLayers.forEach((layer, layerIndex) => {
      const layerHeight =
        (maxRadius - previousLayerOuterRadius) /
        (community.onionLayers.length - layerIndex) +
        heightAdjustment;
      const layerOuterRadius = previousLayerOuterRadius + layerHeight;

      layer.wedgeLayers.forEach((wedgeLayer, wedgeLayerIndex) => {
        const wedgeStartAngle =
          communityAngleStart +
          (anglePerCommunity * wedgeLayerIndex) / layer.wedgeLayers.length;
        const wedgeEndAngle =
          wedgeStartAngle + anglePerCommunity / layer.wedgeLayers.length;

        // Draw the wedge
        ctx.beginPath();
        ctx.arc(centerX, centerY, layerOuterRadius, wedgeStartAngle, wedgeEndAngle, false);
        ctx.arc(centerX, centerY, previousLayerOuterRadius, wedgeEndAngle, wedgeStartAngle, true);
        ctx.closePath();
        ctx.fillStyle = wedgeLayer.color;
        ctx.fill();

        // Draw labels inside the wedge
        if (wedgeLayer.labels && wedgeLayer.labels.length > 0) {
          // Debug: Log the labels being passed to drawWedgeLabels
          console.log('Labels for wedge', wedgeLayerIndex, ':', wedgeLayer.labels);

          drawWedgeLabels(
            ctx,
            wedgeLayer.labels,
            centerX,
            centerY,
            wedgeStartAngle,
            wedgeEndAngle,
            previousLayerOuterRadius + 10, // innerTextRadius with some margin
            layerOuterRadius - 10, // outerTextRadius with some margin subtracted
            community.flipText,
          );
        }
      });

      // Prepare for next layer
      previousLayerOuterRadius = layerOuterRadius;
    });

    // Draw the last vertical line for each community
    ctx.beginPath();
    ctx.moveTo(
      centerX + maxRadius * Math.cos(communityAngleEnd),
      centerY + maxRadius * Math.sin(communityAngleEnd),
    );
    ctx.lineTo(
      centerX + innerCircleRadius * Math.cos(communityAngleEnd),
      centerY + innerCircleRadius * Math.sin(communityAngleEnd),
    );
    ctx.stroke();
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

export default LayeredPolarChart;
