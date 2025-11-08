'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
    MapContainer,
    TileLayer,
    FeatureGroup,
    Marker,
    GeoJSON,
    Popup,
} from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { db } from '@/db/db';
import { renderToString } from 'react-dom/server';

const MapPage = () => {
    const center: LatLngTuple = [35.3149, 46.9988];
    const zoom = 13;

    const mapRef = useRef<L.Map | null>(null);
    const featureGroupRef = useRef<L.FeatureGroup>(null);
    const editRef = useRef<any>(null);

    const [drawingMode, setDrawingMode] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [markers, setMarkers] = useState<any[]>([]);
    const [shapes, setShapes] = useState<any[]>([]);
    const [activePopup, setActivePopup] = useState<any>(null); // popup data

    // load data from Dexie
    useEffect(() => {
        const loadData = async () => {
            const savedMarkers = await db.markers.toArray();
            const savedShapes = await db.shapes.toArray();
            setMarkers(savedMarkers);
            setShapes(savedShapes);
        };
        loadData();
    }, []);

    // trigger draw
    const triggerDraw = (shapeType: string) => {
        setDrawingMode(shapeType);
        setTimeout(() => {
            const button = document.querySelector(`.leaflet-draw-draw-${shapeType}`);
            if (button instanceof HTMLElement) button.click();
        }, 50);
    };

    // custom marker icon
    const getMarkerIcon = (color: string) => {
        const markerHtml = renderToString(
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="40"
                height="40"
                fill={color}
                stroke="black"
                strokeWidth="1"
            >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 4.34 5.8 11.17 6.08 11.5.39.5 1.45.5 1.84 0C13.2 20.17 19 13.34 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
        );
        return L.divIcon({
            className: 'custom-marker',
            html: markerHtml,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });
    };

    // when shape or marker created
    const handleCreated = async (e: any) => {
        const layer = e.layer;
        if (drawingMode === 'marker') {
            const { lat, lng } = layer.getLatLng();
            setActivePopup({
                type: 'marker',
                lat,
                lng,
            });
        } else {
            const geojson = layer.toGeoJSON();
            setActivePopup({
                type: 'shape',
                data: geojson,
            });
        }
    };

    // handle saving popup data
    const handleSavePopup = async (title: string, description: string) => {
        if (!activePopup) return;

        if (activePopup.type === 'marker') {
            const newMarker = {
                lat: activePopup.lat,
                lng: activePopup.lng,
                title,
                description,
                color: '#3b82f6',
                createdAt: new Date(),
            };
            const id = await db.markers.add(newMarker);
            setMarkers(prev => [...prev, { ...newMarker, id }]);
        } else {
            const newShape = {
                data: activePopup.data,
                title,
                description,
                createdAt: new Date(),
            };
            const id = await db.shapes.add(newShape);
            setShapes(prev => [...prev, { ...newShape, id }]);
        }

        setActivePopup(null);
        setDrawingMode('');
    };

    // delete modes
    const handleMarkerClick = async (marker: any) => {
        if (!deleteMode) return;
        await db.markers.delete(marker.id);
        setMarkers(prev => prev.filter(m => m.id !== marker.id));
    };

    const handleShapeClick = async (shape: any) => {
        if (!deleteMode) return;
        await db.shapes.delete(shape.id);
        setShapes(prev => prev.filter(s => s.id !== shape.id));
    };

    return (
        <div className="relative w-full h-screen">
            {/* Floating Draw Buttons */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
                <button onClick={() => triggerDraw('marker')} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white bg-green-500 hover:bg-green-600" title="رسم مارکر">🖊️</button>
                <button onClick={() => triggerDraw('polygon')} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600" title="رسم چندضلعی">🔺</button>
                <button onClick={() => triggerDraw('rectangle')} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white bg-purple-500 hover:bg-purple-600" title="رسم مستطیل">▭</button>
                <button onClick={() => triggerDraw('circle')} className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white bg-red-500 hover:bg-red-600" title="رسم دایره">⚪</button>
            </div>

            {/* Trash Button */}
            <div className="absolute bottom-4 right-4 z-[1000]">
                <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white ${deleteMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
                    title="حذف شکل‌ها"
                >
                    🗑️
                </button>
            </div>

            <MapContainer
                center={center}
                zoom={zoom}
                preferCanvas
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                ref={(ref) => { if (ref && !mapRef.current) mapRef.current = ref; }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                        ref={editRef}
                        position="topright"
                        draw={{
                            polygon: drawingMode === 'polygon',
                            rectangle: drawingMode === 'rectangle',
                            circle: drawingMode === 'circle' ? { shapeOptions: { color: '#f87171', fillOpacity: 0.2 } } : false,
                            circlemarker: false,
                            marker: drawingMode === 'marker',
                            polyline: false,
                        }}
                        edit={{ edit: false, remove: false }}
                        onCreated={handleCreated}
                    />
                </FeatureGroup>

                {/* Render Markers */}
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        position={[marker.lat, marker.lng]}
                        icon={getMarkerIcon(marker.color)}
                        eventHandlers={{
                            click: () => handleMarkerClick(marker),
                        }}
                    >
                        <Popup>
                            <strong>{marker.title}</strong><br />
                            <span>{marker.description}</span>
                        </Popup>
                    </Marker>
                ))}

                {/* Render Shapes */}
                {shapes.map(shape => (
                    <GeoJSON
                        key={shape.id}
                        data={shape.data}
                        eventHandlers={{
                            click: () => handleShapeClick(shape),
                        }}
                    >
                        <Popup>
                            <strong>{shape.title}</strong><br />
                            <span>{shape.description}</span>
                        </Popup>
                    </GeoJSON>
                ))}
            </MapContainer>

            {/* Popup Input Modal */}
            {activePopup && (
                <div className="absolute inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-3">
                        <h3 className="text-lg font-semibold mb-2">افزودن جزئیات</h3>
                        <input id="title" type="text" placeholder="عنوان..." className="border p-2 rounded-md" />
                        <textarea id="desc" placeholder="توضیحات..." className="border p-2 rounded-md"></textarea>
                        <div className="flex justify-end gap-3 mt-3">
                            <button onClick={() => setActivePopup(null)} className="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400">لغو</button>
                            <button
                                onClick={() => {
                                    const title = (document.getElementById('title') as HTMLInputElement)?.value;
                                    const description = (document.getElementById('desc') as HTMLTextAreaElement)?.value;
                                    handleSavePopup(title, description);
                                }}
                                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                ذخیره
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapPage;
