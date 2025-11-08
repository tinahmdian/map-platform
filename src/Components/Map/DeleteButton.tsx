interface Props {
    active: boolean;
    onToggle: () => void;
}

export const DeleteButton = ({ active, onToggle }: Props) => (
    <div className="absolute bottom-4 right-4 z-[1000]">
        <button
            onClick={onToggle}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white ${
                active ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            }`}
            title="حذف شکل‌ها"
        >
            🗑️
        </button>
    </div>
);
