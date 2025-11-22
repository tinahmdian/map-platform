const WEATHER_LEGENDS: Record<
    string,
    { color: string; label: string }[]
> = {
    temperature: [
        { color: "bg-blue-400", label: "Cold (< 0°C)" },
        { color: "bg-green-400", label: "Moderate (0°C - 20°C)" },
        { color: "bg-yellow-400", label: "Warm (20°C - 30°C)" },
        { color: "bg-red-400", label: "Hot (> 30°C)" }
    ],

    precipitation: [
        { color: "bg-blue-100", label: "Light Rain (0-2mm)" },
        { color: "bg-blue-300", label: "Moderate Rain (2-10mm)" },
        { color: "bg-blue-500", label: "Heavy Rain (10-50mm)" },
        { color: "bg-blue-700", label: "Extreme Rain (>50mm)" }
    ],

    pressure: [
        { color: "bg-blue-400", label: "Low Pressure (< 980 hPa)" },
        { color: "bg-yellow-400", label:"Normal (980-1010 hPa)"  },
        { color: "bg-red-400", label: "High Pressure (> 1010 hPa)" },
    ],

    clouds: [
        { color: "bg-gray-100", label: "Clear Sky (0-10%)" },
        { color: "bg-gray-300", label: "Partly Cloudy (10-50%)" },
        { color: "bg-gray-500", label: "Cloudy (50-90%)" },
        { color: "bg-gray-700", label: "Overcast (> 90%)" }
    ],

    wind: [
        { color: "bg-blue-700", label: "Calm (0-5 m/s)" },
        { color: "bg-green-300", label: "Breezy (5-10 m/s)" },
        { color: "bg-yellow-500", label: "Windy (10-20 m/s)" },
        { color: "bg-red-600", label: "Storm (> 20 m/s)" }
    ],

    snow: [
        { color: "bg-gray-100", label: "Light Snow (0-2cm)" },
        { color: "bg-gray-300", label: "Moderate Snow (2-10cm)" },
        { color: "bg-gray-500", label: "Heavy Snow (10-20cm)" },
        { color: "bg-gray-700", label: "Extreme Snow (>20cm)" }
    ]
};

const WeatherLegend = ({ type }: { type: string }) => {
    const data = WEATHER_LEGENDS[type];

    if (!data) return null;

    return (
        <div className="bg-white p-3 rounded border">
            <div className="text-sm font-medium text-gray-700 mb-2">Weather Legend</div>

            <div className="space-y-2 text-xs">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${item.color}`}></div>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default WeatherLegend