// ModelItem.jsx
import React from 'react';

const ModelItem = ({ label, children }) => (
  <div>
    <h3>{label}</h3>
    <div>
      {children && children.map((child, index) => (
        <ModelItem key={index} label={child.label} children={child.children} />
      ))}
    </div>
  </div>
);

export default ModelItem;
