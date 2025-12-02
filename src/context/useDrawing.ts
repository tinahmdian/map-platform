import { useState } from 'react';

export function useDrawing() {
    const [drawingMode, setDrawingMode] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [activePopup, setActivePopup] = useState<any>(null);

    const triggerDraw = (shapeType: string) => {
        setDrawingMode(shapeType);
        setTimeout(() => {
            const button = document.querySelector(`.leaflet-draw-draw-${shapeType}`);
            if (button instanceof HTMLElement) button.click();
        }, 50);
    };

    return {
        drawingMode,
        setDrawingMode,
        deleteMode,
        setDeleteMode,
        activePopup,
        setActivePopup,
        triggerDraw,
    };
}
