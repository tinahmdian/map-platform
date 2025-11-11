// components/map/MapControls.tsx
'use client';
import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {Locate, Plus, Minus, Settings} from 'lucide-react'

interface MapControlsProps {}

export const MapControls: React.FC<MapControlsProps> = () => {
    const map = useMap();
    const [searchQuery] = useState('');

    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('your browser does not support this feature ');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], 15);
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup(' current loc')
                    .openPopup();
            },
            () => alert('access denied.')
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 14);
                L.marker([parseFloat(lat), parseFloat(lon)])
                    .addTo(map)
                    .bindPopup(display_name)
                    .openPopup();
            } else {
                alert('no location found.');
            }
        } catch {
            alert('please try again.');
        }
    };

    return (
        <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-3">
            {/* Zoom Buttons */}


                <div className="tooltip" data-tip=">zoom in">
                    <button
                        onClick={handleZoomIn}
                        className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700`}
                        title="zoom in"
                    >
                       <Plus className="w-4 h-4 text-white" />
                    </button>
                </div >
                <div className="tooltip" data-tip="zoom out">
                    <button
                        onClick={handleZoomOut}
                        className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700`}
                        title="zoom out"
                    >
                        <Minus className="w-4 h-4 text-white" />
                    </button>
                </div>
            <div className="tooltip" data-tip="setting">
                    <button
                        className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700`}
                        title="zoom out">
                        <Settings className="w-4 h-4 text-white" />
                    </button>
            </div>

            {/* Locate Me */}
            <div className="relative group">
                <button
                    onClick={handleLocateMe}
                    className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700`}
                    title=" ">
                    <Locate  className="w-4 h-4 text-white" />
                </button>
                <div
                    className="absolute bottom-full left-1/2
                       transform -translate-x-1/2 mb-2
                       w-max px-2 py-1 text-sm text-white
                       bg-gray-700 rounded shadow-lg
                       opacity-0 group-hover:opacity-100">
                    my location
                </div>
            </div>
            {/* Search Box */}
        {/*    <form
                onSubmit={handleSearch}
                className="mt-4 bg-white rounded-lg shadow-md p-2 flex items-center gap-2 w-44"
            >
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="search by places ..."
                    className="flex-1 text-sm border rounded-md p-1 outline-none"
                />
                <button
                    type="submit"
                    className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                    <span className="tooltip">search</span>

                    🔍
                </button>
            </form>f*/}
        </div>
    );
};
