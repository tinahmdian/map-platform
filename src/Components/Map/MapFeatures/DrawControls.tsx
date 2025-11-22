
import React from "react";
import {

    Triangle,
    Square,
    Circle, MapPin, Ruler,
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
        { type: "distance", icon: <Ruler className="w-4 h-4 text-white" />, color: "bg-indigo-700", title: "Measure distance" },
    ];

    return (
        <div className="absolute top-52 left-4 z-[2000] flex flex-col gap-3">
            {buttons.map((btn) => (
                <div key={btn.type} className="relative group">
                    <button

                        onClick={() => onDraw(btn.type)}
                        className={`w-9 h-9 rounded-xl cursor-pointer shadow-md flex items-center justify-center hover:scale-105 transition-all hover:brightness-110 ${btn.color}`}
                    >
                        {btn.icon}
                    </button>
                    <div className="absolute bottom-full left-full transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {btn.title}
                    </div>
                </div>

            ))}
        </div>
    );
};
