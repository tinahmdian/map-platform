# Leaflet Next.js Project

A powerful interactive mapping application built with **Next.js**, **Leaflet**, **Tailwind CSS**, and **Dexie.js**. This project allows users to draw shapes, place markers, calculate distances, switch base maps, view weather-based heatmaps, export data, and retrieve information about the selected geographic area.

##  Features

###  Interactive Map (Leaflet)

* Draw shapes (polygons, polylines, circles) on the map
* Place and Delete markers
* Store all shapes and markers using **Dexie.js** (IndexedDB)
* View saved shapes and markers even after page refresh

###  Location Tools

* Get the user's current geolocation
* Pan/zoom controls
* Move to specific coordinates

###  Distance Measurement

* Calculate distance between two selected points
* Display distance in kilometers
<img width="1912" height="905" alt="image" src="https://github.com/user-attachments/assets/f8c41a80-7774-4cff-8f3a-43e605a1662e" />

###  Map Layers & Base Maps

* Switch between multiple base maps (street, satellite, terrain, etc.)
* Weather-based heatmaps
* Toggle shape layers
* Customizable overlay layers
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/fb1757f9-970e-4d2e-9ab6-aa19efca23f9" />
<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/889263ba-b6e6-4a72-9b4a-5f51e7b28d3e" />

###  Region Information

* View information about the area currently under the cursor or viewport

###  Data Export

* Export shapes, markers, or map state
* Download data as JSON

###  Built with Tailwind CSS

* Clean, responsive UI
* Custom controls styled using Tailwind

##  Tech Stack

* **Next.js** – App framework
* **React Leaflet / Leaflet.js** – Map engine
* **Dexie.js** – Local database (IndexedDB wrapper)
* **Tailwind CSS** – UI styling
* **TypeScript** – Type-safe development

## 📦 Installation

```bash
npm install
```

##  Run Development Server

```bash
npm run dev
```

##  Data Persistence with Dexie

Shapes and markers are stored locally using Dexie.js:

* Drawn shapes are saved automatically
* Markers persist between sessions


##  Distance Calculation

Distance between two points is calculated using the Haversine formula and displayed in a custom UI panel.

##  Heatmaps & Weather Layers

* Weather overlays (temperature, wind, rain, etc.)
* Heatmaps based on selected datasets

##  Settings Panel

Users can:

* Switch maps
* Toggle layers
* View heatmaps
* Export data
* Inspect region information

##  Exporting Data

You can export:

* All shapes
* All markers
* The full map state (JSON)

## Security Notes

Ensure you are running a **patched** version of Next.js due to CVE-2025-66478.
Recommended:

```bash
npm install next@latest
```


