interface Props {
    onCancel: () => void;
    onSave: (title: string, desc: string) => void;
}

export const PopupModal = ({ onCancel, onSave }: Props) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const title = (document.getElementById("title") as HTMLInputElement)?.value;
        const desc = (document.getElementById("desc") as HTMLTextAreaElement)?.value;

        onSave(title, desc);
    };

    return (
        <div className="absolute inset-0 bg-transparent bg-opacity-50 z-[2000] flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-xl p-6 w-80 flex flex-col gap-3"
            >
                <h3 className="text-lg text-black font-semibold mb-2">shape details</h3>

                <input
                    id="title"
                    type="text"
                    placeholder="title..."
                    className="border border-gray-900 p-2 rounded-md"
                    autoFocus
                />

                <textarea
                    id="desc"
                    placeholder="description..."
                    className="border border-gray-900 p-2 rounded-md"
                ></textarea>

                <div className="flex gap-3 mt-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 text-white py-2 bg-gray-500 rounded-md hover:bg-gray-700"
                    >
                        cancel
                    </button>

                    <button
                        type="submit"
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        save
                    </button>
                </div>
            </form>
        </div>
    );
};
