import React from "react";
import ModelItem from "./ModelItem";
import PolarChart from "./PolarChart"; // Import the PolarChart component
import LayeredPolarChart from "./LayeredPolarChart"; // Import the MultiLevelPolarChart component

const App = () => {
  return (
    <div>
      <LayeredPolarChart />
    </div>
  );
};

export default App;
