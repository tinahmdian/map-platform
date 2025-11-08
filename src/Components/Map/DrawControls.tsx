// components/map/DrawControls.tsx
import React from 'react';

interface Props {
    onDraw: (type: string) => void;
}

export const DrawControls: React.FC<Props> = ({ onDraw }) => {
    const buttons = [
        { type: 'marker', label: '🖊️', color: 'bg-green-500', title: 'رسم مارکر' },
        { type: 'polygon', label: '🔺', color: 'bg-blue-500', title: 'رسم چندضلعی' },
        { type: 'rectangle', label: '▭', color: 'bg-purple-500', title: 'رسم مستطیل' },
        { type: 'circle', label: '⚪', color: 'bg-red-500', title: 'رسم دایره' },
    ];

    return (
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
            {buttons.map(btn => (
                <button
                    key={btn.type}
                    onClick={() => onDraw(btn.type)}
                    className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white hover:brightness-110 transition-all ${btn.color}`}
                    title={btn.title}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
};
