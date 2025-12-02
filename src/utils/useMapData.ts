import { useState, useEffect } from 'react';
import { db } from '@/db/db';
import {useDrawing} from "@/context/useDrawing";

export function useMapData() {
    const {setDeleteMode}=useDrawing()
    const [markers, setMarkers] = useState<any[]>([]);
    const [shapes, setShapes] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const [m, s] = await Promise.all([
                db.markers.toArray(),
                db.shapes.toArray(),
            ]);
            setMarkers(m);
            setShapes(s);
        };
        load();
    }, []);

    const addMarker = async (marker: any) => {
        const id = await db.markers.add(marker);
        setMarkers((prev) => [...prev, { ...marker, id }]);
    };

    const addShape = async (shape: any) => {
        const id = await db.shapes.add(shape);
        setShapes((prev) => [...prev, { ...shape, id }]);
    };

    const deleteMarker = async (id: number) => {
        await db.markers.delete(id);
        setDeleteMode(false)
        setMarkers((prev) => prev.filter((m) => m.id !== id));
    };

    const deleteShape = async (id: number) => {
        await db.shapes.delete(id);
        setShapes((prev) => prev.filter((s) => s.id !== id));
    };

    return { markers, shapes, addMarker, addShape, deleteMarker, deleteShape };
}
