export interface MapLocation {
    lat: number;
    lng: number;
    zoom: number;
    bounds?: any;
}

export interface HeatmapSettings {
    intensity: number;
    radius: number;
    blur: number;
}

export type WeatherType = 'temperature' | 'precipitation' | 'pressure' | 'clouds' | 'wind' | 'snow';

export interface WeatherHeatmapSettings {
    weatherType: WeatherType;
    opacity: number;
    updateInterval: number;
}

export interface Statistics {
    totalMarkers: number;
    totalShapes: number;
    forestCover: string;
    elevation: string;
    lastUpdated: string;
    areaType: string;
    carbonStorage: string;
    biodiversityIndex: string;
    totalArea: string;
    averageElevation: string;
    heatmapPoints: number;
}
declare module "@mapbox/polyline";



export interface SettingsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onBaseMapChange: (mapType: string) => void;
    onLayerToggle: (layer: string, visible: boolean) => void;
    onHeatmapToggle?: (visible: boolean) => void;
    onHeatmapSettingsChange?: (settings: HeatmapSettings) => void;
    currentLocation?: MapLocation;
    onWeatherHeatmapToggle?: (visible: boolean) => void;
    onWeatherHeatmapSettingsChange?: (settings: WeatherHeatmapSettings) => void;
    weatherHeatmapVisible?: boolean;
    weatherHeatmapSettings?: WeatherHeatmapSettings;
    markers: any[];
    shapes: any[];
    onRefreshStats?: () => void;
    heatmapVisible?: boolean;
    heatmapSettings?: HeatmapSettings;
}