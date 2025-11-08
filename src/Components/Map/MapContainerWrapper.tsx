'use client';
import React from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useMapData } from '@/utils/useMapData';
import { useDrawing } from '@/utils/useDrawing';
import { DrawControls } from './DrawControls';
import { DeleteButton } from './DeleteButton';
import { MarkerLayer } from './MarkerLayer';
import { ShapeLayer } from './ShapeLayer';
import { PopupModal } from './PopupModal';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapPage = () => {
    const { markers, shapes, addMarker, addShape, deleteMarker, deleteShape } = useMapData();
    const { drawingMode, deleteMode, setDeleteMode, triggerDraw, activePopup, setActivePopup, setDrawingMode } = useDrawing();

    const handleCreated = (e: any) => {
        const layer = e.layer;
        if (drawingMode === 'marker') {
            const { lat, lng } = layer.getLatLng();
            setActivePopup({ type: 'marker', lat, lng });
        } else {
            const data = layer.toGeoJSON();
            setActivePopup({ type: 'shape', data });
        }
    };

    const handleSavePopup = (title: string, desc: string) => {
        if (!activePopup) return;
        if (activePopup.type === 'marker') addMarker({ lat: activePopup.lat, lng: activePopup.lng, title, description: desc, color: '#3b82f6', createdAt: new Date() });
        else addShape({ data: activePopup.data, title, description: desc, createdAt: new Date() });
        setActivePopup(null);
        setDrawingMode('');
    };

    return (
        <div className="relative w-full h-screen">
            <DrawControls onDraw={triggerDraw} />
            <DeleteButton active={deleteMode} onToggle={() => setDeleteMode(!deleteMode)} />

            <MapContainer center={[35.3149, 46.9988]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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

                <MarkerLayer markers={markers} onClick={(m: any) => deleteMode && deleteMarker(m.id)} />
                <ShapeLayer shapes={shapes} onClick={(s: any) => deleteMode && deleteShape(s.id)} />
            </MapContainer>

            {activePopup && (
                <PopupModal onCancel={() => setActivePopup(null)} onSave={handleSavePopup} />
            )}
        </div>
    );
};

export default MapPage;
