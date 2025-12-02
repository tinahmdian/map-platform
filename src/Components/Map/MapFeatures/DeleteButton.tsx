import {Locate, Trash2} from "lucide-react";
import React from "react";
interface Props {
    active: boolean;
    onToggle: () => void;
}

export const DeleteButton = ({ active, onToggle }: Props) => (
    <div className="absolute bottom-4 left-4 z-[1000]">
    <div className="relative group">
            <button
                onClick={onToggle}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white ${
                    active ? 'bg-red-600 hover:bg-red-800' : 'bg-red-700 hover:bg-red-600'
                }`}
            >
                <Trash2 className="w-6 h-6" />
                <div className="absolute bottom-full left-[50px] transform -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   Delete shapes
                </div>
            </button>
        </div>

    </div>

);
