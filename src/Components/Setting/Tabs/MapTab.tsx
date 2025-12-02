import React from 'react';
import { BASE_MAPS } from '../constants';

interface MapTabProps {
    baseMap: string;
    onBaseMapChange: (mapType: string) => void;
}

export const MapTab: React.FC<MapTabProps> = ({ baseMap, onBaseMapChange }) => (
    <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Base Map Style</h3>
        <div className="space-y-3">
            {BASE_MAPS.map((map) => (
                <div
                    key={map.id}
                    onClick={() => onBaseMapChange(map.id)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        baseMap === map.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <div className="font-medium text-gray-800">{map.name}</div>
                    <div className="text-sm text-gray-600">{map.description}</div>
                </div>
            ))}
        </div>
    </div>
);