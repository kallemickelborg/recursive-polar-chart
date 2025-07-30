import React, { useRef, useState, useEffect, useCallback } from 'react';

const InfiniteCanvas = ({ children, className = "" }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // Canvas state
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1
  });
  
  // Interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTransform, setLastTransform] = useState({ x: 0, y: 0 });

  // Constants
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 3;
  const ZOOM_SENSITIVITY = 0.001;

  // Center the chart on initial load
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current;
      const content = contentRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      
      // Center the content in the container
      const centerX = (containerRect.width - contentRect.width) / 2;
      const centerY = (containerRect.height - contentRect.height) / 2;
      
      setTransform({
        x: centerX,
        y: centerY,
        scale: 1
      });
    }
  }, [children]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate zoom
    const delta = -e.deltaY * ZOOM_SENSITIVITY;
    const newScale = Math.min(Math.max(transform.scale + delta, MIN_SCALE), MAX_SCALE);
    
    if (newScale === transform.scale) return;
    
    // Zoom towards mouse position
    const scaleRatio = newScale / transform.scale;
    const newX = mouseX - (mouseX - transform.x) * scaleRatio;
    const newY = mouseY - (mouseY - transform.y) * scaleRatio;
    
    setTransform({
      x: newX,
      y: newY,
      scale: newScale
    });
  }, [transform]);

  // Handle mouse down (start dragging)
  const handleMouseDown = useCallback((e) => {
    // Only start dragging on middle mouse button, right mouse button, or left mouse button with shift key
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setLastTransform({ x: transform.x, y: transform.y });

      // Change cursor
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grabbing';
      }
    }
  }, [transform]);

  // Handle mouse move (dragging)
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setTransform(prev => ({
      ...prev,
      x: lastTransform.x + deltaX,
      y: lastTransform.y + deltaY
    }));
  }, [isDragging, dragStart, lastTransform]);

  // Handle mouse up (stop dragging)
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // Reset cursor
    if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case '0':
        // Reset zoom and center
        if (containerRef.current && contentRef.current) {
          const container = containerRef.current;
          const content = contentRef.current;
          
          const containerRect = container.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          
          const centerX = (containerRect.width - contentRect.width) / 2;
          const centerY = (containerRect.height - contentRect.height) / 2;
          
          setTransform({
            x: centerX,
            y: centerY,
            scale: 1
          });
        }
        break;
      case '=':
      case '+':
        // Zoom in
        setTransform(prev => ({
          ...prev,
          scale: Math.min(prev.scale * 1.2, MAX_SCALE)
        }));
        break;
      case '-':
        // Zoom out
        setTransform(prev => ({
          ...prev,
          scale: Math.max(prev.scale / 1.2, MIN_SCALE)
        }));
        break;
    }
  }, []);

  // Prevent context menu on right click
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mouse events
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Keyboard events
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleMouseDown, handleContextMenu, handleMouseMove, handleMouseUp, handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className={`infinite-canvas-container ${isDragging ? 'dragging' : ''} ${className}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'default',
        backgroundPosition: `${transform.x % 20}px ${transform.y % 20}px`,
      }}
    >
      <div
        ref={contentRef}
        className="infinite-canvas-content"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : isAnimating ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
      
      {/* Canvas controls overlay */}
      <div className="canvas-controls">
        <div className="canvas-zoom-info">
          {Math.round(transform.scale * 100)}%
        </div>

        {/* Mini navigation controls */}
        <div className="canvas-nav-controls">
          <button
            className="nav-button"
            onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, MAX_SCALE) }))}
            title="Zoom In (+)"
          >
            +
          </button>
          <button
            className="nav-button"
            onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, MIN_SCALE) }))}
            title="Zoom Out (-)"
          >
            −
          </button>
          <button
            className="nav-button reset-button"
            onClick={() => {
              if (containerRef.current && contentRef.current) {
                setIsAnimating(true);
                const container = containerRef.current;
                const content = contentRef.current;

                const containerRect = container.getBoundingClientRect();
                const contentRect = content.getBoundingClientRect();

                const centerX = (containerRect.width - contentRect.width) / 2;
                const centerY = (containerRect.height - contentRect.height) / 2;

                setTransform({ x: centerX, y: centerY, scale: 1 });

                // Reset animation state after transition
                setTimeout(() => setIsAnimating(false), 300);
              }
            }}
            title="Reset View (0)"
          >
            ⌂
          </button>
        </div>

        <div className="canvas-help">
          <div>🖱️ Scroll to zoom</div>
          <div>⇧ + Drag or Right-click + Drag to pan</div>
          <div>Middle-click + Drag to pan</div>
          <div>Press 0 to reset view</div>
          <div>+/- to zoom in/out</div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCanvas;
