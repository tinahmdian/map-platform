import L from "leaflet";
import { renderToString } from "react-dom/server";
import React from "react"; // 👈 حتما لازم است

// Create SVG as string for default icon
const svgHtml = renderToString(
    <svg
        xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
width="40"
height="40"
fill="#ef4444"
stroke="black"
strokeWidth="1"
>
<path d="M12 2C8.13 2 5 5.13 5 9c0 4.34 5.8 11.17 6.08 11.5.39.5 1.45.5 1.84 0C13.2 20.17 19 13.34 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const defaultIcon = L.divIcon({
    html: svgHtml,
    className: "custom-marker-global",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

// Override default Leaflet marker icon globally
(L.Marker.prototype as any).options.icon = defaultIcon;
