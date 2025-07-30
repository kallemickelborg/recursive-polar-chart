export const LAYOUT = {
  // Container patterns
  dialog: "space-y-6 p-1",
  scroll: "h-full w-full",
  section: "space-y-3 p-4 rounded-lg border border-border/50",
  card: "space-y-3 p-3 rounded-md bg-card/50 border border-border/30",

  // Header patterns
  header: "px-0 pb-4 pt-2",
  title: "text-sm font-semibold flex items-center gap-2",

  // Grid and flex patterns
  grid2: "grid grid-cols-2 gap-4",
  between: "flex items-center justify-between",
  start: "flex items-center space-x-3",
  column: "flex flex-col gap-2.5 w-full",
  full: "w-full",
  space4: "space-y-4",
  space3: "space-y-3",
  space2: "space-y-2",
}

export const TEXT = {
  // Titles and headers
  title: "text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent",
  desc: "text-sm text-muted-foreground",
  label: "text-sm font-medium",

  // Values and displays
  value: "text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded",
  code: "text-sm font-mono bg-muted/50 px-2 py-1 rounded border",
  help: "text-xs text-muted-foreground",
  range: "flex justify-between text-xs text-muted-foreground",
  rangeVal: "bg-muted/50 px-1 rounded",
}

export const BG = {
  // Section backgrounds (terse names)
  primary: "bg-gradient-to-br from-card to-muted/20",
  secondary: "bg-gradient-to-br from-secondary/30 to-accent/20",
  danger: "bg-gradient-to-br from-destructive/5 to-destructive/10",

  // Interactive backgrounds
  card: "p-2 rounded-md bg-background/50 border border-border/20",
  hover: "p-3 rounded-md bg-background/50 border border-border/20 hover:bg-accent/10 transition-colors",
}

export const INPUTS = {
  // Form inputs
  text: "border-border/50 focus:border-primary/50 transition-colors",
  color: "w-12 h-12 border-2 border-border rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow",

  // Containers
  slider: "w-full",
  container: "space-y-3 p-3 rounded-md bg-card/50 border border-border/30",
}

export const BTN = {
  // Primary actions
  primary: "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground",
  secondary: "bg-gradient-to-r from-secondary/50 to-accent/50 hover:from-secondary hover:to-accent border-border/50",

  // Destructive actions
  danger: "bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive shadow-lg",
  dangerOutline: "border-destructive/20 text-destructive hover:bg-destructive/10",

  // Special buttons
  add: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white",
  reset: "w-full bg-gradient-to-r from-secondary/50 to-accent/50 hover:from-secondary hover:to-accent border-border/50",
  full: "w-full",
  small: "h-7 text-xs",
}

export const SEP = {
  default: "bg-gradient-to-r from-transparent via-border to-transparent",
  danger: "bg-gradient-to-r from-transparent via-destructive/30 to-transparent",
  destructive: "bg-gradient-to-r from-transparent via-destructive/30 to-transparent", // Alias for compatibility
}

export const SWITCH = {
  box: "flex items-center space-x-3 p-2 rounded-md bg-background/50 border border-border/20",
  container: "flex items-center space-x-3 p-2 rounded-md bg-background/50 border border-border/20", // Alias for compatibility
  label: "text-sm font-medium cursor-pointer",
  active: "text-primary font-medium",
  inactive: "text-muted-foreground",
}

// Consolidated section creators (terse)
export const section = (type = 'primary') => `${LAYOUT.section} ${BG[type]}`
export const field = () => INPUTS.container
export const sliderLabel = () => `${TEXT.label} ${LAYOUT.between}`

// Complete patterns for common UI elements
export const PATTERNS = {
  // Slider field (most common pattern)
  slider: {
    section: field(),
    label: sliderLabel(),
    input: INPUTS.slider,
    ranges: TEXT.range,
    value: TEXT.value,
  },

  // Color picker field
  color: {
    section: field(),
    label: TEXT.label,
    wrapper: LAYOUT.start,
    input: INPUTS.color,
    value: TEXT.code,
  },

  // Switch field
  switch: {
    section: field(),
    label: TEXT.label,
    box: SWITCH.box,
    switchLabel: SWITCH.label,
  },
}

// Utility functions (terse)
export const combine = (...classes) => classes.filter(Boolean).join(' ')

// Quick creators (most used patterns)
export const btn = (variant = 'primary') => BTN[variant] || BTN.primary
export const sep = (variant = 'default') => SEP[variant] || SEP.default

// Legacy helper functions for compatibility
export const createButton = (variant = 'primary') => btn(variant)
export const createSection = (gradientType = 'primary') => section(gradientType)
export const createSliderField = () => PATTERNS.slider
export const createColorField = () => PATTERNS.color
