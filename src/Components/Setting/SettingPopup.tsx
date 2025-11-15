'use client';
import React, { useEffect, useState } from 'react';
import {
    X, Map, Layers, Eye, EyeOff, Download, Upload, BarChart3,
    Trees, Navigation, MapPin, RefreshCw, Flame, Cloud
} from 'lucide-react';
import WeatherLegend from "@/Components/Setting/WeatherLegends";

interface SettingsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onBaseMapChange: (mapType: string) => void;
    onLayerToggle: (layer: string, visible: boolean) => void;
    onHeatmapToggle?: (visible: boolean) => void;
    onHeatmapSettingsChange?: (settings: {
        intensity: number;
        radius: number;
        blur: number;
    }) => void;
    currentLocation?: {
        lat: number;
        lng: number;
        zoom: number;
        bounds?: any;
    };
    onWeatherHeatmapToggle?: (visible: boolean) => void;
    onWeatherHeatmapSettingsChange?: (settings: {
        weatherType:'temperature' | 'precipitation' | 'pressure' | 'clouds'|'wind'|'snow';
        opacity: number;
        updateInterval: number;
    }) => void;
    weatherHeatmapVisible?: boolean;
    weatherHeatmapSettings?: {
        weatherType:'temperature' | 'precipitation' | 'pressure' | 'clouds'|'wind'|'snow';
        opacity: number;
        updateInterval: number;
    };
    markers: any[];
    shapes: any[];
    onRefreshStats?: () => void;
    heatmapVisible?: boolean;
    heatmapSettings?: {
        intensity: number;
        radius: number;
        blur: number;
    };
}
export const SettingsPopup: React.FC<SettingsPopupProps> = ({
                                                                isOpen,
                                                                onClose,
                                                                onWeatherHeatmapToggle,
                                                                onWeatherHeatmapSettingsChange,
                                                                weatherHeatmapVisible = false,
                                                                weatherHeatmapSettings = { weatherType: 'temperature', opacity: 0.7, updateInterval: 30 },
                                                                onBaseMapChange,
                                                                onLayerToggle,
                                                                onHeatmapToggle,
                                                                onHeatmapSettingsChange,
                                                                currentLocation,
                                                                markers = [],
                                                                shapes = [],
                                                                onRefreshStats,
                                                                heatmapVisible = false,
                                                                heatmapSettings = { intensity: 1.0, radius: 25, blur: 15 },
                                                            }) => {
    const [activeTab, setActiveTab] = React.useState<'map' | 'layers' | 'data' | 'stats' | 'heatmap'|'weather'>('map');
    const [baseMap, setBaseMap] = React.useState('standard');
    const [layers, setLayers] = React.useState({
        markers: true,
        shapes: true,
        satellite: false,
        terrain: false,
    });
    const [localWeatherHeatmapVisible, setLocalWeatherHeatmapVisible] = useState(weatherHeatmapVisible);
    const [localWeatherHeatmapSettings, setLocalWeatherHeatmapSettings] = useState(weatherHeatmapSettings);

    useEffect(() => {
        setLocalWeatherHeatmapVisible(weatherHeatmapVisible);
    }, [weatherHeatmapVisible]);

    useEffect(() => {
        setLocalWeatherHeatmapSettings(weatherHeatmapSettings);
    }, [weatherHeatmapSettings]);

    const handleWeatherHeatmapToggle = (visible: boolean) => {
        setLocalWeatherHeatmapVisible(visible);
        onWeatherHeatmapToggle?.(visible);
    };

    const handleWeatherHeatmapSettingsChange = (newSettings: typeof localWeatherHeatmapSettings) => {
        setLocalWeatherHeatmapSettings(newSettings);
        onWeatherHeatmapSettingsChange?.(newSettings);
    };

    const [isLoading, setIsLoading] = useState(false);

    const [localHeatmapVisible, setLocalHeatmapVisible] = useState(heatmapVisible);
    const [localHeatmapSettings, setLocalHeatmapSettings] = useState(heatmapSettings);

    useEffect(() => {
        setLocalHeatmapVisible(heatmapVisible);
    }, [heatmapVisible]);

    useEffect(() => {
        setLocalHeatmapSettings(heatmapSettings);
    }, [heatmapSettings]);

    const [statistics, setStatistics] = useState({
        totalMarkers: 0,
        totalShapes: 0,
        forestCover: '0 ha',
        elevation: '0 m',
        lastUpdated: new Date().toLocaleDateString(),
        areaType: 'Mixed Forest',
        carbonStorage: '0 tons',
        biodiversityIndex: '0.0',
        totalArea: '0 ha',
        averageElevation: '0 m',
        heatmapPoints: 0,
    });

    const calculateStatistics = async () => {
        setIsLoading(true);

        try {
            const totalMarkers = markers.length;
            const totalShapes = shapes.length;

           let totalArea = 0;
            shapes.forEach(shape => {
                if (shape.data.properties?.area) {
                    totalArea += shape.data.properties.area;
                } else if (shape.data.properties?.radius) {
                    // Calculate circle area: π * r²
                    const radius = shape.data.properties.radius;
                    totalArea += Math.PI * radius * radius;
                }
            });

            const totalAreaHectares = totalArea / 10000;

            const elevation = await getElevationData(currentLocation?.lat, currentLocation?.lng);
 const carbonStorage = totalAreaHectares * 150; // Rough estimate: 150 tons/ha
 const biodiversityIndex = calculateBiodiversityIndex(markers, shapes);
   const areaType = determineAreaType(markers, shapes);
   const heatmapPoints = calculateHeatmapPoints(markers, shapes);

            setStatistics({
                totalMarkers,
                totalShapes,
                forestCover: `${totalAreaHectares.toFixed(2)} ha`,
                elevation: `${elevation} m`,
                lastUpdated: new Date().toLocaleString(),
                areaType,
                carbonStorage: `${carbonStorage.toFixed(0)} tons`,
                biodiversityIndex: biodiversityIndex.toFixed(2),
                totalArea: `${totalAreaHectares.toFixed(2)} ha`,
                averageElevation: `${elevation} m`,
                heatmapPoints,
            });
        } catch (error) {
            console.error('Error calculating statistics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate approximate heatmap points
    const calculateHeatmapPoints = (markers: any[], shapes: any[]): number => {
        let points = markers.length; // Each marker is a point

        shapes.forEach(shape => {
            const geometry = shape.data?.geometry;
            if (geometry?.type === 'Polygon' && geometry.coordinates?.[0]) {
                 points += geometry.coordinates[0].length;
            } else if (geometry?.type === 'Circle') {
                points += 9; // center + 8 perimeter points
            } else if (geometry?.type === 'Rectangle' && geometry.coordinates?.[0]) {
                points += 4;
            } else {
                points += 1;
            }
        });

        return points;
    };

    const getElevationData = async (lat?: number, lng?: number): Promise<number> => {
        if (!lat || !lng) return 0;

        try {
            const response = await fetch(
                `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`
            );
            const data = await response.json();
            return data.results[0]?.elevation || 0;
        } catch (error) {
            console.error('Error fetching elevation:', error);
            return 0;
        }
    };

    const calculateBiodiversityIndex = (markers: any[], shapes: any[]): number => {
        const markerTypes = new Set(markers.map(m => m.type || 'general')).size;
        const shapeTypes = new Set(shapes.map(s => s.data.geometry?.type)).size;

        const totalFeatures = markers.length + shapes.length;
        if (totalFeatures === 0) return 0;

        return (markerTypes + shapeTypes) / totalFeatures * 10;
    };

    const determineAreaType = (markers: any[], shapes: any[]): string => {
        const hasForestMarkers = markers.some(m =>
            m.title?.toLowerCase().includes('forest') ||
            m.description?.toLowerCase().includes('tree')
        );

        const hasUrbanMarkers = markers.some(m =>
            m.title?.toLowerCase().includes('building') ||
            m.description?.toLowerCase().includes('urban')
        );

        if (hasForestMarkers) return 'Forest Area';
        if (hasUrbanMarkers) return 'Urban Area';
        if (shapes.length > 0) return 'Managed Area';
        return 'Mixed Use Area';
    };

    useEffect(() => {
        if (isOpen && activeTab === 'stats') {
            calculateStatistics();
        }
    }, [isOpen, activeTab, markers.length, shapes.length]);

    const handleHeatmapToggle = (visible: boolean) => {
        setLocalHeatmapVisible(visible);
        onHeatmapToggle?.(visible);
    };

    const handleHeatmapSettingsChange = (newSettings: typeof localHeatmapSettings) => {
        setLocalHeatmapSettings(newSettings);
        onHeatmapSettingsChange?.(newSettings);
    };

    const handleApplySettings = () => {
        if (localHeatmapVisible !== heatmapVisible) {
            onHeatmapToggle?.(localHeatmapVisible);
        }

        if (JSON.stringify(localHeatmapSettings) !== JSON.stringify(heatmapSettings)) {
            onHeatmapSettingsChange?.(localHeatmapSettings);
        }

        onClose();
    };

    if (!isOpen) return null;

    const handleBaseMapChange = (mapType: string) => {
        setBaseMap(mapType);
        onBaseMapChange(mapType);
    };

    const handleLayerToggle = (layer: string) => {
        const newVisibility = !layers[layer as keyof typeof layers];
        setLayers(prev => ({
            ...prev,
            [layer]: newVisibility,
        }));
        onLayerToggle(layer, newVisibility);
    };

    const handleExportData = () => {
        const data = {
            markers,
            shapes,
            statistics,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-data-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target?.result as string);
                        console.log('Imported data:', data);
                        alert('Data imported successfully! Refresh to see changes.');
                    } catch (error) {
                        alert('Error importing data: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleRefreshStats = () => {
        calculateStatistics();
        onRefreshStats?.();
    };

    const formatCoordinate = (coord: number) => coord?.toFixed(6) || 'N/A';
    const formatBounds = (bounds: any) => {
        if (!bounds) return 'N/A';
        return `${bounds.getSouthWest().lat.toFixed(4)}, ${bounds.getSouthWest().lng.toFixed(4)} to ${bounds.getNorthEast().lat.toFixed(4)}, ${bounds.getNorthEast().lng.toFixed(4)}`;
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-end m-3 justify-end bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-2xl w-126 max-h-[80vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Map Settings</h2>
                    <div className="relative group">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Close settings
                        </div>
                    </div>
                </div>

               <div className="flex border-b border-gray-200">
                    {[
                        { id: 'map', icon: Map, label: 'Base Map', tooltip: 'Change base map style' },
                        { id: 'layers', icon: Layers, label: 'Layers', tooltip: 'Manage map layers' },
                        { id: 'heatmap', icon: Flame, label: 'Heatmap', tooltip: 'Configure heatmap' },
                        { id: 'stats', icon: BarChart3, label: 'Statistics', tooltip: 'View location statistics' },
                        { id: 'data', icon: Download, label: 'Data', tooltip: 'Import/export map data' },
                        { id: 'weather', icon: Cloud, label: 'Weather', tooltip: 'Configure weather heatmap' },

                    ].map((tab) => (
                        <div key={tab.id} className="relative group flex-1">
                            <button
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full py-3 px-1 flex items-center justify-center gap-1 text-xs transition-colors cursor-pointer ${
                                    activeTab === tab.id
                                        ? 'text-teal-600 border-b-2 border-teal-600'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                            <div className="absolute bottom-full left-full transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {tab.tooltip}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 max-h-96 overflow-y-auto">
                    {activeTab === 'map' && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-800">Base Map Style</h3>
                            <div className="space-y-3">
                                {[
                                    { id: 'standard', name: 'Standard', description: 'OpenStreetMap standard' },
                                    { id: 'satellite', name: 'Satellite', description: 'Aerial imagery' },
                                    { id: 'terrain', name: 'Terrain', description: 'Topographic map' },
                                    { id: 'dark', name: 'Dark', description: 'Dark theme' },
                                ].map((map) => (
                                    <div
                                        key={map.id}
                                        onClick={() => handleBaseMapChange(map.id)}
                                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                            baseMap === map.id
                                                ? 'border-teal-500 bg-teal-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="font-medium text-gray-800">{map.name}</div>
                                        <div className="text-sm text-gray-600">{map.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'weather' && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-gray-800">Weather Heatmap</h3>

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Cloud className={`w-5 h-5 ${localWeatherHeatmapVisible ? 'text-blue-600 animate-pulse' : 'text-blue-400'}`} />
                                        <span className="font-medium text-gray-800">Global Weather Data</span>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            onClick={() => handleWeatherHeatmapToggle(!localWeatherHeatmapVisible)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                                localWeatherHeatmapVisible ? 'bg-teal-600' : 'bg-gray-300'
                                            }`}
                                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    localWeatherHeatmapVisible ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {localWeatherHeatmapVisible ? 'Disable weather heatmap' : 'Enable weather heatmap'}
                                        </div>
                                    </div>
                                </div>

                                {localWeatherHeatmapVisible && (
                                    <div className="space-y-4 mt-4">
                                        {/* Weather Type Selector */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weather Data Type
                                            </label>
                                            <select
                                                value={localWeatherHeatmapSettings.weatherType}
                                                onChange={(e) => handleWeatherHeatmapSettingsChange({
                                                    ...localWeatherHeatmapSettings,
                                                    weatherType: e.target.value as any
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="temperature">temperature</option>
                                                <option value="precipitation">precipitation</option>
                                                <option value="pressure">pressure</option>
                                                <option value="clouds">clouds</option>
                                                <option value="wind">wind</option>
                                                <option value="snow">snow</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm text-gray-700 mb-2">
                                                <span>Opacity</span>
                                                <span className="font-mono bg-white px-2 py-1 rounded border">
                                    {localWeatherHeatmapSettings.opacity.toFixed(1)}
                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="1.0"
                                                step="0.1"
                                                value={localWeatherHeatmapSettings.opacity}
                                                onChange={(e) => handleWeatherHeatmapSettingsChange({
                                                    ...localWeatherHeatmapSettings,
                                                    opacity: parseFloat(e.target.value)
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Update Interval (minutes)
                                            </label>
                                            <select
                                                value={localWeatherHeatmapSettings.updateInterval}
                                                onChange={(e) => handleWeatherHeatmapSettingsChange({
                                                    ...localWeatherHeatmapSettings,
                                                    updateInterval: parseInt(e.target.value)
                                                })}
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="15">15 minutes</option>
                                                <option value="30">30 minutes</option>
                                                <option value="60">1 hour</option>
                                                <option value="120">2 hours</option>
                                            </select>
                                        </div>

                                        <WeatherLegend type={localWeatherHeatmapSettings.weatherType} />


                                        <div className="text-xs text-gray-600 bg-white p-3 rounded border">
                                            <p>Weather data provided by OpenWeatherMap</p>
                                            <p className="mt-1">Data updates every {localWeatherHeatmapSettings.updateInterval} minutes</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'layers' && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-800">Map Layers</h3>

                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Flame className={`w-5 h-5 ${localHeatmapVisible ? 'text-orange-600 animate-pulse' : 'text-orange-400'}`} />
                                        <div>
                                            <div className="font-medium text-gray-800">Heatmap Layer</div>
                                            <div className="text-sm text-gray-600">
                                                {localHeatmapVisible ? 'Heatmap is active' : 'Heatmap is disabled'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            onClick={() => handleHeatmapToggle(!localHeatmapVisible)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                                localHeatmapVisible ? 'bg-teal-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    localHeatmapVisible ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {localHeatmapVisible ? 'Disable heatmap' : 'Enable heatmap'}
                                        </div>
                                    </div>
                                </div>

                                {localHeatmapVisible && (
                                    <div className="mt-3 pt-3 border-t border-orange-200">
                                        <div className="text-xs text-orange-700">
                                            <p>• Markers and shapes are hidden when heatmap is active</p>
                                            <p>• Configure heatmap settings in the Heatmap tab</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'markers', name: 'Markers', description: 'Show location markers' },
                                    { id: 'shapes', name: 'Shapes', description: 'Show drawn shapes' },
                                    { id: 'satellite', name: 'Satellite Overlay', description: 'Satellite imagery' },
                                    { id: 'terrain', name: 'Terrain', description: 'Elevation data' },
                                ].map((layer) => (
                                    <div
                                        key={layer.id}
                                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                                    >
                                        <div>
                                            <div className="font-medium text-gray-800">{layer.name}</div>
                                            <div className="text-sm text-gray-600">{layer.description}</div>
                                        </div>
                                        <div className="relative group">
                                            <button
                                                onClick={() => handleLayerToggle(layer.id)}
                                                className={`p-2 rounded-full transition-colors cursor-pointer ${
                                                    layers[layer.id as keyof typeof layers]
                                                        ? 'bg-teal-100 text-teal-600'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}
                                            >
                                                {layers[layer.id as keyof typeof layers] ? (
                                                    <Eye className="w-4 h-4" />
                                                ) : (
                                                    <EyeOff className="w-4 h-4" />
                                                )}
                                            </button>
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                {layers[layer.id as keyof typeof layers] ? 'Hide layer' : 'Show layer'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'heatmap' && (
                        <div className="space-y-6">
                            <h3 className="font-medium text-gray-800">Heatmap Settings</h3>

                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Flame className={`w-5 h-5 ${localHeatmapVisible ? 'text-orange-600 animate-pulse' : 'text-orange-400'}`} />
                                        <span className="font-medium text-gray-800">Heatmap Visualization</span>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            onClick={() => handleHeatmapToggle(!localHeatmapVisible)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                                localHeatmapVisible ? 'bg-teal-600' : 'bg-gray-300'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    localHeatmapVisible ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            {localHeatmapVisible ? 'Disable heatmap' : 'Enable heatmap'}
                                        </div>
                                    </div>
                                </div>

                                {localHeatmapVisible ? (
                                    <div className="space-y-4 mt-4">
                                        <div className="bg-white p-3 rounded border">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Data Points:</span>
                                                <span className="font-semibold">{calculateHeatmapPoints(markers, shapes)} points</span>
                                            </div>
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-600">Sources:</span>
                                                <span className="font-semibold">{markers.length} markers, {shapes.length} shapes</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm text-gray-700 mb-2">
                                                <span>Intensity</span>
                                                <span className="font-mono bg-white px-2 py-1 rounded border">
                                                    {localHeatmapSettings.intensity.toFixed(1)}
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="2.0"
                                                step="0.1"
                                                value={localHeatmapSettings.intensity}
                                                onChange={(e) => handleHeatmapSettingsChange({
                                                    ...localHeatmapSettings,
                                                    intensity: parseFloat(e.target.value)
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Low</span>
                                                <span>High</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm text-gray-700 mb-2">
                                                <span>Radius</span>
                                                <span className="font-mono bg-white px-2 py-1 rounded border">
                                                    {localHeatmapSettings.radius}px
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="50"
                                                step="5"
                                                value={localHeatmapSettings.radius}
                                                onChange={(e) => handleHeatmapSettingsChange({
                                                    ...localHeatmapSettings,
                                                    radius: parseInt(e.target.value)
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Small</span>
                                                <span>Large</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex justify-between text-sm text-gray-700 mb-2">
                                                <span>Blur</span>
                                                <span className="font-mono bg-white px-2 py-1 rounded border">
                                                    {localHeatmapSettings.blur}px
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                min="5"
                                                max="30"
                                                step="5"
                                                value={localHeatmapSettings.blur}
                                                onChange={(e) => handleHeatmapSettingsChange({
                                                    ...localHeatmapSettings,
                                                    blur: parseInt(e.target.value)
                                                })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Sharp</span>
                                                <span>Soft</span>
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded border">
                                            <div className="text-sm font-medium text-gray-700 mb-2">Heatmap Legend</div>
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                                    <span>Low</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                                                    <span>Medium</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-lime-500 rounded"></div>
                                                    <span>High</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                                    <span>Very High</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                                    <span>Hotspot</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <Flame className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm">Enable heatmap to configure settings</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-800">Real-time Statistics</h3>
                                <div className="relative group">
                                    <button
                                        onClick={handleRefreshStats}
                                        disabled={isLoading}
                                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        Refresh statistics
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Navigation className="w-4 h-4 text-teal-600" />
                                    <span className="font-medium text-gray-800">Current View</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Center:</span>
                                        <span className="font-mono text-gray-800 text-xs">
                                            {formatCoordinate(currentLocation?.lat)}, {formatCoordinate(currentLocation?.lng)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Zoom Level:</span>
                                        <span className="font-mono text-gray-800">
                                            {currentLocation?.zoom ?? 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">View Bounds:</span>
                                        <span className="text-xs font-mono text-gray-800 text-right">
                                            {currentLocation ? formatBounds(currentLocation.bounds) : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {localHeatmapVisible && (
                                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Flame className="w-4 h-4 text-orange-600" />
                                        <span className="font-medium text-gray-800">Heatmap Analysis</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="text-center p-2 bg-white rounded cursor-default">
                                            <div className="text-orange-600 font-semibold">{statistics.heatmapPoints}</div>
                                            <div className="text-gray-600 text-xs">Data Points</div>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded cursor-default">
                                            <div className="text-orange-600 font-semibold">
                                                {localHeatmapSettings.intensity.toFixed(1)}
                                            </div>
                                            <div className="text-gray-600 text-xs">Intensity</div>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded cursor-default">
                                            <div className="text-orange-600 font-semibold">
                                                {localHeatmapSettings.radius}px
                                            </div>
                                            <div className="text-gray-600 text-xs">Radius</div>
                                        </div>
                                        <div className="text-center p-2 bg-white rounded cursor-default">
                                            <div className="text-orange-600 font-semibold">
                                                {localHeatmapSettings.blur}px
                                            </div>
                                            <div className="text-gray-600 text-xs">Blur</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-green-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Trees className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-gray-800">Area Analysis</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="text-center p-2 bg-white rounded cursor-default">
                                        <div className="text-green-600 font-semibold">{statistics.forestCover}</div>
                                        <div className="text-gray-600 text-xs">Total Area</div>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded cursor-default">
                                        <div className="text-green-600 font-semibold">{statistics.carbonStorage}</div>
                                        <div className="text-gray-600 text-xs">Carbon Storage</div>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded cursor-default">
                                        <div className="text-green-600 font-semibold">{statistics.elevation}</div>
                                        <div className="text-gray-600 text-xs">Elevation</div>
                                    </div>
                                    <div className="text-center p-2 bg-white rounded cursor-default">
                                        <div className="text-green-600 font-semibold">{statistics.biodiversityIndex}</div>
                                        <div className="text-gray-600 text-xs">Biodiversity</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-gray-800">Map Data</span>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center cursor-default">
                                        <span className="text-gray-600">Total Markers:</span>
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {statistics.totalMarkers}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center cursor-default">
                                        <span className="text-gray-600">Total Shapes:</span>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {statistics.totalShapes}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center cursor-default">
                                        <span className="text-gray-600">Area Type:</span>
                                        <span className="text-gray-800 font-medium">{statistics.areaType}</span>
                                    </div>
                                    <div className="flex justify-between items-center cursor-default">
                                        <span className="text-gray-600">Last Updated:</span>
                                        <span className="text-gray-800 text-xs">{statistics.lastUpdated}</span>
                                    </div>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                                    <p className="text-sm text-gray-600 mt-2">Loading real-time data...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-800">Data Management</h3>
                            <div className="space-y-3">
                                <div className="relative group">
                                    <button
                                        onClick={handleExportData}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        <Download className="w-5 h-5 text-teal-600" />
                                        <div className="text-left">
                                            <div className="font-medium text-gray-800">Export Map Data</div>
                                            <div className="text-sm text-gray-600">Download markers and shapes (JSON)</div>
                                        </div>
                                    </button>
                                </div>

                                <div className="relative group">
                                    <button
                                        onClick={handleImportData}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        <Upload className="w-5 h-5 text-teal-600" />
                                        <div className="text-left">
                                            <div className="font-medium text-gray-800">Import Map Data</div>
                                            <div className="text-sm text-gray-600">Upload markers and shapes</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="relative group">
                        <button
                            onClick={handleApplySettings}
                            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium cursor-pointer"
                        >
                            Apply Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};