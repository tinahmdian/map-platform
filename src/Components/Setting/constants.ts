import {BarChart3, Cloud,Map, Download, Flame} from "lucide-react";
export const BASE_MAPS = [
    { id: 'standard', name: 'Standard', description: 'OpenStreetMap standard' },
    { id: 'satellite', name: 'Satellite', description: 'Aerial imagery' },
    { id: 'terrain', name: 'Terrain', description: 'Topographic map' },
    { id: 'dark', name: 'Dark', description: 'Dark theme' },
] as const;

export const WEATHER_TYPES = [
    'temperature',
    'precipitation',
    'pressure',
    'clouds',
    'wind',
    'snow',
] as const;

export const UPDATE_INTERVALS = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
] as const;

export const TABS = [
    { id: 'map', icon: Map, label: 'Base Map', tooltip: 'Change base map style' },
    { id: 'heatmap', icon: Flame, label: 'Heatmap', tooltip: 'Configure heatmap' },
    { id: 'stats', icon: BarChart3, label: 'Statistics', tooltip: 'View location statistics' },
    { id: 'data', icon: Download, label: 'Data', tooltip: 'Import/export map data' },
    { id: 'weather', icon: Cloud, label: 'Weather', tooltip: 'Configure weather heatmap' },
] as const;