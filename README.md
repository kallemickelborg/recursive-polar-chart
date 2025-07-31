# Recursive multi-layered Polar-Chart framework

This project introduces an interactive and recursive polarchart designed to map organizational structures, processes, values, and missions. This tools is useful for Management Consultants looking to map structures and/or processes in a circular graphical model (polar/radar chart). This can be used to create elements for PowerPoint presentations, reports or as standalone deliverables.

## Features

- Excalidraw & Miro-like Infinite canvas for chart navigation
- Recursive multi-layer polarchart graphical editor
- Entirely modularized customization for each element and componend of the chart
- Export options (SVG and PNG)
- Cached data to resume session
- Excel Import/Export

## Stack

- React + Vite
- D3.js for visualization
- Shadcn UI for components (including Tailwind)
- WebFont for Google Fonts

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:5173`

## Usage

1. **Center Settings** - Click center to set organization label and global styling
2. **Add Elements** - Hover near chart elements to reveal plus buttons for additions
3. **Edit Elements** - Click branches, layers, or wedges to open contextual settings
4. **Settings Drawer** - Access canvas size and import/export options
5. **Export** - Save as Excel (.xlsx), SVG, or PNG formats

## Live Demo

Try out the polar-chart: [https://polarchart.netlify.app/](https://polarchart.netlify.app/)

## Usage

The polar-chart allows users to:

- Add/remove branches, layers, and labels
- Customize colors and text
- Adjust chart dimensions and styling
- Export the chart as SVG or PNG
- Export as .xlsx to edit in Excel
- Import .xlsx files to update polar-chart

## To-do

- [ ] Improve naming conventions and typology for chart elements
- [ ] Fix dialog pop-up centering
- [ ] Remove unused components
- [ ] Add chart spacing options
- [ ] Add tutorial video

