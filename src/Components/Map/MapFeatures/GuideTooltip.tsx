import { useState, useEffect } from "react";

export const GuideTooltip = ({ deleteMode,distanceMode }: { deleteMode: boolean,distanceMode: boolean }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX + 15, y: e.clientY + 15 });
        };

        if (deleteMode||distanceMode) {
            window.addEventListener("mousemove", handleMove);
        } else {
            setMousePos({ x: 0, y: 0 });
        }

        return () => window.removeEventListener("mousemove", handleMove);
    }, [deleteMode,distanceMode]);

    if (!deleteMode && !distanceMode) return null;


    return (
        <div
            className="fixed z-[9999] my-3  px-3 py-2 bg-black text-white text-sm rounded-lg pointer-events-none shadow-lg"
            style={{
                top: mousePos.y,
                left: mousePos.x,
                transform: "translate(-50%, -50%)",
            }}
        >
            {deleteMode?'Click on the shape you want to delete':distanceMode?'click on the origin and destination you want ':''}
        </div>
    );
};
