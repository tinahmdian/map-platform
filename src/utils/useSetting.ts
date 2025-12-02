import { useState, useEffect } from 'react';
import { Statistics } from '@/types/types';

export const useStatistics = (markers: any[], shapes: any[], currentLocation?: any) => {
    const [statistics, setStatistics] = useState<Statistics>({
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

    const [isLoading, setIsLoading] = useState(false);

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

        return totalFeatures === 0 ? 0 : (markerTypes + shapeTypes) / totalFeatures * 10;
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

    const calculateHeatmapPoints = (markers: any[], shapes: any[]): number => {
        let points = markers.length;

        shapes.forEach(shape => {
            const geometry = shape.data?.geometry;
            if (geometry?.type === 'Polygon' && geometry.coordinates?.[0]) {
                points += geometry.coordinates[0].length;
            } else if (geometry?.type === 'Circle') {
                points += 9;
            } else if (geometry?.type === 'Rectangle' && geometry.coordinates?.[0]) {
                points += 4;
            } else {
                points += 1;
            }
        });

        return points;
    };

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
                    const radius = shape.data.properties.radius;
                    totalArea += Math.PI * radius * radius;
                }
            });

            const totalAreaHectares = totalArea / 10000;
            const elevation = await getElevationData(currentLocation?.lat, currentLocation?.lng);
            const carbonStorage = totalAreaHectares * 150;
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

    return {
        statistics,
        isLoading,
        calculateStatistics,
    };
};

export const useLocalSettings = <T>(
    propValue: T,
    onChange?: (value: T) => void
) => {
    const [localValue, setLocalValue] = useState<T>(propValue);

    useEffect(() => {
        setLocalValue(propValue);
    }, [propValue]);

    const handleChange = (value: T) => {
        setLocalValue(value);
        onChange?.(value);
    };

    return [localValue, handleChange] as const;
};