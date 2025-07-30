import React from "react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./ThemeProvider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Theme:</span>
      <div className="flex rounded-md border">
        <Button
          variant={theme === "light" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("light")}
          className="rounded-r-none border-r"
        >
          ☀️ Light
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme("dark")}
          className="rounded-l-none"
        >
          🌙 Dark
        </Button>
      </div>
    </div>
  )
}
