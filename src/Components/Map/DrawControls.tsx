
import React from "react";
import {

    Triangle,
    Square,
    Circle, MapPin,
} from "lucide-react";

interface Props {
    onDraw: (type: string) => void;
}

export const DrawControls: React.FC<Props> = ({ onDraw }) => {
    const buttons = [
        { type: "marker", icon: <MapPin className="w-4 h-4 text-white" />, color: "bg-teal-700", title: "Draw marker" },
        { type: "polygon", icon: <Triangle className="w-4 h-4 text-white" />, color: "bg-teal-700", title: "Draw polygon" },
        { type: "rectangle", icon: <Square className="w-4 h-4 text-white" />, color: "bg-teal-700", title: "Draw rectangle" },
        { type: "circle", icon: <Circle className="w-4 h-4 text-white" />, color: "bg-teal-700", title: "Draw circle" },
    ];

    return (
        <div className="absolute top-52 left-4 z-[1000] flex flex-col gap-3">
            {buttons.map((btn) => (
                <button
                    key={btn.type}
                    onClick={() => onDraw(btn.type)}
                    className={`w-9 h-9 rounded-xl shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 ${btn.color}`}
                    title={btn.title}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};
