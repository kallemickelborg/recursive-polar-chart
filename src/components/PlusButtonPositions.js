//REFACTOR THIS FOR BETTER PLUS BUTTON PLACEMENT PROPORTIONAL TO CHART SIZE

export const calculatePlusButtonPositions = (
  data,
  radius,
  innerRadius,
  bannerWidth,
  size
) => {
  const positions = [];
  const center = size / 2;

  if (!data || data.length === 0) return positions;

  // 1. BRANCH BOUNDARY BUTTONS - between every pair of branches + after last branch
  const totalBranches = data.length;
  for (let i = 0; i <= totalBranches; i++) {
    // Calculate angle for insertion point
    const insertAngle = (i * 2 * Math.PI) / totalBranches;

    // Convert pixel offset to angular offset based on radius
    const pixelOffset = 0; // Fixed 20px offset
    const buttonRadius = radius * 0.2;
    const angularOffset = pixelOffset / buttonRadius; // Convert pixels to radians

    let adjustedAngle;
    if (i === 0) {
      // First button - move toward first branch
      adjustedAngle = insertAngle + angularOffset;
    } else if (i === totalBranches) {
      // Last button - move toward last branch
      adjustedAngle = insertAngle - angularOffset;
    } else {
      // Middle buttons - move toward the previous branch
      adjustedAngle = insertAngle - angularOffset;
    }

    // Position at 90% of outer radius
    const x = center + buttonRadius * Math.cos(adjustedAngle - Math.PI / 2);
    const y = center + buttonRadius * Math.sin(adjustedAngle - Math.PI / 2);

    positions.push({
      type: "branch",
      x,
      y,
      action: "addBranch",
      tooltip: `Add branch ${
        i === totalBranches ? "at end" : `before ${data[i].name}`
      }`,
      insertIndex: i,
    });
  }

  // 2. LAYER BOUNDARY BUTTONS - between every pair of layers in each branch + after last layer
  data.forEach((branch, branchIndex) => {
    const totalLayers = branch.onionLayers.length;
    const branchStartAngle = (branchIndex * 2 * Math.PI) / totalBranches;
    const branchEndAngle = ((branchIndex + 1) * 2 * Math.PI) / totalBranches;
    const branchMidAngle = (branchStartAngle + branchEndAngle) / 2;

    // Calculate layer positions
    const baseRadius = innerRadius + bannerWidth;
    const availableSpace = radius - baseRadius;
    const layerHeight = availableSpace / Math.max(totalLayers, 1);

    // Add buttons between and after layers
    for (let layerIndex = 0; layerIndex <= totalLayers; layerIndex++) {
      let buttonRadius;

      if (layerIndex === 0) {
        // Before first layer (at inner edge of branch)
        buttonRadius = baseRadius;
      } else if (layerIndex === totalLayers) {
        // After last layer - move slightly inward to avoid overlap with adjacent branches
        buttonRadius = baseRadius + layerIndex * layerHeight;
      } else {
        // At the outer edge of layer (layerIndex - 1), which is between layers
        buttonRadius = baseRadius + layerIndex * layerHeight;
      }

      const x = center + buttonRadius * Math.cos(branchMidAngle - Math.PI / 2);
      const y = center + buttonRadius * Math.sin(branchMidAngle - Math.PI / 2);

      positions.push({
        type: "layer",
        x,
        y,
        action: "addOnionLayer",
        tooltip: `Add layer ${
          layerIndex === 0
            ? "before first"
            : layerIndex === totalLayers
            ? "after last"
            : `between layer ${layerIndex} and ${layerIndex + 1}`
        } in ${branch.name}`,
        branchIndex,
        insertIndex: layerIndex,
      });
    }
  });

  // 3. WEDGE BOUNDARY BUTTONS - between every pair of wedges in EVERY layer + after last wedge
  data.forEach((branch, branchIndex) => {
    const branchStartAngle = (branchIndex * 2 * Math.PI) / totalBranches;
    const branchEndAngle = ((branchIndex + 1) * 2 * Math.PI) / totalBranches;
    const branchAngleSpan = branchEndAngle - branchStartAngle;

    branch.onionLayers.forEach((layer, layerIndex) => {
      const totalWedges = layer.wedgeLayers.length;

      // Calculate this layer's radius
      const baseRadius = innerRadius + bannerWidth;
      const availableSpace = radius - baseRadius;
      const layerHeight = availableSpace / branch.onionLayers.length;
      const layerMidRadius = baseRadius + (layerIndex + 0.5) * layerHeight;

      // Add buttons between and after wedges
      for (let wedgeIndex = 0; wedgeIndex <= totalWedges; wedgeIndex++) {
        // Calculate angle for this insertion point
        const wedgeAngleSpan = branchAngleSpan / totalWedges;

        // Convert pixel offset to angular offset based on this layer's radius
        const pixelOffset = 25; // Fixed 15px offset for wedges
        const angularOffset = pixelOffset / layerMidRadius; // Convert pixels to radians

        let insertAngle;

        if (wedgeIndex === 0) {
          // Before first wedge - move slightly inward toward first wedge (to avoid branch overlap)
          insertAngle = branchStartAngle + angularOffset;
        } else if (wedgeIndex === totalWedges) {
          // After last wedge - move slightly inward toward last wedge (to avoid branch overlap)
          insertAngle = branchEndAngle - angularOffset;
        } else {
          // Between wedges - use exact boundary (no offset needed, they're inside the branch)
          insertAngle = branchStartAngle + wedgeIndex * wedgeAngleSpan;
        }

        const x = center + layerMidRadius * Math.cos(insertAngle - Math.PI / 2);
        const y = center + layerMidRadius * Math.sin(insertAngle - Math.PI / 2);

        positions.push({
          type: "wedge",
          x,
          y,
          action: "addWedgeLayer",
          tooltip: `Add wedge ${
            wedgeIndex === totalWedges
              ? "at end"
              : `at position ${wedgeIndex + 1}`
          } in ${branch.name} layer ${layerIndex + 1}`,
          branchIndex,
          layerIndex,
          insertIndex: wedgeIndex,
        });
      }
    });
  });

  return positions;
};
