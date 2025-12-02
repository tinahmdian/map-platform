'use client';
import "@/Components/Map/MapFeatures/markerIcon";
import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, FeatureGroup, useMapEvents, useMap, Polyline, Popup, Marker} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useMapData } from '@/utils/useMapData';
import { useDrawing } from '@/context/useDrawing';
import { DrawControls } from './MapFeatures/DrawControls';
import { DeleteButton } from './MapFeatures/DeleteButton';
import {getMarkerIcon, MarkerLayer} from './MapFeatures/MarkerLayer';
import { ShapeLayer } from './MapFeatures/ShapeLayer';
import { PopupModal } from './MapFeatures/PopupModal';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {db} from "@/db/db";
import {MapControls} from "@/Components/Map/MapFeatures/MapControls";
import SearchInput from "@/Components/Map/MapFeatures/SearchInput";
import {HeatmapLayer} from "@/Components/Map/MapFeatures/heatMapLayer";
import {WeatherHeatmapLayer} from "@/Components/Map/MapFeatures/weatherHeatMapLayer";
import { GuideTooltip} from "@/Components/Map/MapFeatures/GuideTooltip";
import polyline from "@mapbox/polyline";
import {useMessage} from "@/context/useMessage";

declare global {
    interface Window {
        leafletMap: L.Map|null;
    }
}

