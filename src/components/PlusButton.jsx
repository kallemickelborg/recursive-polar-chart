import React, { useState } from "react";

const PlusButton = ({
  x,
  y,
  size = 24,
  action,
  tooltip,
  className = "plus-button",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const buttonSize = size;
  const iconSize = size * 0.6;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action) {
      action();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  return (
    <g
      className={`plus-button ${className}`}
      transform={`translate(${x - buttonSize / 2}, ${y - buttonSize / 2})`}
      style={{
        cursor: "pointer",
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* AUGMENT ALL THE STYLING TO THE .css FILES INSTEAD OF INSTANTIATING THEM PER TAG */}
      {/* Button Background Circle */}
      <circle
        cx={buttonSize / 2}
        cy={buttonSize / 2}
        r={buttonSize / 2}
        fill={isHovered ? "#4CAF50" : "#2196F3"}
        stroke="white"
        strokeWidth="2"
        style={{
          transition: "fill 0.2s ease",
        }}
      />

      {/* Plus Icon */}
      <g fill="white">
        {/* Horizontal line */}
        <rect
          x={buttonSize / 2 - iconSize / 2}
          y={buttonSize / 2 - iconSize / 8}
          width={iconSize}
          height={iconSize / 4}
          rx={iconSize / 8}
        />
        {/* Vertical line */}
        <rect
          x={buttonSize / 2 - iconSize / 8}
          y={buttonSize / 2 - iconSize / 2}
          width={iconSize / 4}
          height={iconSize}
          rx={iconSize / 8}
        />
      </g>

      {/* Tooltip */}
      {showTooltip && tooltip && (
        <g>
          {/* Tooltip Background */}
          <rect
            x={buttonSize + 8}
            y={buttonSize / 2 - 12}
            width={tooltip.length * 7 + 16}
            height={24}
            fill="rgba(0, 0, 0, 0.8)"
            rx="4"
            ry="4"
          />
          {/* Tooltip Text */}
          <text
            x={buttonSize + 16}
            y={buttonSize / 2 + 4}
            fill="white"
            fontSize="12"
            fontFamily="Roboto, sans-serif"
            pointerEvents="none"
          >
            {tooltip}
          </text>
        </g>
      )}
    </g>
  );
};

export default PlusButton;
