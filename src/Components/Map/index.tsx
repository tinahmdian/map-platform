'use client';
import React, { useRef } from 'react';
import {
    MapContainer,
    TileLayer,
} from 'react-leaflet';
import L, {LatLngTuple} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';


declare global {
    interface Window {
        leafletMap: L.Map|null;
    }
}
declare module "leaflet" {
    function heatLayer(
        latlngs: L.LatLngExpression[],
        options?: {
            minOpacity?: number;
            maxZoom?: number;
            radius?: number;
            blur?: number;
            gradient?: Record<number, string>;
            max?: number;
        }
    ): L.Layer;
}
const MapPage= () => {
    const center:LatLngTuple = [35.3149, 46.9988]
    const zoom = 13

    const mapRef = useRef<L.Map | null>(null);
   return (
            <div  className="print-container"
                 style={{ width: '100%', height: '100%' }}>
                    <MapContainer
                        data-testid="map"
                        id="map"
                        center={center}
                        zoom={zoom}
                        preferCanvas
                        style={{height: '100vh', width: '100%'}}
                        zoomControl={false}
                        ref={(ref) => {
                            if (ref && !mapRef.current) {
                                mapRef.current = ref;
                            }
                        }}
                        // whenReady={(event: LeafletEvent) => {
                        //     const mapInstance = event.target;
                        //     if (!mapRef.current) mapRef.current = mapInstance;
                        // }}
                    >
                        <TileLayer
                            tms={false}
                            maxZoom={18}
                            url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                            // attribution={layersConfig.find((l) => l.url === activeLayer)?.attribution || ''}
                        />
                    </MapContainer>
            </div>
    );
};

export default MapPage;
