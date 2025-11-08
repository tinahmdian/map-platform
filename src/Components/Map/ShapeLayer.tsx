// components/map/ShapeLayer.tsx
import React from 'react';
import { GeoJSON, Popup } from 'react-leaflet';

interface ShapeLayerProps {
    shapes: any[];
    onClick: (shape: any) => void;
}

export const ShapeLayer: React.FC<ShapeLayerProps> = ({ shapes, onClick }) => {
    return (
        <>
            {shapes.map(shape => (
                <GeoJSON
                    key={shape.id}
                    data={shape.data}
                    eventHandlers={{
                        click: () => onClick(shape),
                    }}
                >
                    <Popup>
                        <strong>{shape.title}</strong><br />
                        <span>{shape.description}</span>
                    </Popup>
                </GeoJSON>
            ))}
        </>
    );
};
