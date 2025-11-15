'use client';
import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Locate, Plus, Minus, Settings, Cloud } from 'lucide-react';
import { SettingsPopup } from '@/Components/Setting/SettingPopup';

interface MapControlsProps {
    markers?: any[];
    shapes?: any[];
    onStatsRefresh?: () => void;
    onHeatmapToggle?: (visible: boolean) => void;
    onHeatmapSettingsChange?: (settings: {
        intensity: number;
        radius: number;
        blur: number;
    }) => void;
    heatmapVisible?: boolean;
    heatmapSettings?: {
        intensity: number;
        radius: number;
        blur: number;
    };
    onWeatherHeatmapToggle?: (visible: boolean) => void;
    onWeatherHeatmapSettingsChange?: (settings: {
        weatherType:'temperature' | 'precipitation' | 'pressure' | 'clouds'|'wind'|'snow';
        opacity: number;
        updateInterval: number;
    }) => void;
    weatherHeatmapVisible?: boolean;
    weatherHeatmapSettings?: {
        weatherType: 'temperature' | 'precipitation' | 'pressure' | 'clouds'|'wind'|'snow';
        opacity: number;
        updateInterval: number;
    };
}

export const MapControls: React.FC<MapControlsProps> = ({
                                                            markers = [],
                                                            shapes = [],
                                                            onStatsRefresh,
                                                            onHeatmapToggle,
                                                            onHeatmapSettingsChange,
                                                            heatmapVisible = false,
                                                            heatmapSettings = { intensity: 1.0, radius: 25, blur: 15 },
                                                            onWeatherHeatmapToggle,
                                                            onWeatherHeatmapSettingsChange,
                                                            weatherHeatmapVisible = false,
                                                            weatherHeatmapSettings = { weatherType: 'temperature', opacity: 0.7, updateInterval: 30 },
                                                        }) => {
    const map = useMap();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({
        lat: map.getCenter().lat,
        lng: map.getCenter().lng,
        zoom: map.getZoom(),
        bounds: map.getBounds()
    });

    useEffect(() => {
        const updateLocation = () => {
            setCurrentLocation({
                lat: map.getCenter().lat,
                lng: map.getCenter().lng,
                zoom: map.getZoom(),
                bounds: map.getBounds()
            });
        };

        map.on('moveend', updateLocation);
        map.on('zoomend', updateLocation);

        return () => {
            map.off('moveend', updateLocation);
            map.off('zoomend', updateLocation);
        };
    }, [map]);

    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Your browser does not support this feature');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                map.setView([latitude, longitude], 15);
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup('Current location')
                    .openPopup();
            },
            () => alert('Location access denied.')
        );
    };

    const handleBaseMapChange = (mapType: string) => {
        let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        switch (mapType) {
            case 'satellite':
                url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
                break;
            case 'terrain':
                url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
                break;
            case 'dark':
                url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
                break;
            default:
                url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }

        map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });

        L.tileLayer(url).addTo(map);
    };

    const handleLayerToggle = (layer: string, visible: boolean) => {
        console.log(`Layer ${layer} visibility: ${visible}`);
        // Implement your layer visibility logic here
    };

    const handleRefreshStats = () => {
        onStatsRefresh?.();
    };

    return (
        <>
            <div className="absolute left-4 top-4 z-[1000] flex flex-col gap-3">
                <div className="relative group">
                    <button
                        onClick={handleZoomIn}
                        className="w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700 cursor-pointer"
                    >
                        <Plus className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Zoom in
                    </div>
                </div>

                <div className="relative group">
                    <button
                        onClick={handleZoomOut}
                        className="w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700 cursor-pointer"
                    >
                        <Minus className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Zoom out
                    </div>
                </div>

                <div className="relative group">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700 cursor-pointer"
                    >
                        <Settings className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Settings
                    </div>
                </div>

                <div className="relative group">
                    <button
                        onClick={handleLocateMe}
                        className="w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 bg-teal-700 cursor-pointer"
                    >
                        <Locate className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        My location
                    </div>
                </div>
            </div>

            {/* Setting Popup */}
            <SettingsPopup
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onBaseMapChange={handleBaseMapChange}
                onLayerToggle={handleLayerToggle}
                onHeatmapToggle={onHeatmapToggle}
                onHeatmapSettingsChange={onHeatmapSettingsChange}
                onWeatherHeatmapToggle={onWeatherHeatmapToggle}
                onWeatherHeatmapSettingsChange={onWeatherHeatmapSettingsChange}
                currentLocation={currentLocation}
                markers={markers}
                shapes={shapes}
                onRefreshStats={handleRefreshStats}
                heatmapVisible={heatmapVisible}
                heatmapSettings={heatmapSettings}
                weatherHeatmapVisible={weatherHeatmapVisible}
                weatherHeatmapSettings={weatherHeatmapSettings}
            />
        </>
    );
};