// React imports
import React from "react";

// Styles
import { GENERAL_CLASSES } from "@/styles/classes";

const Drawer = ({ isOpen, children }) => {
  return (
    <div
      className={`${GENERAL_CLASSES.drawer} ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className={GENERAL_CLASSES.drawerContent}>{children}</div>
    </div>
  );
};

export default Drawer;
