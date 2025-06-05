# Recursive multi-layered Polar-Chart framework

This project introduces an interactive and recursive polarchart designed to map organizational structures, processes, values, and missions. Inspired by Simon Sinek's "Start with Why" concept, it provides a framework that can be used to illustrate components of organizations, technologies, offering a comprehensive view of the entire structure.

## Features

- Recursive multi-layer polarchart frontend editor
- Real-time update in SVG format using D3.js
- Export options (SVG and PNG)
- Cached data to resume session
- Excel Import/Export

## Stack

- React + Vite
- D3.js for visualization
- Tailwind CSS for styling
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
