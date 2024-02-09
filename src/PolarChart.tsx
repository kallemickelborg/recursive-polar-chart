import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import hierarchicalData from "./hierarchicalData.json";

const RecursivePolarChart = ({ layer }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartData = {
      labels: layer.children.map((child) => child.label),
      datasets: [
        {
          label: layer.label,
          data: layer.data,
          backgroundColor: layer.backgroundColor,
        },
      ],
    };

    const config = {
      type: "polarArea",
      data: chartData,
      options: {
        /* ... */
      },
    };

    const myChart = new Chart(chartRef.current, config);

    return () => myChart.destroy();
  }, [layer]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
      {layer.children &&
        layer.children.map((child, index) => (
          <RecursivePolarChart key={index} layer={child} />
        ))}
    </div>
  );
};

const PolarChartApp = () => {
  return <RecursivePolarChart layer={hierarchicalData} />;
};

export default PolarChartApp;
