# Recursive multi-layered Polar-Chart framework

This project introduces an interactive and recursive polarchart designed to map organizational structures, processes, values, and missions. Inspired by Simon Sinek's "Start with Why" concept, it provides a visual representation of the connections between different organizational segments, offering a comprehensive view of the entire structure.

## Features

- Recursive multi-layer polarchart frontend editor
- Real-time update in SVG format using D3.js
- Export options (SVG and PNG)
- Cached data to resume session (chart data and settings persisted via `localStorage`)
- Excel Import/Export

## Technologies Used

- React
- Vite
- D3.js
- Tailwind CSS
- Flowbite

## Additional Libraries

- autoprefixer
- postcss

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

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
