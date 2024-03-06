import React, { useRef, useState, useEffect } from "react";

const LayeredPolarChart = ({ data, size, orgLabel }) => {
  // Ref for the canvas
  const canvasRef = useRef(null);

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      const centerX = size / 2;
      const centerY = size / 2;
      const maxRadius = (size / 2) * 0.9;

      // Now proceed with drawing since the font is available
      drawChart(ctx, centerX, centerY, maxRadius, data, orgLabel, size);
    }
  }, [data, size, orgLabel]); // Re-draw when data, size, or orgLabel changes

  return <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{
        width: '60%',
        height: '60%',
        maxWidth: `${size}px`,
        maxHeight: `${size}px`
      }}
    />;
};

//All rendered functions are stored within the drawChart function
function drawChart(
  ctx,
  centerX,
  centerY,
  maxRadius,
  chartData,
  orgLabel,
  size,
) {

  
  // Save the current context state (so we can restore it later)
  ctx.save();

  // Clear the entire canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Move the rotation point to the center of the canvas
  ctx.translate(centerX, centerY);

  // Rotate the canvas 45 degrees clockwise
  ctx.rotate((360 / chartData.length) * (Math.PI / chartData.length));

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
  drawTextLabels(ctx, centerX, centerY, 125, 75, chartData, size); // Example of passing 'size' to drawTextLabels
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
  drawInnerCircleWithLabel(ctx, centerX, centerY, 126, orgLabel);
}

//All the separate graphical elements (Communities/branches, onion-layers, and wedges) are stated below
function drawInnerCircleWithLabel(ctx, centerX, centerY, radius, label) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.shadowBlur = "15";
  ctx.shadowColor = "rgb(0,0,0,0.25)";
  ctx.fillStyle = "#FF546D";
  ctx.fill();
  ctx.shadowBlur = "0";

  ctx.fillStyle = "white";
  ctx.font = "42px Roboto";
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
  ctx.strokeStyle = "white"; // Set the line color to white
  ctx.lineWidth = 3; // Set the desired line width for community lines

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
        ctx.arc(
          centerX,
          centerY,
          layerOuterRadius,
          wedgeStartAngle,
          wedgeEndAngle,
          false,
        );
        ctx.arc(
          centerX,
          centerY,
          previousLayerOuterRadius,
          wedgeEndAngle,
          wedgeStartAngle,
          true,
        );
        ctx.shadowColor = "rgb(0,0,0,0.5)";
        ctx.stroke();
        ctx.strokeStyle = "white";
        ctx.shadowBlur = "15";
        ctx.closePath();
        ctx.shadowColor = "rgb(0,0,0,0)";
        ctx.fillStyle = wedgeLayer.color;
        ctx.fill();

        // Inside wedgeLayers.forEach, after ctx.fill();
        if (wedgeLayerIndex < layer.wedgeLayers.length - 1) {
          ctx.beginPath();
          ctx.moveTo(
            centerX + layerOuterRadius * Math.cos(wedgeEndAngle),
            centerY + layerOuterRadius * Math.sin(wedgeEndAngle),
          );
          ctx.lineTo(
            centerX + previousLayerOuterRadius * Math.cos(wedgeEndAngle),
            centerY + previousLayerOuterRadius * Math.sin(wedgeEndAngle),
          );
          ctx.strokeStyle = "white"; // Set the stroke color for the line
          ctx.lineWidth = 3; // Set the desired line width
          ctx.stroke();
        }

        // Draw labels inside the wedge
        if (wedgeLayer.labels && wedgeLayer.labels.length > 0) {
          // Debug: Log the labels being passed to drawWedgeLabels

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
    
    const outerRadius = maxRadius + 10; // Add a small offset to extend beyond maxRadius
    const innerRadiusWithBanner = innerCircleRadius + bannerWidth;

    ctx.beginPath();
    ctx.moveTo(
      centerX + outerRadius * Math.cos(communityAngleEnd),
      centerY + outerRadius * Math.sin(communityAngleEnd)
    );
    ctx.lineTo(
      centerX + innerRadiusWithBanner * Math.cos(communityAngleEnd),
      centerY + innerRadiusWithBanner * Math.sin(communityAngleEnd)
    );
    ctx.stroke();
    });
}

//All lables and text (community/branch labels and initiatives) are stated below
function drawTextLabels(
  ctx,
  centerX,
  centerY,
  innerRadius,
  bannerWidth,
  communities,
  size,
) {
  const scaleFactor = size / 1000; // Assuming 1000 is the base size for which your styles were originally designed
  const fontSize = 24 * scaleFactor; // Adjust font size based on canvas size
  ctx.font = `${fontSize}px 'Roboto', sans-serif`;
  const labelRadius = innerRadius + bannerWidth / 2;
  const anglePerCommunity = (2 * Math.PI) / communities.length;

  communities.forEach((community, index) => {
    const startAngle = index * anglePerCommunity;
    const endAngle = startAngle + anglePerCommunity;

    ctx.save(); // Save the current context state
    ctx.fillStyle = "white";
    ctx.font = "24px 'Roboto', sans-serif";
    ctx.textBaseline = "middle";

    const text = community.name;
    let totalTextWidth = 0;
    for (let i = 0; i < text.length; i++) {
      totalTextWidth += ctx.measureText(text[i]).width;
    }

    // Adjust the angle based on the new text width
    const textAngle = totalTextWidth / labelRadius;
    let currentAngle = startAngle + (anglePerCommunity - textAngle) / 2;

    for (let i = 0; i < text.length; i++) {
      const character = text[i];
      const charWidth = ctx.measureText(character).width;
      // The radius for each character should be recalculated based on the current size
      const charRadius = charWidth / (2 * Math.PI);
      const charAngle = charWidth / labelRadius;

      // Calculate the x and y position for the character
      const x =
        centerX +
        (labelRadius + charRadius) * Math.cos(currentAngle + charAngle / 2);
      const y =
        centerY +
        (labelRadius + charRadius) * Math.sin(currentAngle + charAngle / 2);

      ctx.save(); // Save the context state before translating and rotating
      ctx.translate(x, y);
      ctx.rotate(currentAngle + charAngle / 2 + Math.PI / 2);
      ctx.fillText(character, -charWidth / 2, 0); // Center the character
      ctx.restore(); // Restore the context state

      currentAngle += charAngle; // Move to the next character position
    }

    ctx.restore(); // Restore the context state
  });
}

function calculateFontSize(canvasSize) {
  // Example logic to adjust font size based on canvas size
  const baseSize = 14; // Base font size for a standard canvas size
  const standardCanvasSize = 1000; // Define what you consider a standard canvas size
  return baseSize * (canvasSize / standardCanvasSize);
}

function adjustFontSizeToFit(ctx, text, arcLength) {
  let fontSize = 24; // Start with an initial font size
  let textWidth;

  do {
    ctx.font = `${fontSize}px Arial`;
    textWidth = ctx.measureText(text).width;
    fontSize -= 1; // Decrease the font size if the text is too wide
  } while (textWidth > arcLength && fontSize > 0);

  return fontSize + 1; // Return the adjusted font size that fits the text
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
  ctx.font = `${fontSize}px Roboto`; // Set the initial font

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

export default LayeredPolarChart;
