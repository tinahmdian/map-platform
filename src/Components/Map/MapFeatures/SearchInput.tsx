import React, {useState} from 'react';
import L from "leaflet";
import {useMap} from "react-leaflet";
import {Search} from "lucide-react";

function SearchInput() {
    const map = useMap();
    const [query,setQuery] = useState('');


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 14);
                L.marker([parseFloat(lat), parseFloat(lon)])
                    .addTo(map)
                    .bindPopup(display_name)
                    .openPopup();
            } else {
                alert('no location found.');
            }
        } catch {
            alert('please try again.');
        }
    };
    return (
        <div className="absolute top-4 right-4 z-[1000]">
            <form
                onSubmit={handleSearch}
                className="flex items-center bg-white rounded-xl shadow-md px-3 py-2 w-56 border border-gray-200 hover:shadow-lg transition-shadow"
            >

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by places..."
                    className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
                />
                <Search className="text-gray-500 w-4 h-4 mr-2" />
            </form>
        </div>
    );
}

export default SearchInput;