'use client';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
    markers: any[];
    shapes: any[];
    visible: boolean;
    intensity?: number;
    radius?: number;
    blur?: number;
    maxZoom?: number;
}
declare module 'leaflet' {
    function heatLayer(latlngs: [number, number, number][], options?: {
        radius?: number;
        blur?: number;
        maxZoom?: number;
        gradient?: Record<number, string>;
    }): L.Layer;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
                                                              markers,
                                                              shapes,
                                                              visible,
                                                              intensity = 1.0,
                                                              radius = 25,
                                                              blur = 15,
                                                              maxZoom = 6,
                                                          }) => {
    const map = useMap();
    const heatLayerRef = useRef<L.Layer | null>(null);

    const calculateAverageCoordinates = (): [number, number, number][] => {
        const points: [number, number, number][] = [];
        let totalLat = 0;
        let totalLng = 0;
        let count = 0;

        markers.forEach(marker => {
            if (marker.lat && marker.lng) {
                totalLat += marker.lat;
                totalLng += marker.lng;
                count++;
                points.push([marker.lat, marker.lng, intensity]);
            }
        });

        shapes.forEach(shape => {
            const geometry = shape.data?.geometry;

            if (geometry?.type === 'Polygon' && geometry.coordinates?.[0]) {
                geometry.coordinates[0].forEach((coord: number[]) => {
                    const [lng, lat] = coord;
                    if (lat && lng) {
                        totalLat += lat;
                        totalLng += lng;
                        count++;
                        points.push([lat, lng, intensity * 0.8]);
                    }
                });
            }
            else if (geometry?.type === 'Circle' && shape.data?.properties?.center) {
                const center = shape.data.properties.center;
                const [lng, lat] = center;
                if (lat && lng) {
                    totalLat += lat;
                    totalLng += lng;
                    count++;
                    points.push([lat, lng, intensity * 0.9]);

                    const circleRadius = shape.data.properties.radius || 50;
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * 2 * Math.PI;
                        const pointLat = lat + (circleRadius / 111320) * Math.cos(angle);
                        const pointLng = lng + (circleRadius / (111320 * Math.cos(lat * Math.PI / 180))) * Math.sin(angle);
                        points.push([pointLat, pointLng, intensity * 0.6]);
                    }
                }
            }
            else if (geometry?.type === 'Rectangle' && geometry.coordinates?.[0]) {
                geometry.coordinates[0].forEach((coord: number[]) => {
                    const [lng, lat] = coord;
                    if (lat && lng) {
                        totalLat += lat;
                        totalLng += lng;
                        count++;
                        points.push([lat, lng, intensity * 0.7]);
                    }
                });
            }
        });

        if (count > 0 && points.length > 0) {
            const avgLat = totalLat / count;
            const avgLng = totalLng / count;
            points.push([avgLat, avgLng, intensity * 1.5]);
        }

        return points;
    };

    useEffect(() => {
        if (!visible) {
            // Remove heatmap layer if it exists
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
            return;
        }

        const heatPoints = calculateAverageCoordinates();

        if (heatPoints.length > 0) {

            heatLayerRef.current = L.heatLayer(heatPoints, {
                radius,
                blur,
                maxZoom,
                gradient: {
                    0.2: 'blue',
                    0.4: 'cyan',
                    0.6: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                }
            }).addTo(map);
        } else {
            console.log('No heatmap points generated');
        }

        return () => {
            if (heatLayerRef.current) {
                map.removeLayer(heatLayerRef.current);
                heatLayerRef.current = null;
            }
        };
    }, [markers, shapes, visible, intensity, radius, blur, maxZoom, map]);

    return null;
};