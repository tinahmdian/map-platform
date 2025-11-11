
import { Circle, GeoJSON, Popup } from "react-leaflet";
import React from "react";

export const ShapeLayer = ({ shapes, onClick }: any) => {
    return (
        <>
            {shapes.map((s: any) => {
                const type = s.data.geometry.type;
                const props = s.data.properties || {};
                const meta = s; // شامل title، description

                if (props.radius && type === "Point") {
                    const [lng, lat] = s.data.geometry.coordinates;
                    return (
                        <Circle
                            key={s.id}
                            center={[lat, lng]}
                            radius={props.radius}
                            pathOptions={{ color: "#06b6d4", weight: 2 }}
                            eventHandlers={{ click: () => onClick?.(s) }}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <h3 className="font-semibold text-cyan-700">{meta.title}</h3>
                                    <p className="text-gray-600">{meta.description}</p>
                                </div>
                            </Popup>
                        </Circle>
                    );
                }

                return (
                    <GeoJSON
                        key={s.id}
                        data={s.data}
                        pathOptions={{ color: "#0ea5e9", weight: 2 }}
                        eventHandlers={{ click: () => onClick?.(s) }}
                    >
                        <Popup>
                            <div className="text-sm">
                                <h3 className="font-semibold text-cyan-800">{s.title}</h3>
                                <p className="text-gray-600">{s.description}</p>
                            </div>
                        </Popup>
                    </GeoJSON>
                );
            })}
        </>
    );
};
