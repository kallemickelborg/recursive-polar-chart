// React imports
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Drawer = ({ isOpen, children }) => {
  return (
    <div
      className={`drawer fixed top-0 left-0 h-full bg-background shadow-lg transform transition-transform duration-300 ease-in-out border-r border-border flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <ScrollArea className="flex-1">
        <div className="drawer-content p-4 w-full space-y-2.5">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Drawer;
