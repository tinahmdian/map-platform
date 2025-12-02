import React from 'react';

interface SliderControlProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    formatValue?: (value: number) => string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
                                                                label,
                                                                value,
                                                                min,
                                                                max,
                                                                step,
                                                                onChange,
                                                                formatValue = (val) => val.toFixed(1),
                                                            }) => (
    <div>
        <label className="flex justify-between text-sm text-gray-700 mb-2">
            <span>{label}</span>
            <span className="font-mono bg-white px-2 py-1 rounded border">
        {formatValue(value)}
      </span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
        </div>
    </div>
);