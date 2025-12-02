'use client';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface WeatherHeatmapLayerProps {
    visible: boolean;
    weatherType:  'temperature' | 'precipitation' | 'pressure' | 'clouds'|'wind'|'snow';
    opacity?: number;
    updateInterval?: number;
}

const OPENWEATHER_API_KEY = 'b5b6cb91045e4b7211d1ca5b0308639a';

export const WeatherHeatmapLayer: React.FC<WeatherHeatmapLayerProps> = ({
                                                                            visible,
                                                                            weatherType = 'temperature',
                                                                            opacity = 0.7,
                                                                            updateInterval = 30,
                                                                        }) => {
    const map = useMap();
    const layerRef = useRef<L.TileLayer | null>(null);
    const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

    const getTileLayerUrl = (type: string): string => {
        const baseUrl = 'https://tile.openweathermap.org/map';

        switch (type) {
            case 'temperature':
                return `${baseUrl}/temp/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
            case 'precipitation':
                return `${baseUrl}/precipitation/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
            case 'pressure':
                return `${baseUrl}/pressure/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
            case 'clouds':
                return `${baseUrl}/clouds/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
            case 'wind':
                return `${baseUrl}/wind/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
            case 'snow':
                return `${baseUrl}/snow/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
            default:
                return `${baseUrl}/temp/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
        }
    };


    useEffect(() => {
        if (!visible) {
            if (layerRef.current && map.hasLayer(layerRef.current)) {
                map.removeLayer(layerRef.current);
            }
            layerRef.current = null;
            return;
        }

        const tileUrl = getTileLayerUrl(weatherType);

        if (layerRef.current && map.hasLayer(layerRef.current)) {
            map.removeLayer(layerRef.current);
        }

        const tileLayer = L.tileLayer(tileUrl, {
            opacity,
            attribution: 'Weather data © OpenWeatherMap',
        });

        tileLayer.addTo(map);
        layerRef.current = tileLayer;

        return () => {
            if (layerRef.current && map.hasLayer(layerRef.current)) {
                map.removeLayer(layerRef.current);
            }
            layerRef.current = null;
        };
    }, [visible, weatherType, opacity, map]);

    return null;
};