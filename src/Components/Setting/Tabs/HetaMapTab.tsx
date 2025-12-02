import React from 'react';
import { Flame } from 'lucide-react';
import { HeatmapSettings } from '@/types/types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { SliderControl } from '../ui/SliderControl';

interface HeatmapTabProps {
    visible: boolean;
    settings: HeatmapSettings;
    markers: any[];
    shapes: any[];
    onToggle: (visible: boolean) => void;
    onSettingsChange: (settings: HeatmapSettings) => void;
}

export const HeatmapTab: React.FC<HeatmapTabProps> = ({
                                                          visible,
                                                          settings,
                                                          markers,
                                                          shapes,
                                                          onToggle,
                                                          onSettingsChange,
                                                      }) => {
    const calculateHeatmapPoints = (markers: any[], shapes: any[]): number => {
        let points = markers.length;

        shapes.forEach(shape => {
            const geometry = shape.data?.geometry;
            if (geometry?.type === 'Polygon' && geometry.coordinates?.[0]) {
                points += geometry.coordinates[0].length;
            } else if (geometry?.type === 'Circle') {
                points += 9;
            } else if (geometry?.type === 'Rectangle' && geometry.coordinates?.[0]) {
                points += 4;
            } else {
                points += 1;
            }
        });

        return points;
    };

    return (
        <div className="space-y-6">
            <h3 className="font-medium text-gray-800">Heatmap Settings</h3>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Flame className={`w-5 h-5 ${visible ? 'text-orange-600 animate-pulse' : 'text-orange-400'}`} />
                        <span className="font-medium text-gray-800">Heatmap Visualization</span>
                    </div>
                    <ToggleSwitch
                        enabled={visible}
                        onChange={onToggle}
                        label={visible ? 'Disable heatmap' : 'Enable heatmap'}
                    />
                </div>

                {visible ? (
                    <div className="space-y-4 mt-4">
                        <div className="bg-white p-3 rounded border">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Data Points:</span>
                                <span className="font-semibold">{calculateHeatmapPoints(markers, shapes)} points</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Sources:</span>
                                <span className="font-semibold">{markers.length} markers, {shapes.length} shapes</span>
                            </div>
                        </div>

                        <SliderControl
                            label="Intensity"
                            value={settings.intensity}
                            min={0.1}
                            max={2.0}
                            step={0.1}
                            onChange={(value) => onSettingsChange({ ...settings, intensity: value })}
                        />

                        <SliderControl
                            label="Radius"
                            value={settings.radius}
                            min={10}
                            max={50}
                            step={5}
                            onChange={(value) => onSettingsChange({ ...settings, radius: value })}
                            formatValue={(value) => `${value}px`}
                        />

                        <SliderControl
                            label="Blur"
                            value={settings.blur}
                            min={5}
                            max={30}
                            step={5}
                            onChange={(value) => onSettingsChange({ ...settings, blur: value })}
                            formatValue={(value) => `${value}px`}
                        />

                        <div className="bg-white p-3 rounded border">
                            <div className="text-sm font-medium text-gray-700 mb-2">Heatmap Legend</div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span>Low</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                                    <span>Medium</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-lime-500 rounded"></div>
                                    <span>High</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                    <span>Very High</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                                    <span>Hotspot</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        <Flame className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Enable heatmap to configure settings</p>
                    </div>
                )}
            </div>
        </div>
    );
};