import React from "react"
import Draggable from "react-draggable"
import { ScrollArea } from "./scroll-area"
import { cn } from "@/lib/utils.js"

const DraggableDialog = ({
  open,
  onOpenChange,
  children,
  className,
  ...props
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Draggable handle=".drag-handle" bounds="parent">
        <div
          className={cn(
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "max-w-md w-full h-[80vh] pointer-events-auto flex flex-col",
            "shadow-2xl border-2 border-border/20 rounded-lg",
            "bg-card text-card-foreground",
            className
          )}
          {...props}
        >
          <div className="drag-handle cursor-move h-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center z-10 flex-shrink-0">
            <div className="w-8 h-1 bg-muted-foreground/30 rounded-full"></div>
          </div>
          <button
            onClick={onOpenChange}
            className="absolute top-[5px] right-[5px] z-20 w-6 h-6 rounded-full bg-background/80 hover:bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6">
              {children}
            </div>
          </ScrollArea>
        </div>
      </Draggable>
    </div>
  )
}

export { DraggableDialog }
