import React from "react";

const Drawer = ({ isOpen, toggleDrawer, children }) => {
  return (
    <div className={`drawer ${isOpen ? "open" : "closed"}`}>
      {children}
    </div>
  );
};

export default Drawer;
