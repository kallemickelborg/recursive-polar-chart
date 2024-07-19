import React from 'react';
import './App.css';

const Drawer = ({ isOpen, children }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-1/4 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 overflow-y-auto h-full">
        {children}
      </div>
    </div>
  );
};

export default Drawer;