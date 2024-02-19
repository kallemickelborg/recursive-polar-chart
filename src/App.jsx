import React, { useState } from "react";
import InputForm from "./InputForm"; // Ensure this import matches the file name and location
import LayeredPolarChart from "./LayeredPolarChart";

// Assuming chartData.json is structured with a top-level "branches" array
import chartData from "./chartData.json";

const App = () => {
  const [data, setData] = useState(chartData);
  const [canvasSize, setCanvasSize] = useState(1000); // Adjust canvas size dynamically

  const handleDataChange = (newData) => {
    setData(newData);
  };
  
  return (
    <div>
      <InputForm data={data} onDataChange={setData} />
      <div>
        <label htmlFor="canvasSize">Canvas Size: {canvasSize}px</label>
        <input
          type="range"
          id="canvasSize"
          min="1000"
          max="3000"
          value={canvasSize}
          step="100"
          onChange={(e) => setCanvasSize(Number(e.target.value))}
        />
      </div>
      <LayeredPolarChart data={data || []} size={canvasSize} />
    </div>
  );
};

export default App;
