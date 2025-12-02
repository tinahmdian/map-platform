'use client'
import React from 'react';
import { Cloud } from 'lucide-react';
import WeatherLegend from "@/Components/Setting/ui/WeatherLegends";
import { WeatherHeatmapSettings } from '@/types/types';
import { WEATHER_TYPES, UPDATE_INTERVALS } from '../constants';
import {ToggleSwitch} from "@/Components/Setting/ui/ToggleSwitch";
import {SliderControl} from "@/Components/Setting/ui/SliderControl";

interface WeatherTabProps {
    visible: boolean;
    settings: WeatherHeatmapSettings;
    onToggle: (visible: boolean) => void;
    onSettingsChange: (settings: WeatherHeatmapSettings) => void;
}

export const WeatherTab: React.FC<WeatherTabProps> = ({
                                                          visible,
                                                          settings,
                                                          onToggle,
                                                          onSettingsChange,
                                                      }) => (
    <div className="space-y-6">
        <h3 className="font-medium text-gray-800">Weather Heatmap</h3>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Cloud className={`w-5 h-5 ${visible ? 'text-blue-600 animate-pulse' : 'text-blue-400'}`} />
                    <span className="font-medium text-gray-800">Global Weather Data</span>
                </div>
                <ToggleSwitch
                    enabled={visible}
                    onChange={onToggle}
                    label={visible ? 'Disable weather heatmap' : 'Enable weather heatmap'}
                />
            </div>

            {visible && (
                <div className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weather Data Type
                        </label>
                        <select
                            value={settings.weatherType}
                            onChange={(e) => onSettingsChange({
                                ...settings,
                                weatherType: e.target.value as any
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {WEATHER_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <SliderControl
                        label="Opacity"
                        value={settings.opacity}
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        onChange={(value) => onSettingsChange({ ...settings, opacity: value })}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Update Interval
                        </label>
                        <select
                            value={settings.updateInterval}
                            onChange={(e) => onSettingsChange({
                                ...settings,
                                updateInterval: parseInt(e.target.value)
                            })}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {UPDATE_INTERVALS.map(interval => (
                                <option key={interval.value} value={interval.value}>
                                    {interval.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <WeatherLegend type={settings.weatherType} />

                    <div className="text-xs text-gray-600 bg-white p-3 rounded border">
                        <p>Weather data provided by OpenWeatherMap</p>
                        <p className="mt-1">Data updates every {settings.updateInterval} minutes</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);