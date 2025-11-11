import { Trash2 } from "lucide-react";
interface Props {
    active: boolean;
    onToggle: () => void;
}

export const DeleteButton = ({ active, onToggle }: Props) => (
    <div className="absolute bottom-4 left-4 z-[1000]">
        <button
            onClick={onToggle}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white ${
                active ? 'bg-red-600 hover:bg-red-800' : 'bg-red-700 hover:bg-red-600'
            }`}
            title="delete shapes"
        >
            <Trash2 className="w-6 h-6" />
        </button>
    </div>
);