const MapPage = () => {
    const { markers, shapes, addMarker, addShape, deleteMarker, deleteShape } = useMapData();
    const { drawingMode, deleteMode, setDeleteMode, triggerDraw, activePopup, setActivePopup, setDrawingMode } = useDrawing();
    const [distanceMode, setDistanceMode] = useState(false);
    const [distancePoints, setDistancePoints] = useState<{ lat: number, lng: number }[]>([]);
    const [distanceLine, setDistanceLine] = useState<{ lat: number, lng: number }[]>([]);
    const { handleOpenMessage } = useMessage();
    const mapRef = useRef<L.Map | null>(null);
    const [tempLayer, setTempLayer] = React.useState<any>(null);
    const [heatmapVisible, setHeatmapVisible] = useState(false);
    const [heatmapSettings, setHeatmapSettings] = useState({
        intensity: 1.0,
        radius: 25,
        blur: 15,
    });

    const [weatherHeatmapVisible, setWeatherHeatmapVisible] = useState(false);
    const [weatherHeatmapSettings, setWeatherHeatmapSettings] = useState({
        weatherType: 'temperature' as 'temperature' | 'precipitation' | 'pressure' | 'clouds'|'wind'|'snow',
        opacity: 0.7,
        updateInterval: 30, // minutes
    });
    const handleDrawAction = (type: string) => {
        if (type === "distance") {
            setDeleteMode(false)
            setDistanceLine([]);
            setDistanceMode(!distanceMode);
            setDistancePoints([]);
            setDrawingMode("");
            return;
        }
        setDistanceMode(false);
        triggerDraw(type);
    };

    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    useEffect(() => {
        if (deleteMode){
            setDistanceMode(false)
            setDistanceLine([]);
            setDistancePoints([]);
        }
    }, [deleteMode]);
    async function getDistance(p1:{ lat: number, lng: number }, p2:{ lat: number, lng: number }) {
        try {
            const url = `https://us1.locationiq.com/v1/directions/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?key=pk.1b4a43969b61b1b0ba70c09d85e847f0&steps=true`;
            const res = await fetch(url);
            const data = await res.json();
            const distanceMeters = data.routes[0].distance;
            const durationSeconds = data.routes[0].duration;
            const polylineEncoded = data.routes[0].geometry;
            const coords: [number, number][] = polyline.decode(polylineEncoded);
            setDistanceLine(coords.map(([lat, lng]) => ({ lat, lng })));
            setDistanceKm(data.routes[0].distance / 1000);
            return {
                distanceKm: (distanceMeters / 1000).toFixed(2),
                durationMin: (durationSeconds / 60).toFixed(1)
            };
        }
        catch{
            handleOpenMessage('network error ','error')

        }
        finally {
            setDistanceMode(false)
        }

    }

    const saveMapState = async (
        lat?: number,
        lng?: number,
        zoom?: number,
    ) => {
        if (!lat || !lng || !zoom || !mapRef.current) return;
        try {
            await db.mapState.put({
                id: 1,
                centerLat: lat,
                centerLng: lng,
                zoom,
            });
        } catch  {

        }
    };

    const MapEvents = () => {
        const map = useMap();
        useEffect(() => {
            if (typeof window !== 'undefined') {
                (window).leafletMap = map;
            }
        }, [map]);

        useMapEvents({
            click: async (e) => {
                if (!distanceMode) return;
                const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
                const newPoints = [...distancePoints, newPoint];
                setDistancePoints(newPoints);
                if (newPoints.length === 2) {
                    getDistance(newPoints[0], newPoints[1]);
                    setDistanceMode(false);
                    return [];
                }

            },
            moveend: () => {
                saveMapState(
                    map.getCenter().lat,
                    map.getCenter().lng,
                    map.getZoom(),
                );
            },
        });

        useEffect(() => {
            mapRef.current = map;
            map.invalidateSize()
        }, [map]);
        return null;
    };

    useEffect(() => {
        if (mapRef.current) {
            const mapInstance = mapRef.current;
            if (typeof window !== 'undefined') {
                (window).leafletMap = mapInstance;
            }
        }
    }, []);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const savedState = await db.mapState.get(1);
                if (savedState && mapRef.current) {
                    const { centerLat, centerLng, zoom } = savedState;
                    mapRef.current?.setView([centerLat, centerLng], zoom ?? 10, { animate: false });
                }
            } catch  {
                handleOpenMessage('network error ','error')
            }
        };
        loadInitialData();
    }, []);

    const handleCreated = (e: any) => {
        const layer = e.layer;
        setTempLayer(layer);
        if (drawingMode === "marker") {
            layer.setIcon(getMarkerIcon('red'));
            const { lat, lng } = layer.getLatLng();
            setActivePopup({ type: "marker", lat, lng });
        } else {
            const data = layer.toGeoJSON();
            if (layer.getRadius) {
                data.properties = { ...data.properties, radius: layer.getRadius() };
            }
            setActivePopup({ type: "shape", data });
        }
    };

    const handleSavePopup = (title: string, desc: string) => {
        if (!activePopup) return;

        if (activePopup.type === 'marker') {
            addMarker({
                lat: activePopup.lat,
                lng: activePopup.lng,
                title,
                description: desc,
                color: '#3b82f6',
                createdAt: new Date(),
            });
        } else {
            addShape({
                data: activePopup.data,
                title,
                description: desc,
                createdAt: new Date(),
            });
        }

        if (tempLayer) {
            tempLayer.remove();
            setTempLayer(null);
        }

        setActivePopup(null);
        setDrawingMode('');
    };

    const handleHeatmapToggle = (visible: boolean) => {
        setHeatmapVisible(visible);
    };

    const handleHeatmapSettingsChange = (settings: any) => {
        setHeatmapSettings(settings);
    };

    const handleWeatherHeatmapToggle = (visible: boolean) => {
        setWeatherHeatmapVisible(visible);
    };

    const handleWeatherHeatmapSettingsChange = (settings: any) => {
        setWeatherHeatmapSettings(settings);
    };

    return (
        <div className="relative w-full h-screen">
            <GuideTooltip deleteMode={deleteMode} distanceMode={distanceMode} />
            <DrawControls onDraw={handleDrawAction} active={drawingMode} />
            <DeleteButton active={deleteMode} onToggle={() => setDeleteMode(!deleteMode)} />
            <MapContainer
                ref={(ref) => {
                    if (ref && !mapRef.current) {
                        mapRef.current = ref;
                    }
                }}

                center={[52.509288,14.581281]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapControls
                    markers={markers}
                    shapes={shapes}
                    onHeatmapToggle={handleHeatmapToggle}
                    onHeatmapSettingsChange={handleHeatmapSettingsChange}
                    heatmapVisible={heatmapVisible}
                    heatmapSettings={heatmapSettings}
                    onWeatherHeatmapToggle={handleWeatherHeatmapToggle}
                    onWeatherHeatmapSettingsChange={handleWeatherHeatmapSettingsChange}
                    weatherHeatmapVisible={weatherHeatmapVisible}
                    weatherHeatmapSettings={weatherHeatmapSettings}
                />
                <SearchInput/>

                {!heatmapVisible && !weatherHeatmapVisible && (
                    <FeatureGroup>
                        <EditControl
                            position="topright"
                            draw={{
                                polygon: drawingMode === 'polygon',
                                rectangle: drawingMode === 'rectangle',
                                circle: drawingMode === 'circle',
                                marker: drawingMode === 'marker',
                                polyline: false,
                                circlemarker: false,
                            }}
                            edit={{ edit: false, remove: false }}
                            onCreated={handleCreated}
                        />
                    </FeatureGroup>
                )}

                {!heatmapVisible && !weatherHeatmapVisible && (
                    <>
                        <MarkerLayer
                            markers={markers}
                            onClick={(m: any) => deleteMode && deleteMarker(m.id)}
                        />
                        <ShapeLayer
                            shapes={shapes}
                            onClick={(s: any) => deleteMode && deleteShape(s.id)}
                        />
                    </>
                )}

                <MapEvents/>
                {distanceLine.length ==0&&distancePoints.map((p, idx)=>(
                    <Marker key={idx} position={[p.lat, p.lng]}/>
                ))}
                {distanceLine.length > 0 && (
                    <>
                        <Polyline positions={distanceLine} color="red" weight={4} />
                        <Marker position={distanceLine[0]}>
                            <Popup>origin</Popup>
                        </Marker>
                        <Marker position={distanceLine[distanceLine.length-1]}>
                            <Popup>
                                destination:
                                {distanceKm!==null && <div>distance: {distanceKm.toFixed(2)} km</div>}
                            </Popup>
                        </Marker>
                    </>
                )}
                <HeatmapLayer
                    markers={markers}
                    shapes={shapes}
                    visible={heatmapVisible}
                    intensity={heatmapSettings.intensity}
                    radius={heatmapSettings.radius}
                    blur={heatmapSettings.blur}
                />

                <WeatherHeatmapLayer
                    visible={weatherHeatmapVisible}
                    weatherType={weatherHeatmapSettings.weatherType}
                    opacity={weatherHeatmapSettings.opacity}
                    updateInterval={weatherHeatmapSettings.updateInterval}
                />

            </MapContainer>

            {activePopup && (
                <PopupModal
                    onCancel={() => {
                        if (tempLayer) {
                            tempLayer.remove();
                            setTempLayer(null);
                        }
                        setActivePopup(null);
                        setDrawingMode("");
                    }}
                    onSave={handleSavePopup}
                />
            )}
        </div>
    );
};

export default MapPage;